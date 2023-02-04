/** 当路由表太长时，可以将其拆分为小模块 **/

import Layout from '@/layout'

const laboratoryRouter = {
  path: '/laboratory',
  component: Layout,
  redirect: '/laboratory/menu1',
  name: 'Laboratory',
  meta: { title: 'Laboratory', icon: 'laboratory', roles: ['admin', 'editor'] },
  children: [
    {
      path: 'menu1',
      component: () => import('@/views/laboratory/menu1/index'), // Parent router-view
      name: 'Menu1',
      meta: { title: 'Menu1' },
      children: [
        {
          path: 'menu1-1',
          component: () => import('@/views/laboratory/menu1/menu1-1'),
          name: 'Menu1-1',
          meta: { title: 'menu1-1', roles: ['admin', 'editor'] }
        },
        {
          path: 'menu1-2',
          component: () => import('@/views/laboratory/menu1/menu1-2'),
          name: 'Menu1-2',
          meta: { title: 'menu1-2', roles: ['admin', 'editor'] },
          children: [
            {
              path: 'menu1-2-1',
              component: () => import('@/views/laboratory/menu1/menu1-2/menu1-2-1'),
              name: 'Menu1-2-1',
              meta: { title: 'menu1-2-1' }
            },
            {
              path: 'menu1-2-2',
              component: () => import('@/views/laboratory/menu1/menu1-2/menu1-2-2'),
              name: 'Menu1-2-2',
              meta: { title: 'menu1-2-2' }
            }
          ]
        },
        {
          path: 'menu1-3',
          component: () => import('@/views/laboratory/menu1/menu1-3'),
          name: 'Menu1-3',
          meta: { title: 'menu1-3', roles: ['admin', 'editor'] }
        }
      ]
    },
    {
      path: 'webSocket',
      name: 'WebSocket',
      component: () => import('@/views/laboratory/webSocket/index'),
      meta: { title: 'WebSocket', roles: ['admin', 'editor'] }
    },
    {
      path: 'form',
      name: 'Form',
      component: () => import('@/views/laboratory/form/index'),
      meta: { title: 'Form', noCache: false, roles: ['admin', 'editor'] }
    },
    {
      path: 'temp',
      name: 'Template',
      component: () => import('@/views/laboratory/temp/index'),
      meta: { title: 'Template', roles: ['admin', 'editor'] }
    }
  ]
}
export default laboratoryRouter
