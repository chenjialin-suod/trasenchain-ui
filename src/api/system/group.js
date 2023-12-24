import request from '@/utils/request'

// 获取群组列表
export function listGroup(query) {
  return request({
    url: '/chain/1',
    method: 'get',
    params: query
  })
}

// 查询机构节点
export function listNode(node) {
  return request({
    url: '/chain/getNetworkList',
    method: 'get',
    params: node
  })
}

//查询机构下的部门信息
export function getNetworkDept(networId) {
  return request({
    url: '/chain/getNetworkDept/'+ networId,
    method: 'get'
  })
}

//绑定部门和机构节点
export function addDeptNetwork(webaseDeptNetworkVO) {
  return request({
    url: '/chain/addDeptNetwork',
    method: 'post',
    params: webaseDeptNetworkVO
  })
}

// 增加机构节点信息
export function WebaseNetwork(networkPo) {
  return request({
    url: '/chain/addNetWork',
    method: 'post',
    data: networkPo
  })
}

// 添加群组信息
export function addGrouplist(groupPO) {
  return request({
    url: '/chain/addGroup',
    method: 'post',
    data: groupPO
  })
}

// 增加修改机构信息
export function editNetWork(webaseNetworkVO) {
  return request({
    url: '/chain/editNetWork',
    method: 'put',
    data: webaseNetworkVO
  })
}

//增加群组下的机构信息
export function setGroupNetwork(formlist){
  return request({
    url: '/chain/setGroupNetwork',
    method: 'post',
    data: formlist
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  })
}

// 删除节点和该节点下的配置信息
export function delNetwork(networId) {
  return request({
    url: '/chain/delNetwork/'+networId,
    method: 'delete'
  })
}

// 删除群组和该群组下的配置信息
export function delGroup(groupId) {
  return request({
    url: '/chain/delGroupNetwork/'+groupId,
    method: 'delete'
  })
}