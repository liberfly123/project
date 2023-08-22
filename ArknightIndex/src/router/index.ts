import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes = <readonly RouteRecordRaw[]>[
  {
    path: '/',
    name: 'animation',
    component: () => import('../views/animationPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
