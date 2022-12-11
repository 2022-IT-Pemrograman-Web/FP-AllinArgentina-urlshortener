import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'Register',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RegisterForm.vue')
    },
    {
      path: '/',
      name: 'Login',
      component: () => import('../views/LoginForm.vue')
    },
    {
      path: '/user/:uid',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue')
    },
    {
      path: '/:shortUrl',
      redirect: {name: 'Redirecting', params: {}}
    }
  ]
})

export default router
