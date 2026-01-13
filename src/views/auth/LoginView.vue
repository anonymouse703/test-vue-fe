<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Logo from '@/assets/images/logo.png'
import api from '@/utils/api'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { AxiosError } from 'axios'
import { useFormValidation } from '@/composables/useFormValidation'
import { useAuthStore } from '@/stores/auth'


interface LoginForm {
    email: string
    password: string
}

const router = useRouter()
const form = reactive<LoginForm>({
    email: '',
    password: '',
})

const error = ref('')
const loading = ref(false)
const authStore = useAuthStore()

const { validateForm } = useFormValidation()

const handleLogin = async () => {
    error.value = ''
    loading.value = true

    const { isValid, errorMessage } = validateForm(form)
    if (!isValid) {
        error.value = errorMessage
        loading.value = false
        return
    }


    try {
        const response = await api.post('api/login', {
            email: form.email,
            password: form.password,
        })

        const data = response.data
        console.log('Login response:', data)

        authStore.setToken(data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        localStorage.setItem('isAuthenticated', 'true')

        router.push({ name: 'dashboard' })
    } catch (err: unknown) {
        const axiosErr = err as AxiosError<{ message: string }>
        error.value = axiosErr?.response?.data?.message ?? (err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div
        class="fixed inset-0 flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-purple-700 p-4 sm:p-6 md:p-8">
        <div class="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 sm:p-8 md:p-10">
            <div class="flex justify-center mb-4 sm:mb-6">
                <img alt="Vue logo" :src="Logo" class="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 animate-pulse" />
            </div>

            <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-2">
                Welcome Back
            </h1>
            <p class="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8">
                Please sign in to continue
            </p>

            <form @submit.prevent="handleLogin" class="space-y-6">
                <BaseInput v-model="form.email" label="Email" type="email" placeholder="john@example.com"
                    :disabled="loading" />

                <BaseInput v-model="form.password" label="Password" type="password" placeholder="Password"
                    :disabled="loading" />

                <div v-if="error"
                    class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 pt-2 rounded-lg text-sm text-center">
                    {{ error }}
                </div>

                <div class="pt-6">
                    <BaseButton type="submit" :loading="loading">
                        Sign In
                    </BaseButton>
                </div>
            </form>

            <div class="mt-6 text-center text-sm text-gray-600">
                <RouterLink to="/register" class="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                    Don't have an account? Register
                </RouterLink>
            </div>
        </div>
    </div>
</template>
