import request from '@/utils/request'

export function getFtpItems(data) {
  return request({
    url: '/Admin/Ftp/GetFtpItems',
    method: 'post',
    data
  })
}
