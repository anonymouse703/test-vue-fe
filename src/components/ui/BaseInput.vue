<script setup lang="ts">
import { computed, useAttrs } from 'vue'

interface Props {
    modelValue?: string
    label?: string
    type?: string
    placeholder?: string
    disabled?: boolean
    error?: string
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    placeholder: '',
    disabled: false,
    modelValue: '',
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const attrs = useAttrs()

const value = computed({
    get: () => props.modelValue ?? '',
    set: (val: string) => emit('update:modelValue', val ?? '')
})
</script>

<template>
    <div>
        <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
            {{ label }}
        </label>

        <input v-model="value" :type="type" :placeholder="placeholder" :disabled="disabled" v-bind="attrs"
            class="w-full px-4 py-3 border text-gray-500 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
            :class="error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'" />

        <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    </div>
</template>
