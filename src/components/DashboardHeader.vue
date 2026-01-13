<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { LogOut, Calendar, User } from 'lucide-vue-next'

defineProps<{
    userName?: string
    userEmail?: string
    userAvatar?: string
}>()

const emit = defineEmits<{
    (e: 'logout'): void
}>()

const show = ref(false)

onMounted(() => {
    setTimeout(() => {
        show.value = true
    }, 0)
})
</script>

<template>
    <transition enter-active-class="transition-transform transition-opacity duration-300 ease-out"
        enter-from-class="-translate-y-5 opacity-0" enter-to-class="translate-y-0 opacity-100">
        <header v-if="show" class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div class="flex h-16 items-center justify-between px-4 md:px-6">
                <!-- Left -->
                <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                        <Calendar class="h-5 w-5 text-white" />
                    </div>
                    <span class="text-xl font-semibold text-gray-900">Bookings</span>
                </div>

                <!-- Right -->
                <div class="flex items-center gap-4">
                    <div class="hidden items-center gap-3 md:flex">
                        <div class="relative h-9 w-9 rounded-full border-2 border-gray-300 overflow-hidden">
                            <img v-if="userAvatar" :src="userAvatar" :alt="userName"
                                class="h-full w-full object-cover" />
                            <div v-else
                                class="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                                <User class="h-4 w-4" />
                            </div>
                        </div>

                        <div class="flex flex-col">
                            <span class="text-sm font-medium text-gray-900">{{ userName }}</span>
                            <span class="text-xs text-gray-500">{{ userEmail }}</span>
                        </div>
                    </div>

                    <!-- Logout -->
                    <button @click="emit('logout')"
                        class="flex items-center gap-2 text-gray-500 hover:text-red-500 text-sm sm:text-base">
                        <LogOut class="h-4 w-4" />
                        <span class="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    </transition>
</template>
