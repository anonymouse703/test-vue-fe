<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Loader2, Calendar, Clock, ArrowLeft } from 'lucide-vue-next'
import api from '@/utils/api'
import { useToast } from 'vue-toastification'
import type { AxiosError } from 'axios'

import type { Service } from '@/types/service'
import type { BookingForm, Booking } from '@/types/booking'

import DashboardHeader from '@/components/DashboardHeader.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseTextArea from '@/components/ui/BaseTextArea.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const bookingId = computed(() => route.params.id as string | undefined)
const isEditMode = computed(() => !!bookingId.value)

const form = reactive<BookingForm>({
  service_id: '',
  booking_date: '',
  start_time: '',
  end_time: '',
  notes: ''
})

const services = ref<Service[]>([])
const isLoadingServices = ref(false)
const isSubmitting = ref(false)

const selectedService = computed(() =>
  services.value.find(s => s.id === form.service_id)
)

const isFormValid = computed(() =>
  form.service_id !== '' &&
  form.booking_date !== '' &&
  form.start_time !== '' &&
  form.end_time !== ''
)

const pageTitle = computed(() =>
  isEditMode.value ? 'Edit Booking' : 'Create New Booking'
)

const submitText = computed(() =>
  isEditMode.value
    ? isSubmitting.value ? 'Updating...' : 'Update Booking'
    : isSubmitting.value ? 'Creating...' : 'Create Booking'
)

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const fetchServices = async () => {
  try {
    isLoadingServices.value = true
    const response = await api.get<{ data: Service[] }>('/api/services')
    services.value = response.data.data.map(s => ({ ...s, id: String(s.id) }))
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message: string }>
    toast.error(axiosErr?.response?.data?.message || 'Failed to load services')
    console.error('Error fetching services:', err)
  } finally {
    isLoadingServices.value = false
  }
}

const fetchBooking = async () => {
  if (!bookingId.value) return

  try {
    const response = await api.get<{ data: Booking }>(`/api/bookings/${bookingId.value}`)
    const booking = response.data.data

    form.service_id = String(booking.service_id)
    form.booking_date = booking.booking_date
    form.start_time = booking.start_time
    form.end_time = booking.end_time
    form.notes = booking.notes ?? ''
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message: string }>
    toast.error(axiosErr?.response?.data?.message || 'Failed to load booking')
    console.error('Error fetching booking:', err)
    router.push('/')
  }
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    toast.error('Please fill in all required fields')
    return
  }

  try {
    isSubmitting.value = true

    const payload = {
      ...form,
      service_id: parseInt(form.service_id, 10)
    }

    if (isEditMode.value) {
      await api.put(`/api/bookings/${bookingId.value}`, payload)
      toast.success('Booking updated successfully!')
    } else {
      await api.post('/api/bookings', payload)
      toast.success('Booking created successfully!')
    }

    router.push('/')
  } catch (err: unknown) {
    const axiosErr = err as AxiosError<{ message: string }>
    toast.error(axiosErr?.response?.data?.message || 'Operation failed')
    console.error('Error submitting booking:', err)
  } finally {
    isSubmitting.value = false
  }
}

const handleLogout = () => {
  toast.success('Logged out successfully')
  router.push('/login')
}

const goBack = () => router.push('/')

onMounted(async () => {
  await fetchServices()

  if (isEditMode.value) {
    await fetchBooking()
  }
})
</script>


<template>
  <div class="min-h-screen bg-gray-50">
    <DashboardHeader userName="John Doe" userEmail="john@example.com" @logout="handleLogout" />

    <main class="px-4 py-8 pb-24 md:px-6 lg:px-8">
      <div class="mb-8">
        <button @click="goBack"
          class="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          <ArrowLeft class="h-4 w-4" />
          Back to Bookings
        </button>
        <!-- <h1 class="text-3xl font-bold text-gray-900">Create New Booking</h1> -->
        <h1 class="text-3xl font-bold text-gray-900">{{ pageTitle }}</h1>
        <p class="mt-2 text-gray-500">Fill in the details for your booking</p>
      </div>

      <div class=" flex items-center justify-center bg-gray-50">
        <div class="w-full max-w-3xl text-center">
          <div class="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 md:p-8">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Service Selection using BaseSelect -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Select Service <span
                    class="text-red-500">*</span></label>
                <div v-if="isLoadingServices" class="flex items-center justify-center py-4">
                  <Loader2 class="h-6 w-6 animate-spin text-blue-600" />
                  <span class="ml-2 text-sm text-gray-600">Loading services...</span>
                </div>
                <div v-else>
                  <BaseSelect v-model="form.service_id" :options="services.map(s => ({ label: s.name, value: s.id }))"
                    placeholder="Select a service"
                    :error="form.service_id === '' ? 'Please select a service' : undefined" />
                </div>
              </div>

              <!-- Booking Date -->
              <div class="space-y-2">
                <label for="booking_date" class="block text-sm font-medium text-gray-700">Booking Date <span
                    class="text-red-500">*</span></label>
                <div class="relative">
                  <Calendar class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 z-10" />
                  <BaseInput id="booking_date" v-model="form.booking_date" type="date" :min="minDate" :required="true"
                    class="pl-10" />
                </div>
              </div>

              <!-- Start & End Time -->
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="space-y-2">
                  <label for="start_time" class="block text-sm font-medium text-gray-700">Start Time <span
                      class="text-red-500">*</span></label>
                  <div class="relative">
                    <Clock class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 z-10" />
                    <BaseInput id="start_time" v-model="form.start_time" type="time" placeholder="Select start time"
                      :required="true" class="pl-10" />
                  </div>
                </div>

                <div class="space-y-2">
                  <label for="end_time" class="block text-sm font-medium text-gray-700">End Time <span
                      class="text-red-500">*</span></label>
                  <div class="relative">
                    <Clock class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 z-10" />
                    <BaseInput id="end_time" v-model="form.end_time" type="time" placeholder="Select end time"
                      :required="true" class="pl-10" />
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
                <BaseTextArea v-model="form.notes" placeholder="Add any notes..." :disabled="isSubmitting" />
              </div>

              <div v-if="selectedService" class="rounded-lg bg-blue-50 p-4 border border-blue-200">
                <div class="text-sm font-medium text-blue-900">Selected Service</div>
                <div class="mt-1 text-sm text-blue-700">{{ selectedService.name }}</div>
              </div>

              <div class="flex gap-3 pt-4">
                <button type="button" @click="goBack"
                  class="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" :disabled="!isFormValid || isSubmitting"
                  class="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2">
                  <Loader2 v-if="isSubmitting" class="h-5 w-5 animate-spin" />
                  <span>{{ submitText }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>