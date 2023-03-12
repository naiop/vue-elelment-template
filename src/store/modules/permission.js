import { asyncRoutes, constantRoutes } from '@/router'
import { getAsyncRoutes } from '@/api/menu'

// 组件对象与 后端返回component字段进行的关系映射
const componentMap = {
  Layout: () => import('@/layout'),
  '@/views/icons/index.vue': () => import('@/views/icons/index.vue'),
  '@/views/permission/user.vue': () => import('@/views/permission/user.vue'),
  '@/views/permission/menu.vue': () => import('@/views/permission/menu.vue'),
  '@/views/permission/config.vue': () => import('@/views/permission/config.vue'),
  '@/views/files/ftpdisk.vue': () => import('@/views/files/ftpdisk.vue'),
  '@/views/files/uploadFile.vue': () => import('@/views/files/uploadFile.vue'),
  '@/views/three/index.vue': () => import('@/views/three/index.vue'),
  '@/views/whiteList/index.vue': () => import('@/views/whiteList/index.vue'),
  '@/views/laboratory/menu1/index.vue': () => import('@/views/laboratory/menu1/index.vue'),
  '@/views/laboratory/menu1/menu1-1/index.vue': () => import('@/views/laboratory/menu1/menu1-1/index.vue'),
  '@/views/laboratory/menu1/menu1-2/index.vue': () => import('@/views/laboratory/menu1/menu1-2/index.vue'),
  '@/views/laboratory/menu1/menu1-2/menu1-2-1/index.vue': () => import('@/views/laboratory/menu1/menu1-2/menu1-2-1/index.vue'),
  '@/views/laboratory/menu1/menu1-2/menu1-2-2/index.vue': () => import('@/views/laboratory/menu1/menu1-2/menu1-2-2/index.vue'),
  '@/views/laboratory/menu1/menu1-3/index.vue': () => import('@/views/laboratory/menu1/menu1-3/index.vue'),
  '@/views/laboratory/webSocket/index.vue': () => import('@/views/laboratory/webSocket/index.vue'),
  '@/views/laboratory/form/index.vue': () => import('@/views/laboratory/form/index.vue'),
  '@/views/laboratory/temp/index.vue': () => import('@/views/laboratory/temp/index.vue')
}

/**
 * 使用meta。用于确定当前用户是否具有权限的角色
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
 * 通过componentMap异步路由表
 * @param view
 * @returns
 */
export const loadView = (view) => {
  return componentMap[view]
}

/**
 * 把从后端查询的菜单数据拼装成路由格式的数据
 * @param routes
 * @param data 后端返回的菜单数据
 */
export function generaMenu(routes, data) {
  data.forEach(item => {
    console.log(item)
    var menu
    if (item.children) {
      menu = {
        path: item.path,
        component: loadView(item.component),
        hidden: item.hidden === 0, // 状态为0的隐藏
        redirect: item.redirect,
        children: [],
        name: item.name,
        meta: item.meta
      }
    } else {
      menu = {
        path: item.path,
        component: loadView(item.component),
        hidden: item.hidden === 0, // 状态为0的隐藏
        redirect: item.redirect,
        name: item.name,
        meta: item.meta
      }
    }

    if (item.children) {
      generaMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
  return routes
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      const listQuery = {
        roles: roles,
        key: false
      }
      const resMenu = await getAsyncRoutes(listQuery)
      const MenuTreeList = generaMenu([], resMenu.data)

      let accessedRoutes
      if (roles.includes('developer')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(MenuTreeList, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
