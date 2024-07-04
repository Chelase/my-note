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
    }
  ]
})

export default router
