import request from '@/utils/request'

// 查询公私钥列表
export function getUserPoList(query) {
    return request({
      url: '/chain/getUserPoList',
      method: 'get',
      params: query
    })
  }

// 将指定用户更改为治理委员
export function getupdateGovernor(data) {
  return request({
    url: '/chain/updateGovernor',
    method: 'post',
    params: data
  })
}