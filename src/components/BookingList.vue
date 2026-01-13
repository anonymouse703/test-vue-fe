<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CalendarX } from 'lucide-vue-next'

import BookingCard from './BookingCard.vue'
import Pagination from './PaginationView.vue'
import BookingListLoader from './loaders/BookingLoader.vue'
import BookingDetailsModal from './BookingDetailsModal.vue'
import BookingCancelModal from './BookingCancelModal.vue'
import BookingRefundModal from './BookingRefundModal.vue'

import type { Booking } from '@/types/booking'

const props = defineProps<{
    bookings: Booking[]
    isLoading?: boolean
    currentPage: number
    totalPages: number
}>()

const emit = defineEmits<{
    (e: 'page-change', page: number): void
    (e: 'edit-booking', booking: Booking): void
    (e: 'view-booking', booking: Booking): void
    (e: 'cancel-booking', booking: Booking): void
    (e: 'refunded', booking: Booking): void
}>()

const bookingsList = ref<Booking[]>([...props.bookings])
const selectedBooking = ref<Booking | null>(null)

const showDetailsModal = ref(false)
const showDeleteModal = ref(false)
const showRefundModal = ref(false)


watch(() => props.bookings, (newBookings) => {
    bookingsList.value = [...newBookings]
})

const isEmpty = computed(
    () => !props.isLoading && bookingsList.value.length === 0
)

/* ---------- Helpers ---------- */
const updateBookingInList = (updated: Booking) => {
    const index = bookingsList.value.findIndex(b => b.id === updated.id)
    if (index !== -1) {
        bookingsList.value[index] = updated
    }
}

/* ---------- Actions ---------- */
const handleView = (booking: Booking) => {
    selectedBooking.value = booking
    showDetailsModal.value = true
    emit('view-booking', booking)
}

const handleEdit = (booking: Booking) => {
    emit('edit-booking', booking)
}

const handleCancelClick = (booking: Booking) => {
    selectedBooking.value = booking
    showDeleteModal.value = true
}

const handleCancelConfirm = (updatedBooking: Booking) => {
    updateBookingInList(updatedBooking)
    emit('cancel-booking', updatedBooking)
    showDeleteModal.value = false
    selectedBooking.value = null
}

const handleRequestRefund = (booking: Booking) => {
    selectedBooking.value = booking
    showRefundModal.value = true
}

const handleRefundConfirmed = (updatedBooking: Booking) => {
    updateBookingInList(updatedBooking)
    emit('refunded', updatedBooking)
    showRefundModal.value = false
    selectedBooking.value = null
}

const closeDetailsModal = () => {
    showDetailsModal.value = false
    selectedBooking.value = null
}

const closeDeleteModal = () => {
    showDeleteModal.value = false
    selectedBooking.value = null
}

const closeRefundModal = () => {
    showRefundModal.value = false
    selectedBooking.value = null
}
</script>

<template>
    <div>
        <BookingListLoader v-if="props.isLoading" :count="3" />

        <transition name="fade-scale">
            <div v-if="isEmpty"
                class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 py-16 px-4">
                <CalendarX class="h-8 w-8 text-gray-500 mb-4" />
                <h3 class="text-lg font-semibold text-gray-900">No bookings yet</h3>
                <p class="text-sm text-gray-500">Create your first booking to get started</p>
            </div>
        </transition>

        <div v-if="!isEmpty" class="space-y-4">
            <transition-group name="fade-move" tag="div" class="space-y-4">
                <BookingCard v-for="(booking, index) in bookingsList" :key="booking.id" :booking="booking"
                    :index="index" @edit="handleEdit" @cancel="handleCancelClick" @view="handleView"
                    @request-refund="handleRequestRefund" />
            </transition-group>

            <Pagination v-if="props.totalPages > 1" :currentPage="props.currentPage" :totalPages="props.totalPages"
                @page-change="page => emit('page-change', page)" />
        </div>

        <BookingDetailsModal :booking="selectedBooking" :is-open="showDetailsModal" @close="closeDetailsModal"
            @edit="booking => emit('edit-booking', booking)" />

        <BookingCancelModal :booking="selectedBooking" :is-open="showDeleteModal" @close="closeDeleteModal"
            @cancelled="handleCancelConfirm" />

        <BookingRefundModal :booking="selectedBooking" :is-open="showRefundModal" @close="closeRefundModal"
            @refunded="handleRefundConfirmed" />
    </div>
</template>
