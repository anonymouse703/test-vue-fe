import type { Service } from './service'
import type { BookingStatus } from '@/composables/useBooking'

export interface BookingBase {
    booking_date: string
    start_time: string
    end_time: string
    notes?: string
}

export interface BookingForm extends BookingBase {
    service_id: string
}

export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}

export interface Booking extends BookingBase {
    id: number
    reference_number: string
    status: BookingStatus
    service_id: string
    service?: Service
    user?: {
        id: number
        name: string
        role: string
    }
    created_at?: string
}
