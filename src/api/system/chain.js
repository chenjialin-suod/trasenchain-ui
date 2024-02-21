import request from '@/utils/request'

// 获取合约例表
export function listChain(query) {
  return request({
    url: '/chain/getBeployedAccountInfo',
    method: 'get',
    params: query
  })
}

//查询合约-查看详情
export function getChain(Id) {
  return request({
    url: '/chain/getChain/'+ Id,
    method: 'get'
  })
}

//查询合约-查看详情
export function updateGovernor(data) {
  return request({
    url: '/chain/updateGovernor',
    method: 'post',
    params: data
  })
}

//为群组增加初始治理账号
export function setCreate(data) {
  return request({
    url: '/chain/setCreate',
    method: 'post',
    params: data
  })
}

//获取群组列表
export function groupList() {
  return request({
    url: '/chain/groupListChain',
    method: 'get'
  })
}

//部署合约
export function setDynam(contractCompileDto) {
  return request({
    url: '/chain/setDynamicDeployContract',
    method: 'post',
    data: contractCompileDto
  })
}

// 获取群组列表
export function multiPathList(req) {
  return request({
    url: '/contract/multiPath',
    method: 'post',
    data: req
  })
}

//新增文件夹
export function setContractPath(req) {
  return request({
    url: '/contract/addContractPath',
    method: 'post',
    data: req
  })
}
//新增文件
export function saveContract(req) {
  return request({
    url: '/contract/save',
    method: 'post',
    data: req
  })
}

//编译合约
export function contractCompile(req) {
  return request({
    url: '/contract/contractCompile',
    method: 'post',
    data: req
  })
}
