import request from '@/utils/request'

// 获取配置
export function getConfig(data) {
  return request({
    url: '/Admin/Config/GetConfig',
    method: 'post',
    data,
    params: data
  })
}
