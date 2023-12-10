<template>
    <div class="app-container">
      <el-header>
        <el-row :gutter="50" class="panel-group">

          <el-col :xs="12" :sm="12" :lg="5" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
              <div class="card-panel-icon-wrapper icon-people">
                <svg-icon icon-class="peoples" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  <el-select v-model="TotalTransaction.groupId" :default-first-option="true" filterable @change="TotalTransactionCount" placeholder="请选择群组">
                    <el-option v-for="dept in group" :label="dept.groupId" :value="dept.groupId" :key="dept.id"></el-option>
                  </el-select>
                </div>
                <!-- <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num"/> -->
              </div>
            </div>
          </el-col>

          <el-col :xs="12" :sm="12" :lg="5" class="card-panel-col">
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

          <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
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
          
          <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
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
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="5" :xs="24">
            <el-form :model="nodes" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
              <el-form-item prop="userName">
                <el-input
                  v-model="nodes.node"
                  placeholder="请输入节点ip"
                  clearable
                  style="width: 130px"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-plus" type="primary" size="mini" v-hasPermi="['system:node:add']" @click="addNode">新增节点</el-button>
              </el-form-item>
            </el-form>
            <el-table v-loading="loadingNode" :data="nodeList">
              <el-table-column label="机构节点" prop="node"/>
              <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="networkDelete(scope.row.networId)"
                    v-hasPermi="['system:network:del']"
                    >删除</el-button>
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-edit"
                      @click="handleUpdate(scope.row)"
                      v-hasPermi="['system:node:edit']"
                    >修改</el-button>
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-edit"
                      @click="nodeDef(scope.row)"
                      v-hasPermi="['system:node:def']"
                    >部门绑定</el-button>
                  </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="19" :xs="24">
            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
              <el-form-item label="群组编号" prop="menuName">
                <el-input
                  v-model="queryParams.groupId"
                  placeholder="请输入群组名称"
                  clearable
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="grouphandleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                <el-button type="primary" icon="el-icon-plus" size="mini" v-hasPermi="['system:group:add']" @click="addGroup">新建群组</el-button>
              </el-form-item>
            </el-form>
            <el-table v-loading="loading" :data="groupList" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="群组编号" prop="groupId" width="120" />
              <el-table-column label="是否开启国密" align="center" width="100">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.smCrypto===1" type="success">开启</el-tag>
                  <el-tag v-if="scope.row.smCrypto===2" type="danger">关闭</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="是否开启群组权限管理" align="center" width="150">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.authCheck===1" type="success">开启</el-tag>
                  <el-tag v-if="scope.row.authCheck===0" type="danger">关闭</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="详细信息" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-descriptions class="margin-top" :column="3" size="mini" border>
                    <el-descriptions-item v-if="scope.row.sysDept.length!==0" v-for="dept in scope.row.sysDept">
                        <template slot="label">
                          <i class="el-icon-user"></i>
                          部门
                        </template>
                        {{dept.deptName}}
                    </el-descriptions-item>
                    <el-descriptions-item v-if="scope.row.webaseNetworkVO.length!==0" v-for="webase in scope.row.webaseNetworkVO">
                        <template slot="label">
                          <i class="el-icon-user"></i>
                          节点
                        </template>
                        {{webase.node + ':' + webase.port}}
                    </el-descriptions-item>
                  </el-descriptions>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="220">
                <template slot-scope="scope" v-if="scope.row.roleId !== 1">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-plus"
                    @click="GroupNetwork(scope.row.id)"
                    v-hasPermi="['system:network:groupId']"
                    >节点绑定
                  </el-button>
                  <!-- <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-search"
                    @click="GetBeta(scope.row.groupId)"
                    v-hasPermi="['system:data:list']"
                    >区高查询
                  </el-button> -->
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="groupDelete(scope.row)"
                    v-hasPermi="['system:group:del']"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getGroup"
            />
          </el-col>
        </el-row>
      </el-main>
      <!-- 添加或修改节点配置对话框 -->
      <el-dialog :title="title" :visible.sync="nodeopen" width="600px" append-to-body>
        <el-form ref="form" :model="formlist" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="节点ip" prop="node" >
                <el-input v-model="formlist.node" placeholder="请输入节点ip" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="npc端口" prop="port">
                <el-input v-model="formlist.port" placeholder="请输入节点端口号" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="5个证书文件" >
                <fileUpload v-model="formlist.file"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 节点绑定对话框 -->
      <el-dialog :title="title" :visible.sync="groupNodepen" width="600px" append-to-body>
        <el-form ref="form" :model="formlist" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-select v-model="formlist.networId" placeholder="请选择节点">
                <el-option v-for="node in nodeList" :label="node.node" :value="node.networId" :key="node.networId"></el-option>
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" @click="groupsubmitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
      <!-- 节点部门绑定对话框 -->
      <el-dialog :title="title" :visible.sync="NodeDefpen" width="1000px" append-to-body>
        <el-form ref="form" :model="formlist" :rules="rules" label-width="150px">
          <el-row>
            <el-col :span="24" v-if="this.deptOptions.length!==0">
              <el-form-item label="以绑定的部门">
                <el-descriptions class="margin-top" :column="3" size="100px" border>
                  <el-descriptions-item v-for="dept in deptOptions">
                    <template slot="label">
                      <i class="el-icon-user"></i>
                      部门
                    </template>
                    {{dept.deptName}}
                  </el-descriptions-item>
                </el-descriptions>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="请选择部门" prop="deptId">
                <el-select v-model="formlist.deptId" placeholder="请选择部门">
                  <el-option v-for="dept in Deptlist" :label="dept.deptName" :value="dept.deptId" :key="dept.deptId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="操作">
                <el-button type="primary" @click="deptsubmitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
      <!-- 群组增加或修改对话框 -->
      <el-dialog :title="title" :visible.sync="grouppen" width="600px" append-to-body>
        <el-form ref="form" :model="formlist" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="群组编号" prop="groupId" >
                <el-input v-model="formlist.groupId" placeholder="请输入群组编号" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="是否开启国密" prop="smCrypto">
                <el-radio-group v-model="formlist.smCrypto">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="2">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="是否开启群组权限管理" prop="authCheck">
                <el-radio-group v-model="formlist.authCheck">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-button type="primary" @click="addGroupForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { listGroup,delNetwork,delGroup,listNode,WebaseNetwork,setGroupNetwork,editNetWork,addGrouplist,getNetworkDept,addDeptNetwork} from "@/api/system/group";
  import { groupList } from "@/api/system/chain";
  import { getTotalTransactionCount,getPendingTxSize } from "@/api/system/blocknumbe";
  import { listDept } from "@/api/system/dept";
  import { Loading } from 'element-ui';
  import CountTo from 'vue-count-to';
  
  export default {
    name: "Group",
    dicts: ['sys_normal_disable'],
    components: {
      CountTo
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        loadingdata: true,
        loadingNode: true,
        open:false,
        // 重新渲染表格状态
        refreshTable: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        pendingTxSize: undefined,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 群组数据
        groupList: [],
        //节点数据
        nodeList: [],
        //文件列表
        fileList: [],
        //节点
        nodes: {
          node: undefined
        },
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        nodeopen: false,
        groupNodepen: false,
        grouppen: false,
        NodeDefpen: false,
        dataopen: false,
        // 是否显示弹出层（数据权限）
        openDataScope: false,
        menuExpand: false,
        menuNodeAll: false,
        deptExpand: true,
        deptNodeAll: false,
        // 日期范围
        dateRange: [],
        //部门
        Deptlist: [],
        // 菜单列表
        menuOptions: [],
        // 部门列表
        deptOptions: [],
        dateParams: [],
        datechain: [],
        group: [],
        formlist: {},
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          groupId: undefined
        },
        // 表单参数
        form: {},
        defaultProps: {
          children: 'children',
          label: 'deptName'
        },
        selectNode: [], // 选中的节点
        // 查询参数
        queryDeptParams: {
          deptName: undefined,
          status: undefined
        },
        TotalTransaction:{
          groupId: undefined,
          node: undefined
        },
        //统计信息
        Count:[],
        // 表单校验
        rules: {
          node: [
            { required: true, message: "节点不能为空", trigger: "blur" }
          ],
          port: [
            { required: true, message: "端口不能为空", trigger: "blur" }
          ],
          node: [
            { required: true, message: "节点不能为空", trigger: "blur" }
          ],
          groupId: [
            { required: true, message: "群组编号不能为空", trigger: "blur" }
          ],
          authCheck: [
            { required: true, message: "是否开启群组权限管理", trigger: "blur" }
          ],
          smCrypto: [
            { required: true, message: "是否开启国密", trigger: "blur" }
          ],
          deptId: [
            { required: true, message: "请选择部门", trigger: "blur" }
          ],
          minrow:[
          { required: true, message: "请输入最小值", trigger: "blur" }
          ],
          maxrow:[
          { required: true, message: "请输入最大值", trigger: "blur" }
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
      this.getGroup();
      this.getNode();
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
          listGroup(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
              this.groupList = response.rows;
              this.total = response.rows.length;
              this.loading = false;
            }
          );
          groupList().then(response => {
              this.group = response;
              this.TotalTransaction.groupId =  this.group[0].groupId
              this.TotalTransactionCount(this.TotalTransaction)
          })
          loadingInstance.close();  
        })
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.queryParams = {
          pageNum: 1,
          pageSize: 10,
          groupId: undefined
        }
        this.getGroup();
      },
      resetdataQuery(groupId){
        this.dataParams = {
          groupId: groupId,
          minrow: 0,
          maxbox: 10
        };
      },
      // 查询节点
      getNode(){
        listNode(this.nodes).then(response =>{
          this.nodeList = response.data;
          this.loadingNode = false;
        })
      },
      //新增群组
      addGroup(){
        this.reset();
        this.grouppen = true;
        this.formlist = {
          groupId: undefined,
          smCrypto: undefined,
          authCheck: undefined
        }
      },
      //新增节点
      addNode(){
        this.reset();
        this.nodeopen = true;
        this.title = "添加节点";
      },
      //修改节点
      handleUpdate(row){
        this.reset();
        this.formlist = {
          node: row.node,
          networId: row.networId,
          port: row.port,
          file: row.file
        };
        this.nodeopen = true;
        this.title = "修改节点";
      },
      //绑定节点
      GroupNetwork(Id){
        this.reset();
        this.selectNode = {};
        this.formlist={
          networId: undefined,
          groupId: Id
        }
        this.groupNodepen = true;
        this.title = "绑定节点";
      },
      /** 节点搜索按钮操作 */
      handleQuery() {
        this.getNode();
      },
      // 树
      handleNodeClick(data, checked,indeterminate) {
        if (checked) {
          this.$refs.tree.setCheckedNodes([data]);
          this.formlist.deptId = data.deptId
        }
      },
      cancel() {
        this.groupNodepen = false;
        this.nodeopen = false;
        this.grouppen = false;
        this.NodeDefpen = false
        this.reset();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.roleId)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      //群组查询
      grouphandleQuery(){
        this.getGroup()
      },
      //统计数据查询
      TotalTransactionCount(value){
        this.Count = [];
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
          loadingInstance.close();
         })
      },
      //部门绑定
      nodeDef(row){
        this.options.text = "部门绑定";
        let loadingInstance = Loading.service(this.options);
        this.$nextTick(() =>{
               //获取部门
                listDept(this.queryDeptParams).then(response => {
                  this.Deptlist = response.data;
                });
                getNetworkDept(row.networId).then(response =>{
                  this.deptOptions = response.data;
                })
                this.formlist = {
                  networkId: row.networId,
                  deptId: undefined
                }
                this.NodeDefpen = true;
            })
        loadingInstance.close();  
      },
      /** 提交按钮 */
      deptsubmitForm: function(){
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.options.text = "添加节点中";
            let loadingInstance = Loading.service(this.options);
            this.$nextTick(() =>{
              addDeptNetwork(this.formlist).then(response=>{
                this.NodeDefpen = false;
                this.deptOptions = [];
                this.Deptlist = [];
                this.$modal.msgSuccess("绑定成功");
              })
              loadingInstance.close();  
            })
          }
        })
      },
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.options.text = "部门绑定中";
            let loadingInstance = Loading.service(this.options);
            if (this.formlist.networId != undefined) {
              editNetWork(this.formlist).then(response => {
                this.$modal.msgSuccess("节点修改成功");
                this.nodeopen = false;
                this.getNode();
              });
            } else {
              WebaseNetwork(this.formlist).then(response => {
                this.$modal.msgSuccess("节点新增成功");
                this.nodeopen = false;
                this.getNode();
              });
            }
            loadingInstance.close();  
          }
        });
      },
      groupsubmitForm: function(){
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.formlist.userId != undefined) {
              updateUser(this.formlist).then(response => {
                this.$modal.msgSuccess("节点修改成功");
                this.open = false;
                this.getGroup();
              });
            } else {
              setGroupNetwork(this.formlist).then(response => {
                this.$modal.msgSuccess("节点绑定成功");
                this.open = false;
                this.getGroup();
              });
            }
          }
        });
      },
      addGroupForm: function(){
        this.$refs["form"].validate(valid => {
          if (this.formlist.userId != undefined) {
              updateUser(this.formlist).then(response => {
                this.$modal.msgSuccess("群组修改成功");
                this.grouppen = false;
                this.getGroup();
              });
            } else {
              addGrouplist(this.formlist).then(response => {
                this.$modal.msgSuccess("群组增加成功");
                this.grouppen = false;
                this.getGroup();
              });
            }
        })
      },
      // 表单重置
      reset() {
        this.formlist = {};
        this.resetForm("form");
      },
      /** 删除节点和该节点下的配置信息 */
      networkDelete(networId) {
        this.$modal.confirm('是否确认删除该节点').then(function() {
          return delNetwork(networId);
        }).then(() => {
          this.getNode();
          this.$modal.msgSuccess("删除成功");
          this.getGroup();
          this.getNode();
        }).catch(() => {});
      },
      /** 删除群组和该群组下的配置信息 */
      groupDelete(row) {
        const groupIds = row.groupId;
        this.$modal.confirm('是否确认删除该群组').then(function() {
          return delGroup(groupIds);
        }).then(() => {
          this.getGroup();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      }
    }
  };
  </script>

<style lang="scss" scoped>
.el-main {
  margin-top: 80px;
}
.panel-group {
  margin-top: 0px;

  .card-panel-col {
    margin-bottom: 32px;
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
  
  