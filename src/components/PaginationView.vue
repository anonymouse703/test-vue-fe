<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

// Props
const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

// Emits
const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

// Generate page numbers dynamically
const pages = computed<(number | '...')[]>(() => {
  const { currentPage, totalPages } = props

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
})

// Helpers
const goToPage = (page: number) => {
  if (page < 1 || page > props.totalPages) return
  emit('page-change', page)
}
</script>

<template>
  <nav class="flex items-center justify-center gap-1">
    <!-- Previous Page -->
    <button @click="goToPage(props.currentPage - 1)" :disabled="props.currentPage === 1"
      class="h-9 w-9 flex items-center justify-center rounded border border-gray-200 bg-white disabled:opacity-50 hover:bg-gray-100">
      <ChevronLeft class="h-4 w-4" />
    </button>

    <!-- Page numbers -->
    <span v-for="(page, index) in pages" :key="index">
      <span v-if="page === '...'" class="px-2 text-gray-400">...</span>

      <button v-else @click="goToPage(page)" :class="[
        'h-9 w-9 flex items-center justify-center rounded border',
        props.currentPage === page
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
      ]">
        {{ page }}
      </button>
    </span>

    <!-- Next Page -->
    <button @click="goToPage(props.currentPage + 1)" :disabled="props.currentPage === props.totalPages"
      class="h-9 w-9 flex items-center justify-center rounded border border-gray-200 bg-white disabled:opacity-50 hover:bg-gray-100">
      <ChevronRight class="h-4 w-4" />
    </button>
  </nav>
</template>
