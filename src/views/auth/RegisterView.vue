<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Logo from '@/assets/images/logo.png'
import api from '@/utils/api'
import { useFormValidation } from '@/composables/useFormValidation'
import type { AxiosError } from 'axios'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

interface RegisterForm {
    name: string
    email: string
    password: string
    confirmPassword: string
}

const router = useRouter()
const { validateForm } = useFormValidation()

const form = reactive<RegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
})

const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
    error.value = ''
    loading.value = true

    const { isValid, errorMessage } = validateForm(form, {
        minPasswordLength: 8,
        confirmPasswordField: 'confirmPassword',
    })

    if (!isValid) {
        error.value = errorMessage
        loading.value = false
        return
    }

    try {
        const response = await api.post('api/register', {
            name: form.name,
            email: form.email,
            password: form.password,
            password_confirmation: form.confirmPassword,
        })

        console.log('Registered:', response.data)

        router.push('/')
    } catch (err: unknown) {
        if (err instanceof Error) {
            error.value = err.message
        }

        if ((err as AxiosError)?.response?.data) {
            error.value =
                (err as AxiosError<{ message: string }>).response?.data?.message ??
                'Registration failed. Please try again.'
        }
    } finally {
        loading.value = false
    }
}

const goToLogin = () => {
    router.push('/login')
}
</script>

<template>
    <div
        class="fixed inset-0 flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-purple-700 p-4 sm:p-6 md:p-8">
        <div class="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 sm:p-8 md:p-10">

            <div class="flex justify-center mb-4 sm:mb-6"> <img :src="Logo" alt="Vue logo"
                    class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 animate-pulse" />
            </div>

            <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-2">Create Account</h1>

            <p class="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8">Reserve Your Spot Now!</p>

            <form @submit.prevent="handleRegister" class="space-y-6">
                <BaseInput v-model="form.name" label="Name" placeholder="John Doe" :disabled="loading" />

                <BaseInput v-model="form.email" label="Email" type="email" placeholder="john@example.com"
                    :disabled="loading" />

                <BaseInput v-model="form.password" label="Password" type="password" placeholder="At least 8 characters"
                    :disabled="loading" />

                <BaseInput v-model="form.confirmPassword" label="Confirm Password" type="password"
                    placeholder="Confirm your password" :disabled="loading" />

                <div v-if="error"
                    class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center pt-2">
                    {{ error }}
                </div>

                <div class="pt-10">
                    <BaseButton type="submit" :loading="loading">
                        Create Account
                    </BaseButton>
                </div>
            </form>

            <div class="mt-6 text-center text-sm text-gray-600">
                Already have an account?
                <button @click="goToLogin"
                    class="text-indigo-600 hover:text-indigo-700 font-medium hover:underline ml-1 focus:outline-none">Sign
                    In
                </button>
            </div>

            <p class="text-center text-xs text-gray-500 mt-4">
                By registering, you agree to our
                <a href="#" class="text-indigo-600 hover:text-indigo-700 hover:underline">
                    Terms of Service
                </a>
                and
                <a href="#" class="text-indigo-600 hover:text-indigo-700 hover:underline">
                    Privacy Policy
                </a>
            </p>

        </div>
    </div>
</template>

<style scoped>
.input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
}
</style>
