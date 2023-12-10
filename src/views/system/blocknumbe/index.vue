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
            <el-form-item label="最小区高" prop="groupId">
                <el-input
                v-model="queryParams.minrow"
                placeholder="最小区高"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item label="最大区高" prop="groupId">
                <el-input
                v-model="queryParams.maxbox"
                placeholder="最小区高"
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
        :data="Betalist"
        >
        <el-table-column prop="groupId" label="所属群组" width="160" align="center"></el-table-column>
        <el-table-column prop="blockNumber" width="100" label="区高"></el-table-column>
        <el-table-column prop="pkHash" label="区块Hash"></el-table-column>
        <el-table-column prop="txHash" label="交易Hash"></el-table-column>
        <el-table-column label="出块时间" align="center" width="160" prop="blockTimestamp">
            <template slot-scope="scope">
            <span>{{ parseTime(scope.row.blockTimestamp) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
            <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="QueryTxHash(scope.row.groupId,scope.row.txHash,scope.row.blockId)"
                v-hasPermi="['system:blocknumbe:tx']"
            >查看交易信息</el-button>
            <el-button
                size="mini"
                type="text"
                icon="el-icon-plus"
                @click="BlockByHash(scope.row.groupId,scope.row.pkHash)"
                v-hasPermi="['system:blocknumbe:pk']"
            >查看区块信息</el-button>
            </template>
        </el-table-column>
        </el-table>
        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getBeta"
            />
      <el-dialog :visible.sync="open" append-to-body>
        <el-form ref="form" :model="formlist" label-width="100px">
            <el-descriptions :title="title" class="margin-top" :column="2" border>
                <el-descriptions-item label="防止交易重复Limit">{{formlist.blockLimit}}</el-descriptions-item>
                <el-descriptions-item label="交易发送者地址">{{formlist.from}}</el-descriptions-item>
                <el-descriptions-item label="交易接收者地址">{{formlist.to}}</el-descriptions-item>
                <el-descriptions-item label="交易发送时间">
                    {{ formlist.importTime }}
                </el-descriptions-item>
                <el-descriptions-item label="所属群组">{{formlist.groupID}}</el-descriptions-item>
            </el-descriptions>
        </el-form>
      </el-dialog>

      <el-dialog :title="title" :visible.sync="nodeopen" append-to-body>
        <el-form ref="form" title="区块" :model="blockhashList" label-width="100px">
            <el-descriptions title="当前区块" class="margin-top" :column="2" border> 
                <el-descriptions-item label="区块hash">{{blockhashList.hash}}</el-descriptions-item>
                <el-descriptions-item label="区块高">{{blockhashList.number}}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="上一个区块" class="margin-top" v-for="parentInfo in blockhashList.parentInfo" :column="2" border> 
                <el-descriptions-item label="区块hash">{{parentInfo.blockHash}}</el-descriptions-item>
                <el-descriptions-item label="区块高">{{parentInfo.blockNumber}}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="接收节点" class="margin-top" :column="2" v-for="sealerList in blockhashList.sealerList"  border> 
                <el-descriptions-item label="节点地址">{{sealerList}}</el-descriptions-item>
            </el-descriptions>

            <!-- <el-descriptions-item label="交易节点" v-for="sealerLis in blockhashList.sealerLis">{{sealerLis.}}</el-descriptions-item> -->
            <!-- <el-descriptions title="交易信息" v-for="transactionsTo in TransactionsTo" class="margin-top" :column="2" border>
                <el-descriptions-item label="所属群组">{{transactionsTo.groupID}}</el-descriptions-item>
                <el-descriptions-item label="交易hash">{{transactionsTo.hash}}</el-descriptions-item>
            </el-descriptions> -->
        </el-form>
      </el-dialog>

    </div>
</template>
<script>
  import { getBetailInfo,getTransactionInformation,getBlockByHash } from "@/api/system/blocknumbe";
  import { Loading } from 'element-ui';
  export default {
    name: "blocknumbe",
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
        Betalist: [],
        // 显示搜索条件
        showSearch: true,
        // 日期范围
        dateRange: [],
        TransactionsTo:[],
        BlockByHashDTO: [],
        blockhashList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          groupId: undefined,
          minrow: 0,
          maxbox: 100
        },
        // 总条数
        total: 0,
        //合约信息
        chain:{},
        //合约信息
        formlist:[],
        groupList: [],
        options: {
          lock: true,
          text: '查询中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        }
      };
    },
    created() {
      this.getBeta();
    },
    methods: {
        /** 查询合约列表 */
        getBeta() {
            this.loading = true;
            getBetailInfo(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                this.Betalist = response.rows;
                this.total = response.total;
                this.loading = false;
            }
            );
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getBeta();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.loading = false;
            this.queryParams = {
                pageNum: 1,
                pageSize: 10,
                groupId: undefined,
                minrow: 0,
                maxbox: 100
            },
            this.getBeta();
        },
        //查看区块详情
        BlockByHash(groupId,pkHash){
            let loadingInstance = Loading.service(this.options);
            this.$nextTick(() =>{
                this.BlockByHashDTO = {
                    groupId: groupId,
                    blockHash: pkHash,
                    onlyHeader: false,
                    onlyTxHash: false
                };
                getBlockByHash(this.BlockByHashDTO).then(response =>{
                    this.blockhashList = response.data.block
                    this.title="区块信息"
                    this.nodeopen = true
                    // console.log(this.blockhashList)
                    // console.log(this.TransactionsTo)
                    loadingInstance.close();  
                });
            })
        },
        //查看交易详情
        QueryTxHash(groupId,txHash,blockId){
            let loadingInstance = Loading.service(this.options);
            this.$nextTick(() =>{
                this.TransactionsTo = {
                    groupId: groupId,
                    transactionHash: txHash,
                    withProof: true,
                    blockId: blockId
                }
                getTransactionInformation(this.TransactionsTo).then(response => {  
                    console.log(response) 
                    response.data.result.importTime = this.timestampToDateString(response.data.result.importTime);
                    this.formlist = response.data.result
                    this.title = "交易详情"
                    this.open = true
                    loadingInstance.close();  
                })
            })
        },
        timestampToDateString(timestamp) {
            // 创建一个Date对象
            var date = new Date(timestamp);

            // 获取年、月、日、小时、分钟和秒
            var year = date.getFullYear();
            var month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份从0开始，需要加1
            var day = ('0' + date.getDate()).slice(-2);
            var hours = ('0' + date.getHours()).slice(-2);
            var minutes = ('0' + date.getMinutes()).slice(-2);
            var seconds = ('0' + date.getSeconds()).slice(-2);

            // 格式化日期字符串
            var formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

            return formattedDate;
        }
    }
  };
</script>