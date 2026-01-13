<script setup lang="ts">
interface Props {
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    disabled?: boolean
}

withDefaults(defineProps<Props>(), {
    type: 'button',
    loading: false,
    disabled: false,
})
</script>

<template>
    <button :type="type" :disabled="disabled || loading" class="w-full bg-linear-to-r from-indigo-500 to-purple-600
           text-white font-semibold py-4 rounded-lg
           hover:from-indigo-600 hover:to-purple-700
           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
           transform hover:-translate-y-0.5 transition-all duration-200
           disabled:opacity-60 disabled:cursor-not-allowed
           disabled:hover:transform-none shadow-lg hover:shadow-xl">
        <span v-if="loading">
            Loading...
        </span>

        <span v-else>
            <slot />
        </span>
    </button>
</template>
