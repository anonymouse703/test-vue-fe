import { computed } from 'vue'

export type BookingStatus =
    | 'pending'
    | 'approved'
    | 'cancelled'
    | 'rescheduled'
    | 'no_show'
    | 'refunded'
    | 'refund_requested'
    | 'refund_denied'

export const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
    approved: {
        label: 'Approved',
        className: 'bg-green-100 text-green-800 border-green-200',
    },
    pending: {
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    cancelled: {
        label: 'Cancelled',
        className: 'bg-red-100 text-red-800 border-red-200',
    },
    rescheduled: {
        label: 'Rescheduled',
        className: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    no_show: {
        label: 'No-Show',
        className: 'bg-gray-100 text-gray-800 border-gray-200',
    },
    refunded: {
        label: 'Refunded',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    refund_requested: {
        label: 'Refund Requested',
        className: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
    refund_denied: {
        label: 'Refund Denied',
        className: 'bg-pink-100 text-pink-800 border-pink-200',
    },
}

export function useBookingStatus(status: BookingStatus) {
    const label = computed(() => statusConfig[status]?.label ?? 'Unknown')
    const className = computed(() => statusConfig[status]?.className ?? 'bg-gray-100 text-gray-800')

    // Only approved bookings can be cancelled
    const isCancellable = computed(() => status === 'approved')

    // Only approved bookings can request refund
    const canRequestRefund = computed(() => status === 'approved')

    return { label, className, isCancellable, canRequestRefund }
}

