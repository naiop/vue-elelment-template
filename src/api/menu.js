import axios from 'axios'
import request from '@/utils/request'

// exportFileBlob
export function exportFileBlob(data, query) {
  return new Promise((resolve, reject) => {
    axios({
      baseURL: process.env.VUE_APP_BASE_API,
      method: 'Post',
      headers: {
      },
      url: '/Admin/Menu/ExportFileBlob',
      params: {
      },
      responseType: 'blob' // 更改responseType类型为 blob
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// ExportExcel  ToBase64String
export function exportExcel(data, query) {
  return request({
    url: '/Admin/Menu/ExportExcelToBase64',
    method: 'post',
    data,
    params: query
  })
}

// 后端获取菜单
export function getAsyncRoutes(data, query) {
  return request({
    url: '/Admin/Menu/GetAsyncRoutes',
    method: 'post',
    data,
    params: query
  })
}
// menu
export function addMenu(data) {
  return request({
    url: '/Admin/Menu/AddMenu',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/Admin/Menu/UpdateMenu',
    method: 'put',
    data
  })
}

export function deleteMenu(data) {
  return request({
    url: '/Admin/Menu/DeleteMenu',
    method: 'delete',
    data
  })
}

// meta
export function addMeta(data) {
  return request({
    url: '/Admin/Menu/AddMeta',
    method: 'post',
    data
  })
}

export function updateMeta(data) {
  return request({
    url: '/Admin/Menu/UpdateMeta',
    method: 'put',
    data
  })
}

export function deleteMeta(data) {
  return request({
    url: '/Admin/Menu/DeleteMeta',
    method: 'delete',
    data
  })
}
