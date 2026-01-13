<script setup lang="ts">
import { ref, watch } from 'vue'
import { DollarSign, X } from 'lucide-vue-next'
import type { Booking } from '@/types/booking'
import api from '@/utils/api'
import { useToast } from 'vue-toastification'

const props = defineProps<{
    booking: Booking | null
    isOpen: boolean
    isSubmitting?: boolean
}>()

const emit = defineEmits<{
    close: []
    refunded: [booking: Booking]
}>()

const toast = useToast()

const localSubmitting = ref(props.isSubmitting ?? false)

const reason = ref('')

watch(
    () => props.isOpen,
    (newVal) => {
        if (newVal) {
            reason.value = ''
            localSubmitting.value = props.isSubmitting ?? false
        }
    }
)

const handleClose = () => {
    if (!localSubmitting.value) emit('close')
}

const handleConfirm = async () => {
    if (!props.booking || localSubmitting.value) return

    localSubmitting.value = true
    try {
        // Capture the API response
        const { data } = await api.post(`/api/bookings/${props.booking.id}/refund/request`, {
            reason: reason.value.trim() || null,
        })

        // Extract the updated booking (assuming Laravel resource returns it in data.data)
        const updatedBooking: Booking = data.data

        toast.success('Refund requested successfully.')
        emit('refunded', updatedBooking) // emit updated booking
        handleClose()
    } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } }
        toast.error(error.response?.data?.message ?? 'Failed to request refund')
    } finally {
        localSubmitting.value = false
    }
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
                    class="relative w-full max-w-md rounded-2xl bg-white shadow-2xl transform transition-all">

                    <!-- Header -->
                    <div class="flex flex-col items-center pt-8 pb-4 px-6">
                        <div
                            class="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 ring-8 ring-indigo-50">
                            <DollarSign class="h-8 w-8 text-indigo-600" />
                        </div>
                        <button @click="handleClose" :disabled="localSubmitting"
                            class="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                            <X class="h-5 w-5" />
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="px-6 pb-8 text-center flex flex-col gap-6">
                        <div>
                            <h2 class="text-xl font-bold text-gray-900 mb-3">Request Refund?</h2>
                            <p class="text-sm leading-relaxed text-gray-500">
                                This action will request a refund for this booking. Optionally, provide a reason.
                            </p>
                        </div>

                        <!-- Booking Info -->
                        <div class="rounded-xl border border-gray-200 bg-gray-50/50 p-5 text-left flex flex-col gap-4">
                            <div>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                                    Service
                                </p>
                                <p class="text-sm font-semibold text-gray-900">
                                    {{ props.booking.service?.name ?? 'N/A' }}
                                </p>
                            </div>

                            <div class="flex gap-6 border-t border-gray-100 pt-4">
                                <div class="flex-1">
                                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                                        Date
                                    </p>
                                    <p class="text-sm font-medium text-gray-700">{{ props.booking.booking_date }}</p>
                                </div>
                                <div class="flex-1 border-l border-gray-100 pl-6">
                                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                                        Time
                                    </p>
                                    <p class="text-sm font-medium text-gray-700">
                                        {{ props.booking.start_time }} - {{ props.booking.end_time }}
                                    </p>
                                </div>
                            </div>

                            <div v-if="props.booking.notes" class="mt-4">
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                                    Notes
                                </p>
                                <p class="text-sm text-gray-700">{{ props.booking.notes }}</p>
                            </div>

                            <div class="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                                <p class="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1">
                                    Reference Number
                                </p>
                                <p class="text-sm font-mono font-bold text-blue-900">{{ props.booking.reference_number
                                    }}</p>
                            </div>

                            <!-- Reason Input -->
                            <div class="mt-4 flex flex-col">
                                <label class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                                    Refund Reason (optional)
                                </label>
                                <textarea v-model="reason"
                                    class="resize-none rounded-lg border border-gray-300 p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                                    rows="3" placeholder="Enter reason (optional)"></textarea>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-col sm:flex-row gap-3 pt-2">
                            <button @click="handleClose" :disabled="localSubmitting"
                                class="flex-1 order-2 sm:order-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50">
                                Keep Booking
                            </button>
                            <button @click="handleConfirm" :disabled="localSubmitting"
                                class="flex-1 order-1 sm:order-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                <span v-if="!localSubmitting">Request Refund</span>
                                <span v-else class="flex items-center gap-2">
                                    <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            stroke-width="4" fill="none"></circle>
                                        <path class="opacity-75" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                        </path>
                                    </svg>
                                    Requesting...
                                </span>
                            </button>
                        </div>
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
