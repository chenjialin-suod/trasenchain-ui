<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :offset="20" :span="3"><div class="grid-content bg-purple">
                <el-select v-model="TotalTransaction.groupId" :default-first-option="true" filterable @change="TotalTransactionCount" placeholder="群组">
                    <el-option v-for="dept in group" :label="dept.groupId" :value="dept.groupId" :key="dept.id"></el-option>
                </el-select>
            </div></el-col>
        </el-row>
        <el-table
          v-if="refreshTable"
          :data="tableData"
          v-loading="loading"
          >
          <el-table-column
            prop="nodeID"
            label="节点（地址）">
          </el-table-column>
          <el-table-column
            label="区高" width="180">
            {{Count.result}}
          </el-table-column>
          <el-table-column
            label="权重" prop="weight" width="180">
          </el-table-column>
          <el-table-column
            label="操作" align="center" width="180" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="AddObserver(scope.row.nodeID)"
                    v-hasPermi="['system:node:add']"
                >修改</el-button>
                </template>
          </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { groupList } from "@/api/system/chain";
import { getConsensusStatus,getBeta,getBlockHeight,addObserver} from "@/api/system/blocknumbe";
import { Loading } from 'element-ui';
export default {
    name: "node",
    data() {
      return {
        open: false,
        loading: true,
        // 重新渲染表格状态
        refreshTable: true,
        // 群组数据
        groupList: [],
        //节点数据
        BlockList: [],
        tableData:[],
        //节点
        nodes: {
          node: undefined
        },
        // 弹出层标题
        title: "",
        group: [],
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
        //统计信息
        Count:{
            result: undefined
        }
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
              getConsensusStatus(this.TotalTransaction.groupId).then(rps =>{
                this.tableData = rps.data.sealerList
              })
          })
          loadingInstance.close();  
        })
      },
      //统计数据查询
      TotalTransactionCount(value){
        this.Count = [];
        this.tableData = [];
        this.BlockList = [];
         let loadingInstance = Loading.service(this.options);
         this.$nextTick(() =>{
            getBlockHeight(this.TotalTransaction.groupId).then(rps =>{
                this.Count.result = rps.data.result
            })
            getConsensusStatus(this.TotalTransaction.groupId).then(rps =>{
                this.tableData = rps.data.sealerList
                getBeta().then(rps =>{
                this.BlockList = rps.data
                })
                loadingInstance.close();
            })
            this.loading = false;
         })
      },
      //修改节点状态
      AddObserver(nodeId){
        let data = {
          nodeId:nodeId,
          groupId:this.TotalTransaction.groupId
        }
        addObserver(data).then(rps =>{
          console.log(rps)
        })
      }
    }
  };
</script>

<style>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #c4c3c3;
  }
  .bg-purple {
    background: rgb(248, 247, 247);
  }
  .bg-purple-light {
    background: #eceff4;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>