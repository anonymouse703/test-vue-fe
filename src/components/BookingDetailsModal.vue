<script setup lang="ts">
import { computed } from 'vue'
import { X, Calendar, Clock, FileText, Info } from 'lucide-vue-next'
import type { Booking } from '@/types/booking'
import type { BookingStatus } from '@/composables/useBooking'
import { useBookingStatus } from '@/composables/useBooking'

const props = defineProps<{
    booking: Booking | null
    isOpen: boolean
}>()

const emit = defineEmits<{
    close: []
    edit: [booking: Booking]
}>()

function isBookingStatus(value: string): value is BookingStatus {
    return ['confirmed', 'pending', 'cancelled', 'no-show', 'refunded', 'rescheduled'].includes(value)
}

const statusLabel = computed(() => {
    if (!props.booking || !isBookingStatus(props.booking.status)) return ''
    return useBookingStatus(props.booking.status).label.value
})

const statusClass = computed(() => {
    if (!props.booking || !isBookingStatus(props.booking.status)) return ''
    return useBookingStatus(props.booking.status).className.value
})

const handleClose = () => emit('close')

const handleEdit = () => {
    if (props.booking) emit('edit', props.booking)
}

const handleBackdropClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) handleClose()
}
</script>


<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="isOpen && props.booking" @click="handleBackdropClick"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div @click.stop
                    class="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl transform transition-all">
                    <!-- Header -->
                    <div class="flex items-start justify-between border-b border-gray-200 p-6">
                        <div class="flex-1">
                            <h2 class="text-2xl font-bold text-gray-900">Booking Details</h2>
                            <p class="mt-1 text-sm text-gray-500">View your booking information</p>
                        </div>
                        <button @click="handleClose"
                            class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                            <X class="h-5 w-5" />
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="p-6 flex flex-col gap-8">
                        <!-- Service & Status -->
                        <div class="space-y-3">
                            <label class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Service</label>
                            <div class="flex items-center justify-between">
                                <h3 class="text-xl font-bold text-gray-900">{{ props.booking?.service?.name || 'N/A' }}
                                </h3>
                                <span class="px-3 py-1 rounded-full text-xs font-medium border" :class="statusClass">
                                    {{ statusLabel }}
                                </span>
                            </div>
                        </div>

                        <!-- Date & Time -->
                        <div class="grid grid-cols-2 gap-4">
                            <div class="rounded-xl border border-gray-200 p-4 bg-gray-50/50">
                                <div class="flex items-center gap-2 text-gray-500 mb-3">
                                    <Calendar class="h-4 w-4" />
                                    <span class="text-[10px] font-bold uppercase tracking-wider">Date</span>
                                </div>
                                <p class="text-sm font-semibold text-gray-900">{{ props.booking?.booking_date || '-' }}
                                </p>
                            </div>

                            <div class="rounded-xl border border-gray-200 p-4 bg-gray-50/50">
                                <div class="flex items-center gap-2 text-gray-500 mb-3">
                                    <Clock class="h-4 w-4" />
                                    <span class="text-[10px] font-bold uppercase tracking-wider">Time</span>
                                </div>
                                <p class="text-sm font-semibold text-gray-900">
                                    {{ props.booking?.start_time || '-' }} - {{ props.booking?.end_time || '-' }}
                                </p>
                            </div>
                        </div>

                        <!-- Notes -->
                        <div v-if="props.booking?.notes" class="space-y-3">
                            <div class="flex items-center gap-2 text-gray-500">
                                <FileText class="h-4 w-4" />
                                <label class="text-xs font-semibold uppercase tracking-widest">Notes</label>
                            </div>
                            <div class="rounded-xl border border-gray-200 p-5 bg-gray-50/50">
                                <p class="text-sm leading-relaxed text-gray-700">{{ props.booking.notes }}</p>
                            </div>
                        </div>

                        <!-- Reference Number -->
                        <div class="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
                            <div class="flex items-center gap-2 text-blue-600 mb-2">
                                <Info class="h-4 w-4" />
                                <span class="text-[10px] font-bold uppercase tracking-widest">Reference Number</span>
                            </div>
                            <p class="text-sm font-mono font-bold text-blue-900">{{ props.booking?.reference_number ||
                                '-' }}</p>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="flex gap-3 border-t border-gray-200 p-6">
                        <button @click="handleClose"
                            class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                            Close
                        </button>
                        <button @click="handleEdit"
                            class="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Edit Booking
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-active .rounded-2xl,
.modal-leave-active .rounded-2xl {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .rounded-2xl,
.modal-leave-to .rounded-2xl {
    transform: scale(0.95);
    opacity: 0;
}
</style>
