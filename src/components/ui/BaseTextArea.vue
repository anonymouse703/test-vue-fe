<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    modelValue?: string
    label?: string
    placeholder?: string
    rows?: number
    disabled?: boolean
    error?: string
}

const props = withDefaults(defineProps<Props>(), {
    rows: 4,
    disabled: false,
    modelValue: '',
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const value = computed({
    get: () => props.modelValue ?? '',
    set: (val: string) => emit('update:modelValue', val ?? '')
})
</script>

<template>
    <div>
        <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
        <textarea v-model="value" :rows="props.rows" :placeholder="props.placeholder" :disabled="props.disabled"
            class="w-full px-4 py-3 text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            :class="error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'"></textarea>
        <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    </div>
</template>
