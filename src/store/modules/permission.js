import { asyncRoutes, constantRoutes } from '@/router'
import { getAsyncRoutes } from '@/api/menu'
// 组件对象与 后端返回component字段进行的关系映射
const componentMap = { // 异步的方式
  Layout: () => import('@/layout'),
  User: () => import('@/views/permission/user'),
  Menu: () => import('@/views/permission/menu'),
  Config: () => import('@/views/permission/config'),
  Ftp: () => import('@/views/files/ftpdisk'),
  WhiteList: () => import('@/views/whiteList/index'),
  Three: () => import('@/views/three/index'),
  WebSocket: () => import('@/views/laboratory/webSocket/index'),
  Form: () => import('@/views/laboratory/form/index'),
  Template: () => import('@/views/laboratory/temp/index'),
  'Menu1-1': () => import('@/views/laboratory/menu1/menu1-1'),
  'Menu1-2': () => import('@/views/laboratory/menu1/menu1-2'),
  'Menu1-3': () => import('@/views/laboratory/menu1/menu1-3'),
  Icons: () => import('@/views/icons/index'),
  UploadFile: () => import('@/views/files/uploadFile')
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
      const treeList = resMenu.data
      try {
        // 将后端返回的数据格式处理成 合适的数据格式
        for (let i = 0; i < treeList.length; i++) {
          delete treeList[i].id
          delete treeList[i].metaId
          delete treeList[i].parentId
          // treeList[i].meta.breadcrumb = false
          if (treeList[i].component && typeof (treeList[i].component === 'string')) {
            treeList[i].component = componentMap[treeList[i].component]
          }
          if (treeList[i].children) {
            for (let k = 0; k < treeList[i].children.length; k++) {
              delete treeList[i].children[k].id
              delete treeList[i].metaId
              delete treeList[i].children[k].parentId
              if (
                treeList[i].children[k].component && typeof (treeList[i].children[k].component === 'string')
              ) {
                treeList[i].children[k].component = componentMap[treeList[i].children[k].component]
              }
            }
          }
        }
      } catch (error) {
        console.log('parse menu erro')
      }

      // 前端模拟的数据
      // eslint-disable-next-line no-unused-vars
      const menusTest = [
        {
          id: 1,
          path: '/permission',
          component: componentMap['Layout'],
          redirect: '/permission/user',
          name: 'Permission',
          hidden: false,
          alwaysShow: true,
          meta: {
            id: 1,
            rolesString: 'admin,editor',
            title: 'permission',
            icon: 'tree',
            noCache: true,
            breadcrumb: false,
            affix: true,
            activeMenu: '1',
            roles: [
              'admin',
              'editor'
            ]
          },
          children: [
            {
              id: 6,
              path: 'user',
              component: componentMap['User'],
              redirect: '',
              name: 'User',
              hidden: false,
              alwaysShow: false,
              meta: {
                id: 2,
                rolesString: 'admin,editor',
                title: 'user',
                icon: 'user',
                noCache: true,
                breadcrumb: true,
                affix: true,
                activeMenu: '1',
                roles: [
                  'admin',
                  'editor'
                ]
              },
              children: [],
              metaId: 2,
              parentId: 1
            },
            {
              id: 7,
              path: 'menu',
              component: componentMap['Menu'],
              redirect: '',
              name: 'Menu',
              hidden: false,
              alwaysShow: false,
              meta: {
                id: 3,
                rolesString: 'admin,editor',
                title: 'menu',
                icon: 'nested',
                noCache: true,
                breadcrumb: false,
                affix: true,
                activeMenu: '1',
                roles: ['admin', 'editor']
              },
              children: [],
              metaId: 3,
              parentId: 1
            }
          ],
          metaId: 1,
          parentId: 0
        },
        { path: '*', redirect: '/404', hidden: true }
      ]

      let accessedRoutes
      if (roles.includes('developer')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(treeList, roles)
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
