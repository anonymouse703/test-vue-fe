<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'

// Props
defineProps<{
    onClick: () => void
}>()

const show = ref(false)

onMounted(() => {
    // Trigger animation after mount (like initial delay)
    setTimeout(() => {
        show.value = true
    }, 300)
})
</script>

<template>
    <transition enter-active-class="transition-transform transition-opacity duration-500 ease-out"
        enter-from-class="scale-0 opacity-0" enter-to-class="scale-100 opacity-100">
        <div v-if="show" class="fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8">
            <button @click="onClick"
                class="h-14 gap-2 rounded-full px-6 shadow-elevated transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center justify-center bg-blue-600 text-white font-semibold">
                <Plus class="h-5 w-5" />
                <span>Create Booking</span>
            </button>
        </div>
    </transition>
</template>
