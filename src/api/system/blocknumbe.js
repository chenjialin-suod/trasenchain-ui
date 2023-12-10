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