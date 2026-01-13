import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Define routes
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/bookings/create',
    name: 'CreateBooking',
    component: () => import('../views/dashboard/CreateBookingPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/bookings/:id/edit',
    name: 'EditBooking',
    component: () => import('../views/dashboard/CreateBookingPage.vue'),
    meta: { requiresAuth: true }
  }

]

// Create router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Global auth guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // If route requires auth and user is not authenticated → redirect to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'login' })
  }

  // If user is authenticated and trying to access login/register → redirect to dashboard
  if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    return next({ name: 'dashboard' })
  }

  // Otherwise, proceed normally
  next()
})

export default router
