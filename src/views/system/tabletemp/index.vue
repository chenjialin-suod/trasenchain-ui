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
            <el-form-item label="数据名" prop="groupId">
                <el-input
                v-model="queryParams.tableName"
                placeholder="数据名"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                <el-button icon="el-icon-plus" size="mini" v-hasPermi="['system:Table:Gpset']" @click="setTable">数据上链</el-button>
            </el-form-item>
            <el-table
            v-if="refreshTable"
            v-loading="loading"
            :data="Betalist"
            >
                <el-table-column prop="groupId" label="所属群组" width="160" align="center"></el-table-column>
                <el-table-column prop="tableName" width="100" label="数据名"></el-table-column>
                <el-table-column prop="tableId" label="数据key"></el-table-column>
                <el-table-column label="上链时间" align="center" width="160" prop="createTime">
                    <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="QueryData(scope.row.groupId,scope.row.tableName,scope.row.key)"
                        v-hasPermi="['system:Table:Gpget']"
                    >查看链上数据</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getTableTemp"
            />
        </el-form>

        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="fromList" label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="群组编号">
                            <el-select v-model="fromList.groupId" :default-first-option="true" filterable placeholder="请选择要上链的群组">
                                <el-option v-for="dept in group" :label="dept.groupId" :value="dept.groupId" :key="dept.id"></el-option>
                            </el-select>
                        </el-form-item>
                    
                    <el-form-item label="数据名称">
                        <el-input v-model="fromList.dataName" placeholder="请输入数据名称"  type="textarea" />
                    </el-form-item>
                    <el-form-item label="数据">
                        <el-input v-model="fromList.objectList" placeholder="请输入数据"  type="textarea" />
                    </el-form-item>
                        <el-button type="primary" @click="setTableF">确 定</el-button>
                        <el-button @click="cancel">取 消</el-button>
                    </el-col>   
                </el-row>
            </el-form>  
        </el-dialog>

        <el-dialog :title="title" :visible.sync="AsStringopen" width="600px" append-to-body>
            <el-table
            v-if="refreshTable"
            v-loading="loading"
            :data="AsStringList"
            >
                <el-table-column prop="typeAsString" label="类型"  align="center"></el-table-column>
                <el-table-column prop="value"  label="数据"></el-table-column>
            </el-table>
        </el-dialog>

    </div>
  </template>
  <script>
  import { getWebaseTableTemp,setData,getData } from "@/api/system/blocknumbe";
  import { groupList } from "@/api/system/chain";
  import { Loading } from 'element-ui';
  export default {
    name: "TableTemp",
    dicts: ['sys_normal_disable'],
    data() {
      return {
         // 遮罩层
        loading: true,
        open: false,
        AsStringopen: false,
        //
        title: undefined,
        // 重新渲染表格状态
        refreshTable: true,
        Betalist: [],
        group: [],
        AsStringList:[],
        // 显示搜索条件
        showSearch: true,
        // 日期范围
        dateRange: [],
        fromList: {},
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          groupId: undefined,
          tableName: undefined
        },
        // 总条数
        total: 0,
        //合约信息
        options: {
          lock: true,
          text: '查询中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        }
      };
    },
    created() {
      this.getTableTemp();
    },
    methods: {
        /** 查询合约列表 */
        getTableTemp() {
            this.loading = true;
            getWebaseTableTemp(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                this.Betalist = response.rows;
                this.total = response.total;
                this.loading = false;
            }
            );
        },
         /** 搜索按钮操作 */
         handleQuery() {
            this.queryParams.pageNum = 1;
            this.getTableTemp();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.loading = false;
            this.queryParams = {
                pageNum: 1,
                pageSize: 10,
                groupId: undefined,
                tableName: undefined
            },
            this.getTableTemp();
        },
        /**
         * 取消
         */
         cancel() {
            this.groupNodepen = false;
            this.fromList = {};
            this.open = false;
        },
        /**
         * 查询链上数据
         */
         QueryData(groupId,dataName,key){
            this.options.text = "数据查询中";
            let loadingInstance = Loading.service(this.options);
            var data = {
                groupId:groupId,
                dataName:dataName,
                key:key
            }
            this.$nextTick(() =>{
                getData(data).then(rps =>{
                    console.log(rps)
                    this.AsStringList = rps.data
                    this.title = "详细数据"
                    this.AsStringopen = true
                    loadingInstance.close(); 
                })
            })
         },
        /**
         * 数据上传
         */
        setTable(){
            this.fromList = {
                groupId:undefined,
                dataName:undefined,
                objectList: undefined
            }
            groupList().then(response => {
                this.group = response;
            })
            this.open = true;
            this.title = "数据上链"
        },
        setTableF: function(){
            this.options.text = "数据上链中";
            let loadingInstance = Loading.service(this.options);
            this.$nextTick(() =>{
                setData(this.fromList).then(rps =>{
                    console.log(rps)
                    this.open = false;
                    this.getTableTemp()
                    loadingInstance.close();  
                })
            })
        }
    }
  };
</script>