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
            <el-form-item label="合约地址" prop="groupId">
                <el-input
                v-model="queryParams.contractAddress"
                placeholder="合约地址"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="合约名称" prop="groupId">
                <el-input
                v-model="queryParams.contractName"
                placeholder="合约名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="合约部署者地址" prop="groupId" label-width="120px"> 
                <el-input
                v-model="queryParams.deployAddress"
                placeholder="合约部署者地址"
                clearable
                size="medium"
                @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                <el-button type="success" @click="addNode" v-hasPermi="['system:chain:add']">部署合约</el-button>
            </el-form-item>
        </el-form>

        <el-table
        v-if="refreshTable"
        v-loading="loading"
        :data="chainlist"
        >
        <el-table-column prop="groupId" label="所属群组" width="160" align="center"></el-table-column>
        <el-table-column prop="contractName" label="合约名称"></el-table-column>
        <el-table-column prop="contractAddress" label="合约地址"></el-table-column>
        <el-table-column prop="deployAddress" label="合约部署者地址"></el-table-column>
        <el-table-column prop="deployTxHash" label="合约部署的交易哈希"></el-table-column>
        <el-table-column prop="contractType" label="合约类型">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.contractType===0" type="success">系统合约</el-tag>
                <el-tag v-if="scope.row.contractType===1" type="danger">业务合约</el-tag>
              </template>
        </el-table-column>
        <el-table-column prop="contractStatus" label="部署状态">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.contractStatus===2" type="success">未部署</el-tag>
                <el-tag v-if="scope.row.contractStatus===0" type="danger">部署成功</el-tag>
                <el-tag v-if="scope.row.contractStatus===1" type="danger">部署失败</el-tag>
              </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
            <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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
            @pagination="geChian"
            />

        <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
            <el-form ref="form" :model="chain" label-width="100px">
                <el-descriptions class="margin-top" :column="1" border>
                    <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-tickets"></i>
                        合约名称
                    </template>
                    {{chain.contractName}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-tickets"></i>
                        所属群组
                    </template>
                    {{chain.groupId}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-tickets"></i>
                        合约哈希
                    </template>
                    {{chain.deployTxHash}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-user"></i>
                        区高
                    </template>
                    {{chain.blockNumber}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-mobile-phone"></i>
                        合约bin
                    </template>
                    {{chain.bytecodeBin}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-location-outline"></i>
                        合约abi
                    </template>
                    {{chain.contractAbi}}
                    </el-descriptions-item>
                </el-descriptions>  
            </el-form>  
        </el-dialog>

        <el-dialog :title="title" :visible.sync="nodeopen" width="600px" append-to-body>
            <el-form ref="form" :model="formlist" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :span="24">
                    <el-form-item label="合约名称" prop="contractName" >
                        <el-input v-model="formlist.contractName" placeholder="请输入合约名称" maxlength="50" />
                    </el-form-item>
                    <el-form-item label="合约abi" prop="contractAbi" >
                        <el-input v-model="formlist.contractAbi" placeholder="请输入合约abi"  type="textarea" />
                    </el-form-item>
                    <el-form-item label="合约Bin" prop="contractBin" >
                        <el-input v-model="formlist.contractBin" placeholder="请输入合约Bin" type="textarea" />
                    </el-form-item>
                    <el-form-item label="合约类型" prop="contractStatus" >
                        <template>
                            <el-radio v-model="formlist.contractStatus" label="0">系统合约</el-radio>
                            <el-radio v-model="formlist.contractStatus" label="1">业务合约</el-radio>
                        </template>
                    </el-form-item>
                    <el-form-item label="构造函数参数">
                        <el-input v-model="formlist.params" placeholder="构造函数参数，如果没有就不填"/>
                    </el-form-item>
                    <el-form-item label="群组">
                        <el-select v-model="formlist.groupId" placeholder="请选择群组">
                            <el-option v-for="dept in groupList" :label="dept.groupId" :value="dept.groupId" :key="dept.id"></el-option>
                        </el-select>
                        <!-- <el-input v-model="formlist.groupId" placeholder="请选择群组" maxlength="50" /> -->
                    </el-form-item>
                    </el-col>
                    <el-col :span="24">
                    <el-button type="primary" @click="addchain">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                    </el-col>   
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
  import { listChain,setDynam,groupList,getChain } from "@/api/system/chain";
  import { Loading } from 'element-ui';
  export default {
    name: "Chain",
    dicts: ['sys_normal_disable'],
    data() {
      return {
         // 遮罩层
        loading: true,
        nodeopen: false,
        open: false,
        title: undefined,
        // 重新渲染表格状态
        refreshTable: true,
        chainlist: [],
        // 显示搜索条件
        showSearch: true,
        // 日期范围
        dateRange: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          groupId: undefined,
          contractAddress: undefined,
          deployAddress: undefined
        },
        // 总条数
        total: 0,
        //合约信息
        chain:{},
        //合约信息
        formlist:[],
        groupList: [],
        // 表单校验
        rules: {
          contractName: [
            { required: true, message: "合约名称不能为空", trigger: "blur" }
          ],
          contractAbi: [
            { required: true, message: "合约abi不能为空", trigger: "blur" }
          ],
          contractBin: [
            { required: true, message: "合约Bin不能为空", trigger: "blur" }
          ],
          contractStatus: [
            { required: true, message: "请选择合约类型", trigger: "blur" }
          ],
          groupId: [
            { required: true, message: "请选择群组", trigger: "blur" }
          ],
          deptId: [
            { required: true, message: "请选择部门", trigger: "blur" }
          ]
        },
        options: {
          lock: true,
          text: '查询中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        }
      };
    },
    created() {
      this.geChian();
    },
    methods: {
        /** 查询合约列表 */
        geChian() {
            this.loading = true;
            listChain(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                this.chainlist = response.data.rows;
                this.total = response.data.total;
                this.loading = false;
            }
            );
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.geChian();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.loading = false;
            this.queryParams = {
                pageNum: 1,
                pageSize: 10,
                groupId: undefined,
                contractAddress: undefined,
                deployAddress: undefined
            },
            this.geChian();
        },
        //部署合约
        addNode(){
            groupList().then(response => {
                this.groupList = response;
            }
            );
            this.nodeopen = true;
            this.title = "合约部署";
            this.formlist = {
                contractName: undefined,
                contractAbi: undefined,
                contractBin: undefined,
                contractStatus: undefined,
                params: undefined,
                groupId: undefined
            }
        },
        addchain: function(){
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.options.text = "合约部署中"
                    let loadingInstance = Loading.service(this.options);
                    this.$nextTick(() =>{
                        this.formlist.contractAbi = btoa(this.formlist.contractAbi);
                        this.formlist.contractBin = btoa(this.formlist.contractBin);
                        setDynam(this.formlist).then(response=>{
                            this.nodeopen = false;
                            this.$modal.msgSuccess("部署成功");
                            loadingInstance.close();
                        })
                    })
                }
                this.geChian();
            })
        },
        //取消
        cancel() {
            this.nodeopen = false;
            this.formlist = [];
        },
        //查看详情
        handleUpdate(Id){
            this.options.text = "查询中"
            let loadingInstance = Loading.service(this.options);
            this.$nextTick(() =>{
                getChain(Id).then(response => {
                    this.chain = response.data;
                    this.title = "合约详细"
                    this.open = true
                    loadingInstance.close();  
                })
            })
           
        }
    }
  };
</script>