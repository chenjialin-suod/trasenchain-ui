import request from '@/utils/request'

// 根据交易哈希获取交易信息
export function getBetailInfo(data) {
    return request({
      url: '/chain/getBetailInfo',
      method: 'get',
      params: data
    })
}

// 区块查询
export function getTransactionInformation(data) {
    return request({
      url: '/chain/getTransactionInformation',
      method: 'post',
      params: data
    })
}

// 根据区块哈希获取区块信息
export function getBlockByHash(data) {
  return request({
    url: '/chain/getBlockByHash',
    method: 'post',
    params: data
  })
}

//交易统计数据查询
export function getTotalTransactionCount(TotalTransaction){
  return request({
    url: '/chain/getTotalTransactionCount',
    method: 'post',
    params: TotalTransaction
  })
}

//获取交易池内未处理的交易数目
export function getPendingTxSize(TotalTransaction){
  return request({
    url: '/chain/getPendingTxSize',
    method: 'post',
    params: TotalTransaction
  })
}

//查询链上数据列表
export function getWebaseTableTemp(query){
  return request({
    url: '/chain/getWebaseTableTemp',
    method: 'get',
    params: query
  })
}

//查询链上数据列表
export function setData(data){
  return request({
    url: '/chain/setData',
    method: 'post',
    params: data
  })
}

//查询链上数据
export function getData(data){
  return request({
    url: '/chain/getData',
    method: 'post',
    params: data
  })
}

//查询一个群组的网络连接信息（该节点的群组和链接信息）
export function getNetwork(groupId){
  return request({
    url: '/chain/getNetwork/'+groupId,
    method: 'get'
  })
}

//查询最近7天的区块数据
export function getBlockNumbeCount(groupId){
  return request({
    url: '/chain/getBlockNumbeCount/'+groupId,
    method: 'get'
  })
}

// //获取当前群组的节点信息列表。
// export function getGroupInfoList(groupId){
//   return request({
//     url: '/chain/getGroupInfoList/'+groupId,
//     method: 'get'
//   })
// }

//获取当前群组的节点信息列表--共识
export function getConsensusStatus(groupId){
  return request({
    url: '/chain/getConsensusStatus/'+groupId,
    method: 'get'
  })
}

//将指定节点添加为观察节点
export function addObserver(data){
  return request({
    url: '/chain/addObserver',
    method: 'post',
    params: data
  })
}

//将指定节点添加为共识节点
export function addSealer(data){
  return request({
    url: '/chain/addSealer',
    method: 'post',
    params: data
  })
}

//获取当前群组的节点信息列表--观察
export function getObserverList(groupId){
  return request({
    url: '/chain/getObserverList/'+groupId,
    method: 'get'
  })
}

//查询一个群组节点连接列表
export function getGroupNodeInfo(groupId){
  return request({
    url: '/chain/getGroupNodeInfo/'+groupId,
    method: 'get'
  })
}

//查询区高数据
export function getBeta(){
  return request({
    url: '/chain/getBeta',
    method: 'get'
  })
}

//查询区高数据
export function getBlockHashByNumber(data){
  return request({
    url: '/chain/getBlockHashByNumber',
    method: 'post',
    params: data
  })
}

//根据交易哈希获取交易回执信息信息
export function getTransactionReceipt(data){
  return request({
    url: '/chain/getTransactionReceipt',
    method: 'post',
    params: data
  })
}

//获取最新块高
export function getBlockHeight(groupId){
  return request({
    url: '/chain/getBlockHeight/'+groupId,
    method: 'get'
  })
}
