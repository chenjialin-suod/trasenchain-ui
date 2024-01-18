<template>
    <div class="app-container">
        <el-row>
            <el-col :span="6">
                <el-row>
                    <el-container>
                        <el-aside width="95%">
                            <el-row>
                                <el-col :span="3">
                                    <el-tooltip class="item" effect="dark" content="新建文件" placement="top-start">
                                        <i class="el-icon-document-add"></i>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="3">
                                    <el-tooltip class="item" effect="dark" content="新建文件夹" placement="top-start">
                                        <i class="el-icon-folder-add" @click = "addContractPath"></i>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="9">
                                    <el-select v-model="req.groupId" :default-first-option="true" filterable @change="getmultiPathList" placeholder="版本">
                                        <el-option v-for="dept in group" :label="dept.groupId" :value="dept.groupId" :key="dept.id"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="9">
                                    <el-select v-model="req.groupId" :default-first-option="true" filterable @change="getmultiPathList" placeholder="群组">
                                        <el-option v-for="dept in group" :label="dept.groupId" :value="dept.groupId" :key="dept.id"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                        </el-aside>
                    </el-container>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-tree :data="treeList" :props="defaultProps" @node-click="getContract">
                            <span slot-scope="{ node, data }">
                                <template>
                                    <i
                                        :class="{
                                            'el-icon-folder': !node.expanded,       // 节点收缩时的图标
                                            'el-icon-folder-opened': node.expanded, // 节点展开时的图标
                                            'el-icon-s-order': data.contractStatus === 1,  // data.type是后端配合提供的识别字段，最后一级
                                        }"
                                    />
                                    <span>{{ node.label }}</span>
                                </template>
                            </span>
                        </el-tree>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="18">
                <el-row>
                    <el-container>
                        <el-aside width="100%">
                            111111111111111111111111111111111111111111111111111111111111111
                        </el-aside>
                    </el-container>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <codemirror
                        ref="newCm"  
                        v-model="java" 
                        :options="cmOptions"
                        @ready="onCmReady">
                        </codemirror>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        111
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

        <!-- 新增文件夹或文件 -->
        <el-dialog :title="title" :visible.sync="ContractPathpen" width="600px" append-to-body>
            <el-form ref="form" :model="reqContractPath" :rules="rules" label-width="100px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="群组编号" prop="groupId" >
                        <!-- <el-input v-model="ReqContractPath.groupId" placeholder="请输入群组编号" maxlength="50" /> -->
                        <el-select v-model="reqContractPath.groupId" :default-first-option="true" filterable placeholder="请选择群组编号">
                            <el-option v-for="dept in group" :label="dept.groupId" :value="dept.groupId" :key="dept.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="所属目录" prop="contractPath" >
                        <!-- <el-input v-model="ReqContractPath.groupId" placeholder="请输入群组编号" maxlength="50" /> -->
                        <el-select v-model="reqContractPath.contractPath" :default-first-option="true" filterable placeholder="请选择目录，根目录为/">
                            <el-option v-for="dept in fileList" :label="dept.contractName" :value="dept.parentId" :key="dept.parentId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文件名称" prop="contractName" >
                        <el-input v-model="reqContractPath.contractName" placeholder="请输入目录或文件名称" maxlength="20" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-button type="primary" @click="handleNodeClick">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </el-col>
            </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import 'codemirror/mode/sql/sql.js'
// 主题css
import 'codemirror/theme/solarized.css'
// require active-line.js
import 'codemirror/addon/selection/active-line.js'
// closebrackets
import 'codemirror/addon/edit/closebrackets.js'
import { groupList,multiPathList,setContractPath } from "@/api/system/chain";
   export default {
    name: "ide",
    data() {
        return {
        java: "",
        menuList: [],
        treeList: [],
        fileList: [],
        title: undefined,
        group: [],
        defaultProps: {
          children: 'children',
          label: 'contractName'
        },
        req: {
            groupId: undefined
        },
        ContractPathpen: false,
        reqContractPath:{
            groupId:undefined,
            contractPath:undefined,
            contractName:undefined,
            contractStatus:undefined
        },
         // 表单校验
         rules: {
            groupId: [
                {required: true, message: "群组不能为空", trigger: "blur"}
            ],
            contractPath: [
                {required: true, message: "上级目录不能为空，如果为根目录，则选择‘/’ ", trigger: "blur"}
            ],
            contractName: [
                {required: true, message: "文件名称不能为空", trigger: "blur"}
            ]
         },
        cmOptions: {
            tabSize: 4, // tabsize默认为4
            styleActiveLine: true,
            lineNumbers: true, // 代码行数字
            line: true,
            mode: 'text/x-java', // 选择代码语言，我这里选的sql
            extraKeys: {"Ctrl": "autocomplete"},   //自动提示配置 
            lineWrapping: true,    // 自动换行
            theme: 'duotone-light' // 主题根据需要自行配置
        }
        }
    },
    created() {
      this.getgroupList();
    },
    methods: {
        onCmReady(cm) {
            // 设置代码编辑框宽和高
            this.$refs.newCm.codemirror.setSize("-webkit-fill-available", "500")
        },
        getgroupList(){
            groupList().then(response => {
                this.group = response;
                this.req.groupId = this.group[0].groupId
                this.getmultiPathList()
            })
        },
        getmultiPathList(){
            multiPathList(this.req.groupId).then(response => {
                this.menuList = response.data
                this.treeList = this.handleTree(response.data, "id")
                console.log(this.menuList)
            })
        },
        addContractPath(){
            this.title = "新增文件夹"
            this.ContractPathpen = true;
            this.reqContractPath = {
                groupId:undefined,
                contractPath:undefined,
                contractName:undefined,
                contractStatus:2
            }
            this.fileList.push({contractName: '/',parentId:0})
            this.menuList.forEach(element => {
                this.fileList.push({contractName:element.contractName,parentId:element.id})
            });
        },
        handleNodeClick: function() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    console.log(this.reqContractPath)
                    setContractPath(this.reqContractPath).then(response =>{
                        this.getgroupList();
                        this.ContractPathpen = false;
                    })
                }
            })
        },
        //查询文件内容
        getContract(data){
            console.log(data)
        },
        //取消
        cancel(){
            this.reqContractPath = {
                groupId:undefined,
                contractPath:undefined,
                contractName:undefined,
                contractStatus:undefined
            }
            this.ContractPathpen = false; 
        },
    }
}
</script>

