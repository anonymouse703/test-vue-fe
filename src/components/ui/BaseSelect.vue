<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Option {
    label: string
    value: string
}

interface Props {
    modelValue?: string
    options: Option[]
    label?: string
    placeholder?: string
    disabled?: boolean
    error?: string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: 'Select an option',
    disabled: false,
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

// Initialize with the actual modelValue from props
const internalValue = ref(props.modelValue || '')

// Computed to sync v-model
const value = computed({
    get: () => internalValue.value,
    set: (val: string) => {
        // Ensure we emit a proper string value, not undefined
        const emitValue = val || ''
        internalValue.value = emitValue
        emit('update:modelValue', emitValue)
    }
})

// Sync if parent changes modelValue
watch(() => props.modelValue, (val) => {
    // Handle undefined, null, or empty values consistently
    internalValue.value = val || ''
}, { immediate: true })
</script>

<template>
    <div>
        <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
            {{ label }}
        </label>

        <select v-model="value" :disabled="disabled"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
            :class="[
                error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
                value === '' ? 'text-gray-500' : 'text-gray-900'
            ]">
            <option value="" disabled>{{ placeholder }}</option>
            <option v-for="option in options" :key="option.value" :value="option.value" class="text-gray-900">
                {{ option.label }}
            </option>
        </select>

        <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    </div>
</template>