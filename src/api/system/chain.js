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
    params: contractCompileDto
  })
}
