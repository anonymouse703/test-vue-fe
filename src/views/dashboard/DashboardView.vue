<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/utils/api'
import { useToast } from 'vue-toastification'
import DashboardHeader from '@/components/DashboardHeader.vue'
import BookingList from '@/components/BookingList.vue'
import CreateBookingButton from '@/components/ui/CreateBookingButton.vue'
import type { BookingStatus } from '@/composables/useBooking'
import type { AxiosError } from 'axios'
import { useRouter } from 'vue-router'
import type { Booking, ApiResponse } from '@/types/booking'

const bookings = ref<Booking[]>([])
const currentPage = ref<number>(1)
const totalPages = ref<number>(1)
const isLoading = ref(false)

const toast = useToast()
const router = useRouter()

const handleCreateBooking = () => router.push({ name: 'CreateBooking' })
const handleLogout = () => toast.success('Logged out successfully')
const handleEditBooking = (booking: Booking) => router.push(`/bookings/${booking.id}/edit`)
const handleViewBooking = (booking: Booking) =>
    toast.info(`Viewing: ${booking.service?.name ?? booking.service_id}`)

// ------------------
// Fetch bookings
// ------------------
const fetchBookings = async (page = 1) => {
    try {
        isLoading.value = true
        const response = await api.get<ApiResponse<{ data: Booking[], current_page?: number, last_page?: number }>>('/api/bookings', { params: { page } })
        const payload = response.data.data
        const bookingsArray: Booking[] = Array.isArray(payload?.data) ? payload.data : []

        bookings.value = bookingsArray.map((b) => ({
            id: b.id,
            reference_number: b.reference_number,
            service_id: String(b.service_id),
            service: b.service,
            booking_date: b.booking_date,
            start_time: b.start_time,
            end_time: b.end_time ?? '',
            status: b.status as BookingStatus,
            notes: b.notes ?? '',
            user: b.user,
            created_at: b.created_at
        }))

        currentPage.value = payload?.current_page ?? page
        totalPages.value = payload?.last_page ?? 1
    } catch (err: unknown) {
        const axiosErr = err as AxiosError<{ message: string }>
        toast.error(
            axiosErr?.response?.data?.message ?? (err instanceof Error ? err.message : 'Failed to fetch bookings')
        )
        bookings.value = []
        currentPage.value = 1
        totalPages.value = 1
    } finally {
        isLoading.value = false
    }
}

// ------------------
// Event handlers
// ------------------
const handlePageChange = (page: number) => fetchBookings(page)

const handleCancelBooking = async (updatedBooking: Booking) => {
    toast.success(`Booking ${updatedBooking.service?.name} cancelled`)
    await fetchBookings(currentPage.value)
}

const handleRefundBooking = async (updatedBooking: Booking) => {
    toast.success(`Refund requested for booking ${updatedBooking.service?.name}`)
    await fetchBookings(currentPage.value)
}

onMounted(() => fetchBookings(currentPage.value))
</script>

<template>
    <div class="min-h-screen bg-gray-50 w-full">
        <DashboardHeader userName="John Doe" userEmail="john@example.com" @logout="handleLogout" />

        <main class="w-full px-4 py-8 pb-24 md:px-6 lg:px-8">
            <transition appear enter-active-class="transition-all duration-400 ease-out"
                enter-from-class="opacity-0 translate-y-5" enter-to-class="opacity-100 translate-y-0">
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-900">My Bookings</h1>
                    <p class="mt-2 text-gray-500">Manage and view all your upcoming bookings</p>
                </div>
            </transition>

            <BookingList :bookings="bookings" :isLoading="isLoading" :currentPage="currentPage" :totalPages="totalPages"
                @page-change="handlePageChange" @edit-booking="handleEditBooking" @view-booking="handleViewBooking"
                @cancel-booking="handleCancelBooking" @refunded="handleRefundBooking" />
        </main>

        <CreateBookingButton @click="handleCreateBooking" />
    </div>
</template>
