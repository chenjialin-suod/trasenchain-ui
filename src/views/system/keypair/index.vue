<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="群组名称" prop="groupId">
          <el-input
            v-model="queryParams.groupId"
            placeholder="群组名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="账号地址" prop="address">
          <el-input
            v-model="queryParams.address"
            placeholder="账号地址"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="账号公钥" prop="public_key">
          <el-input
            v-model="queryParams.public_key"
            placeholder="账号公钥"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="UserPoList"
        >
        <el-table-column prop="groupId" label="所属群组" width="160" align="center"></el-table-column>
        <el-table-column prop="address" label="用户地址"></el-table-column>
        <el-table-column prop="curveName" label="加密方式" width="100"></el-table-column>
        <el-table-column prop="publicKey" label="公钥"></el-table-column>
        <el-table-column prop="getKeyPair" label="私钥"></el-table-column>
        <!-- <el-table-column prop="contractType" label="合约类型">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.contractType===0" type="success">系统合约</el-tag>
                <el-tag v-if="scope.row.contractType===1" type="danger">业务合约</el-tag>
              </template>
        </el-table-column> -->
        <el-table-column label="创建时间" align="center" prop="createTime" width="150">
            <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
            <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row.id)"
                v-hasPermi="['system:chain:get']"
            >查看详情</el-button>
            <!-- <el-button
                size="mini"
                type="text"
                icon="el-icon-plus"
                @click="handleAdd(scope.row.id)"
                v-hasPermi="['system:chain:crt']"
            >下载证书文件</el-button> -->
            </template>
        </el-table-column>
        </el-table>
        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getUserPo"
            />
    </div>
</template>
<script>
import { getUserPoList } from "@/api/system/keypair";
import { Loading } from 'element-ui';
export default {
    name: "node",
    data() {
      return {
        open: false,
        loading: true,
        // 重新渲染表格状态
        refreshTable: true,
        // 显示搜索条件
        showSearch: true,
        // 弹出层标题
        title: "",
        // 日期范围
        dateRange: [],
        // 查询参数
        UserPoList: [],
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          groupId: undefined,
          address: undefined,
          public_key: undefined
        },
        //
        // 总条数
        total: 0,
        options: {
          lock: true,
          text: '查询中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        },
        // 表单参数
      };
    },
    created() {
      this.getUserPo();
    },
    methods: {
      /** 查询用户私钥列表 */
      getUserPo(){
        this.loading = true;
        getUserPoList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.UserPoList = response.rows
          this.total = response.total
          this.loading = false;
        });
      },
       /** 搜索按钮操作 */
       handleQuery() {
            this.queryParams.pageNum = 1;
            this.getUserPo();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.loading = false;
            this.queryParams = {
              pageNum: 1,
              pageSize: 10,
              groupId: undefined,
              address: undefined,
              public_key: undefined
            },
            this.getUserPo();
        },  
    }
  };
</script>