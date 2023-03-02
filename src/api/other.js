import request from '@/utils/request'

export function getFtpItems(data) {
  return request({
    url: '/Admin/Ftp/GetFtpItems',
    method: 'post',
    data
  })
}
export function upLoadFile(data) {
  return request({
    timeout: 15000,
    url: '/Admin/Ftp/UpLoadFile',
    method: 'post',
    data
  })
}

