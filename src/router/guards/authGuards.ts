import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function authGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    const authStore = useAuthStore()

    console.log('Auth check, token:', authStore.token)

    if (!authStore.isAuthenticated) {
        return next({ name: 'Login' })
    }

    next()
}
