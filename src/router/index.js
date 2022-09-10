import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import laboratoryRouter from './modules/laboratory'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
// path http://localhost:9528/#/path path就是地址栏路径
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect', // 重定向路由
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/', // 首页
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
    }]
  },
  {
    path: '/register', // 注册页面
    component: () => import('@/views/whiteList/register/index'),
    hidden: true
  },
  {
    path: '/desktop', //
    component: () => import('@/views/whiteList/griddesktop/index'),
    hidden: true
  },
  {
    path: '/three', //
    component: () => import('@/views/whiteList/threejs/full_screen_threejs'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/userpage',
    name: 'permission',
    meta: { title: 'Permission', icon: 'tree', roles: ['admin'] },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/permission/userpage'),
        meta: { title: 'User', icon: 'tree' }
      },
      {
        path: 'route',
        name: 'route',
        component: () => import('@/views/permission/route'),
        meta: { title: 'Route', icon: 'tree' }
      }
    ]
  },
  laboratoryRouter, // modules routes

  {
    path: '/example',
    component: Layout,
    redirect: '/example/three',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'three',
        name: 'three',
        component: () => import('@/views/three/index'),
        meta: { title: 'Three', icon: 'tree', roles: ['admin', 'editor'] }
      },
      {
        path: 'whiteList',
        name: 'whiteList',
        component: () => import('@/views/whiteList/index'),
        meta: { title: 'WhiteListRoute', icon: 'tree', roles: ['admin', 'editor'] }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/',
        meta: { title: 'External Link', icon: 'link', roles: ['admin'] }
      }
    ]
  },
  // 404页必须放在最后
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
