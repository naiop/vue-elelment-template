import request from '@/utils/request'
import axios from 'axios'
// ------------------------------------------ ftp
// 目录  -- ftp
export function getFtpItems(data) {
  return request({
    url: '/Admin/Ftp/GetFtpItems',
    method: 'post',
    data
  })
}
// 上传文件  -- ftp
export function upLoadFile(data) {
  return request({
    timeout: 60000,
    url: '/Admin/Ftp/UpLoadFile',
    method: 'post',
    data
  })
}
// ------------------------------------------ 数据库
// 上传文件  -- 数据库
export function upLoadFileToDB(data, query) {
  return new Promise((resolve, reject) => {
    axios({
      baseURL: process.env.VUE_APP_BASE_API,
      method: 'Post',
      headers: {
      },
      url: '/Admin/UploadFile/UpLoadFile',
      params: query,
      data
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
// 文件列表 -- 数据库
export function getUploadFileList(data) {
  return request({
    url: '/Admin/UploadFile/GetUploadFileList',
    method: 'post',
    data,
    params: data
  })
}

// 下载文件 -- 数据库
export function downloadFile(data) {
  return request({
    timeout: 60000,
    url: '/Admin/UploadFile/DownloadFile',
    method: 'post',
    data
  })
}
// 下载文件 -- 数据库
export function downloadFileCustom(data) {
  return new Promise((resolve, reject) => {
    axios({
      baseURL: process.env.VUE_APP_BASE_API,
      method: 'Post',
      headers: {
      },
      url: '/Admin/UploadFile/DownloadFile',
      params: {
      },
      data,
      responseType: 'blob'
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// 删除文件 -- 数据库
export function deleteFile(data) {
  return request({
    url: '/Admin/UploadFile/DeleteFile',
    method: 'delete',
    data
  })
}
