import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/index.vue')
    },
    {
      path: '/edit_note',
      name: 'edit_note',
      component: () => import('@/views/EditNote/index.vue')
    },
    {
      path: '/view_note',
      name: 'view_note',
      component: () => import('@/views/ViewNote/index.vue')
    },
    {
      path: '/:all(.*)*',
      name: 'not_found',
      component: () => import('@/views/NotFound.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login.vue')
    },
  ]
})

export default router
