import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  routes: (_routes) => [
    {
      name: 'index',
      path: '/',
      component: () => import('~/pages/index.vue')
    },
    {
      name: 'dashboard',
      path: '/dashboard',
      component: () => import('~/pages/dashboard.vue')
    },
    {
      name: 'analyses',
      path: '/analyses',
      component: () => import('~/pages/analyses/index.vue')
    },
    {
      name: 'analyses-new',
      path: '/analyses/new',
      component: () => import('~/pages/analyses/new.vue')
    },
    {
      name: 'analyses-id',
      path: '/analyses/:id',
      component: () => import('~/pages/analyses/[id]/index.vue')
    },
    {
      name: 'materials',
      path: '/materials',
      component: () => import('~/pages/materials/index.vue')
    },
    {
      name: 'materials-new',
      path: '/materials/new',
      component: () => import('~/pages/materials/new.vue')
    },
    {
      name: 'materials-id',
      path: '/materials/:id',
      component: () => import('~/pages/materials/[id]/index.vue')
    }
  ]
} 