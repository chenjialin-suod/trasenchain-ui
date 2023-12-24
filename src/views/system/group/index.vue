<template>
    <div class="app-container">
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
              <el-table-column type="selection" width="55" align="center"/>
              <el-table-column label="群组编号" prop="groupId" width="120">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="Network(scope.row.groupId)"
                    v-hasPermi="['system:network:groupId']"
                    >{{scope.row.groupId}}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="初始治理账号地址" align="center" prop="address" width="170"/>
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
                  <el-table v-loading="loadingNode" :data="scope.row.webaseNetworkVO">
                    <el-table-column label="节点" align="center" prop="node" />
                    <el-table-column label="端口" align="center" prop="port" width="150"/>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="250">
                <template slot-scope="scope" v-if="scope.row.roleId !== 1">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-plus"
                    @click="GroupNetwork(scope.row.id)"
                    v-hasPermi="['system:network:groupId']"
                    >节点绑定
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-search"
                    @click="addCreate(scope.row.groupId)"
                    v-hasPermi="['system:add:create']"
                    >初始治理账号
                  </el-button>
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
      <!-- 增加初始治理账号 -->
      <el-dialog :title="title" :visible.sync="createpen" width="600px" append-to-body>
        <el-form ref="form" :model="Create" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="账号地址" prop="address" >
                <el-input v-model="Create.address" placeholder="请输入账号地址" maxlength="50" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="证书文件" prop="publicKey">
                <fileUpload v-model="Create.publicKey"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addCreateList">确 定</el-button>
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

      <el-dialog title="节点信息" :visible.sync="Peeropen" width="600px" append-to-body>
            <el-table
            v-if="refreshTable"
            v-loading="loading"
            :data="PeerList"
            >
                <el-table-column prop="endPoint" label="节点端口" align="center"></el-table-column>
                <el-table-column prop="p2pNodeID" label="节点地址"></el-table-column>
            </el-table>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { listGroup,delNetwork,delGroup,listNode,WebaseNetwork,setGroupNetwork,editNetWork,addGrouplist,getNetworkDept,addDeptNetwork} from "@/api/system/group";
  import { groupList,setCreate } from "@/api/system/chain";
  import { getNetwork } from "@/api/system/blocknumbe";
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
        Peeropen: false,
        createpen:false,
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
        PeerList: [],
        formlist: {},
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          groupId: undefined
        },
        // 查询参数
        Create: {
          groupId:undefined,
          publicKey:undefined,
          address:undefined
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
          ],
          address:[
            { required: true, message: "请输入账号地址", trigger: "blur" }
          ],
          publicKey:[
            {required: true, message: "请上传账号文件", trigger: "blur"}
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
      //查询群组下的节点信息
      Network(groupId){
        this.options.text = "查询中";
        let loadingInstance = Loading.service(this.options);
        this.$nextTick(() =>{
          getNetwork(groupId).then(rps =>{
            this.PeerList = rps.data.result.peers;
            this.Peeropen = true;
            loadingInstance.close();  
          })
        })
      },
      //上传初始治理账号
      addCreate(groupId){
        this.Create.groupId = groupId
        this.createpen = true
      },
      addCreateList: function(){
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.options.text = "上传初始治理账号";
            let loadingInstance = Loading.service(this.options);
            this.$nextTick(() =>{
              setCreate(this.Create).then(response=>{
                this.createpen = false;
                this.Create = {
                  groupId:undefined,
                  publicKey:undefined,
                  address:undefined
                };
                this.getGroup();
              this.getNode();
              })
              loadingInstance.close();  
            })
          }
        })
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
                this.formlist = {};
              });
            } else {
              WebaseNetwork(this.formlist).then(response => {
                this.$modal.msgSuccess("节点新增成功");
                this.nodeopen = false;
                this.getNode();
                this.formlist = {};
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
  
  