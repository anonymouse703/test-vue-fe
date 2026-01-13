<script setup lang="ts">
const props = defineProps<{ count?: number }>()

const skeletonCount = props.count ?? 3
</script>

<template>
    <div class="space-y-4">
        <div v-for="i in skeletonCount" :key="i" class="animate-pulse rounded-xl border border-gray-200 bg-white p-5">
            <div class="flex items-start justify-between">
                <div class="flex-1 space-y-3">
                    <div class="flex items-center gap-3">
                        <div class="h-6 w-48 rounded bg-gray-300" />
                        <div class="h-5 w-20 rounded-full bg-gray-300" />
                    </div>
                    <div class="h-4 w-3/4 rounded bg-gray-300" />
                    <div class="flex gap-4">
                        <div class="h-4 w-24 rounded bg-gray-300" />
                        <div class="h-4 w-20 rounded bg-gray-300" />
                        <div class="h-4 w-28 rounded bg-gray-300" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
