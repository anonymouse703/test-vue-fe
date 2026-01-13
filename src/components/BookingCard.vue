<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Calendar, Clock, MoreVertical } from 'lucide-vue-next'
import type { Booking } from '@/types/booking'
import { formatTimeRange } from '@/utils/date'
import { useBookingStatus } from '@/composables/useBooking'

const props = defineProps<{
    booking: Booking
    index: number
}>()

const emit = defineEmits<{
    (e: 'edit', booking: Booking): void
    (e: 'cancel', booking: Booking): void
    (e: 'view', booking: Booking): void
    (e: 'request-refund', booking: Booking): void
}>()

const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        showDropdown.value = false
    }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))

// Use composable
const { label: statusLabel, className: statusClass, isCancellable, canRequestRefund } =
    useBookingStatus(props.booking.status)

const handleRequestRefund = () => {
    emit('request-refund', props.booking)
    showDropdown.value = false
}

const timeRange = computed(() =>
    formatTimeRange(props.booking.start_time, props.booking.end_time)
)

const handleView = () => {
    emit('view', props.booking)
    showDropdown.value = false
}

const handleEdit = () => {
    emit('edit', props.booking)
    showDropdown.value = false
}

const handleCancel = () => {
    emit('cancel', props.booking)
    showDropdown.value = false
}

const toggleDropdown = (event: Event) => {
    event.stopPropagation()
    showDropdown.value = !showDropdown.value
}
</script>

<template>
    <div class="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-lg"
        :class="[showDropdown ? 'z-30 overflow-visible' : 'z-10 overflow-hidden']">
        <div class="flex items-start justify-between gap-4">
            <!-- Booking info -->
            <div class="flex-1 space-y-3">
                <div class="flex items-center gap-3">
                    <h3 class="text-lg font-semibold text-gray-900">
                        {{ props.booking.service?.name }}
                    </h3>
                    <span class="px-2 py-0.5 rounded text-xs font-medium border" :class="statusClass">
                        {{ statusLabel }}
                    </span>
                </div>

                <p v-if="props.booking.notes" class="text-sm text-gray-500 line-clamp-2">
                    {{ props.booking.notes }}
                </p>

                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div class="flex items-center gap-1.5">
                        <Calendar class="h-4 w-4" />
                        <span>{{ props.booking.booking_date }}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <Clock class="h-4 w-4" />
                        <span>{{ timeRange }}</span>
                    </div>
                </div>
            </div>

            <!-- Dropdown -->
            <div ref="dropdownRef" class="relative">
                <button @click="toggleDropdown"
                    class="h-10 w-10 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'opacity-100 bg-gray-100 text-gray-900': showDropdown }">
                    <MoreVertical class="h-5 w-5" />
                </button>

                <transition enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                    <div v-if="showDropdown"
                        class="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-xl z-50 py-1">
                        <button @click="handleView"
                            class="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                            View Details
                        </button>
                        <button @click="handleEdit"
                            class="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                            Edit Booking
                        </button>
                        <div class="border-t border-gray-100 my-1"></div>
                        <button v-if="isCancellable" @click="handleCancel"
                            class="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150">
                            Cancel Booking
                        </button>
                        <button v-if="canRequestRefund" @click="handleRequestRefund"
                            class="block w-full text-left px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 transition-colors duration-150">
                            Request Refund
                        </button>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>


<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
