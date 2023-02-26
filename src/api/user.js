import request from '@/utils/request'

// 初始化数据库
export function initTable(data) {
  return request({
    url: '/Admin/User/InitTable',
    method: 'post',
    data
  })
}
// 登录
export function login(data) {
  return request({
    url: '/Admin/User/Login',
    method: 'post',
    data
  })
}
// token Get user
export function getInfo(token) {
  return request({
    url: '/Admin/User/Info',
    method: 'get',
    params: { token }
  })
}
// 登出
export function logout() {
  return request({
    url: '/Admin/User/Logout',
    method: 'post'
  })
}
// .............................................................
// 所有用户列表
export function getUser(query) {
  return request({
    url: '/Admin/User/GetUser',
    method: 'get',
    headers: { Authorization: 'Basic ZXhwcmVzc19hcGk6MTIzNDU2' },
    params: query
  })
}
// 删除用户
export function deleteUser(data) {
  return request({
    url: '/Admin/User/DeleteUser',
    method: 'delete',
    data
  })
}
// 更新用户
export function updateUser(data) {
  return request({
    url: '/Admin/User/UpdateUser',
    method: 'put',
    data
  })
}
// 添加用户
export function addUser(data) {
  return request({
    url: '/Admin/User/AddUser',
    method: 'post',
    data
  })
}
