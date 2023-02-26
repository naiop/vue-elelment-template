import request from '@/utils/request'

// 后端获取菜单
export function getAsyncRoutes(data) {
  return request({
    url: '/Admin/Menu/GetAsyncRoutes',
    method: 'post',
    data
  })
}
