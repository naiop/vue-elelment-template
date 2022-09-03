import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

// 用户注册
export function register(data) {
  return request({
    url: '/vue-admin-template/user/register',
    method: 'post',
    params: data
  })
}

// 所有用户列表
export function GetUser(query) {
  return request({
    url: '/vue-admin-template/user/GetUser',
    method: 'get',
    headers: { Authorization: 'Basic ZXhwcmVzc19hcGk6MTIzNDU2' },
    params: query
  })
}
