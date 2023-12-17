<template>
  <div class="dashboard-editor-container">
    <el-row>
      <el-col :span="8">
        <el-row :gutter="20" class="panel-group">
          <el-col :span="12" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
                  <!-- <div class="card-panel-icon-wrapper icon-people">
                    <svg-icon icon-class="peoples" class-name="card-panel-icon" />
                  </div> -->
                  <div class="card-panel-description">
                    <div class="card-panel-text">
                      <el-select v-model="TotalTransaction.groupId" :default-first-option="true" filterable @change="TotalTransactionCount" placeholder="群组">
                        <el-option v-for="dept in group" :label="dept.groupId" :value="dept.groupId" :key="dept.id"></el-option>
                      </el-select>
                    </div>
                    <!-- <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num"/> -->
                  </div>
                </div>
          </el-col>
          <el-col :span="12" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('messages')">
                <div class="card-panel-icon-wrapper icon-message">
                  <svg-icon icon-class="message" class-name="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    块高数量
                  </div>
                  <count-to :start-val="0" :end-val="this.Count.blockNumber" :duration="3000" class="card-panel-num" />
                </div>
              </div>
          </el-col>
          <el-col :span="12" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('purchases')">
              <div class="card-panel-icon-wrapper icon-money">
                <svg-icon icon-class="shopping" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  异常区块数量
                </div>
                <count-to :start-val="0" :end-val="this.Count.failedTransactionCount" :duration="3200" class="card-panel-num" />
              </div>
            </div>
          </el-col>
            <el-col :span="12" class="card-panel-col">
              <div class="card-panel" @click="handleSetLineChartData('purchases')">
                <div class="card-panel-icon-wrapper icon-money">
                  <svg-icon icon-class="money" class-name="card-panel-icon" />
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    异常交易数量
                  </div>
                  <count-to :start-val="0" :end-val="this.pendingTxSize" :duration="3200" class="card-panel-num" />
                </div>
              </div>
            </el-col>
        </el-row> 
      </el-col>
      <el-col :span="16">
        <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:25px;margin-left:25px;">
          <el-row :gutter="20">
            <el-col :span="6"><div class="grid-content bg-purple">
              关键性指标
            </div></el-col>
            <el-col :span="6" :offset="12"><div class="grid-content bg-purple">
              <el-tag type="success">最近有交易的7天交易量</el-tag>
            </div></el-col>
          </el-row>
          <line-chart :chart-data="BlockNumbeCount" />
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="card-panel-col">
        <el-table
          height="280"
          border
          :data="tableData"
          style="width: 100%;margin-top: -38px">
          <el-table-column
            prop="nodeID"
            label="节点（地址）">
          </el-table-column>
          <el-table-column
            label="区高" width="180">
            {{Count.blockNumber}}
          </el-table-column>
          <el-table-column
            label="状态" width="180">
              <template slot-scope="scope">
                  <el-tag v-if="scope.row.weight===1" type="success">正常</el-tag>
                  <el-tag v-if="scope.row.weight!==1" type="danger">异常</el-tag>
                </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-col :span="11" class="card-panel-col">
        <el-table
          height="270"
          border
          :data="BlockList"
          style="width: 100%">
          <el-table-column
            label="区块">
            <template slot-scope="scope">
              区块
              <el-button
                size="mini"
                type="text"
                @click="BlockHashByNumber(scope.row.groupId,scope.row.blockNumber)"
                >{{scope.row.blockNumber}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="出块者" prop="userName" width="180">
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12" :offset="1" class="card-panel-col">
        <el-table
          height="270"
          border
          :data="BlockList"
          style="width: 100%">
          <el-table-column
            label="交易">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="BlockHashByNumber(scope.row.groupId,scope.row.txHash)"
                >{{scope.row.txHash}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="出块时间" width="200">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.blockTimestamp) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog title="区块信息" :visible.sync="open" width="800px" append-to-body>
      <el-descriptions class="margin-top" :column="1" :size="size" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            区块hash
          </template>
          {{BlockHash.blockHashByNumber}}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { groupList } from "@/api/system/chain";
import { getTotalTransactionCount,getPendingTxSize,getBlockNumbeCount,getGroupInfoList,getBeta,getBlockHashByNumber } from "@/api/system/blocknumbe";
import CountTo from 'vue-count-to';
import { Loading } from 'element-ui';
import LineChart from './dashboard/LineChart'

export default {
    name: "Index",
    components: {
      CountTo,
      LineChart
    },
    data() {
      return {
        open: false,
        // 群组数据
        groupList: [],
        BlockHash: [],
        //节点数据
        nodeList: [],
        BlockList: [],
        //文件列表
        fileList: [],
        tableData:[],
        BlockNumbeCount:[],
        //节点
        nodes: {
          node: undefined
        },
        // 弹出层标题
        title: "",
        pendingTxSize: undefined,
        // 菜单列表
        group: [],
        formlist: {},
        // 查询参数
        TotalTransaction:{
          groupId: undefined,
          node: undefined
        },
        options: {
          lock: true,
          text: '查询中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        },
        // 表单参数
        form: {},
        defaultProps: {
          children: 'children',
          label: 'deptName'
        },
        selectNode: [], // 选中的节点
        //统计信息
        Count:[],
      };
    },
    created() {
      this.getGroup();
    },
    methods: {
      handleSetLineChartData(type) {
        this.$emit('handleSetLineChartData', type)
      },
      /** 查询群组列表 */
      getGroup() {
        let loadingInstance = Loading.service(this.options);
        this.loading = true;
        this.$nextTick(() =>{
          groupList().then(response => {
              this.group = response;
              this.TotalTransaction.groupId =  this.group[0].groupId
              this.TotalTransactionCount(this.TotalTransaction)
              getBlockNumbeCount(this.TotalTransaction.groupId).then(rps =>{
                this.BlockNumbeCount = rps.data
              })
              getGroupInfoList(this.TotalTransaction.groupId).then(rps =>{
                this.tableData = rps.data
              })
          })
          loadingInstance.close();  
        })
      },
      //统计数据查询
      TotalTransactionCount(value){
        this.Count = [];
        this.BlockNumbeCount =[];
        this.tableData = [];
        this.BlockList = [];
         let loadingInstance = Loading.service(this.options);
         this.$nextTick(() =>{
          getTotalTransactionCount(this.TotalTransaction).then(response =>{
            this.Count = response.data.totalTransactionCount
            this.Count.blockNumber  = Number(this.Count.blockNumber)
            this.Count.failedTransactionCount  = Number(this.Count.failedTransactionCount)
            this.Count.transactionCount  = Number(this.Count.transactionCount)
          });
          getPendingTxSize(this.TotalTransaction).then(response =>{
            // console.log(response)
            this.pendingTxSize = Number (response.data.pendingTxSize)
          })
          getBlockNumbeCount(this.TotalTransaction.groupId).then(rps =>{
            this.BlockNumbeCount = rps.data
          })
          getGroupInfoList(this.TotalTransaction.groupId).then(rps =>{
            this.tableData = rps.data
            getBeta().then(rps =>{
              this.BlockList = rps.data
            })
          })
          loadingInstance.close();
         })
      },
      //根据区块高度获取区块哈希
      BlockHashByNumber(groupId,blockNumber){
        let data = {
          groupId:groupId,
          blockNumber:blockNumber,
          node: undefined
        }
        getBlockHashByNumber(data).then(rps => {
          this.BlockHash = rps.data
          this.open = true
          console.log(rps)
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
.panel-group {
  margin-top: 0px;

  .card-panel-col {
    margin-bottom: 60px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .08);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>