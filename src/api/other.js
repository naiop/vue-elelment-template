import request from '@/utils/request'

export function sport(params) {
  return request({
    url: '/vue-admin-template/api/stepscript',
    method: 'get',
    params
  })
}
