import request from '@/utils/request'

// 查询公私钥列表
export function getUserPoList(query) {
    return request({
      url: '/chain/getUserPoList',
      method: 'get',
      params: query
    })
  }