<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Orders</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Manage and track all platform transactions</p>
      </div>
      <div class="flex gap-3">
        <div class="px-5 py-2.5 bg-[#033958]/5 rounded-2xl border border-[#033958]/10 flex items-center gap-2">
          <Icon name="lucide:shopping-bag" class="w-4 h-4 text-[#033958]" />
          <span class="text-xs font-black text-[#033958] uppercase tracking-widest">{{ total }} Total Orders</span>
        </div>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-center">
      <div class="relative flex-1 min-w-[300px]">
        <Icon name="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          v-model="search" 
          type="text" 
          placeholder="Search by order number or customer..." 
          class="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#033958]/10 transition-all font-medium" 
          @input="debouncedFetch" 
        />
      </div>
      <div class="flex flex-wrap gap-3">
        <SelectInput 
          v-model="statusFilter" 
          label="Filter by Status"
          width="200px"
          :options="[
            { label: 'All Statuses', value: '' },
            { label: 'Pending', value: 'pending' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Processing', value: 'processing' },
            { label: 'Shipped', value: 'shipped' },
            { label: 'Delivered', value: 'delivered' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' }
          ]"
          @update:modelValue="handleFetch"
        />
        <SelectInput 
          v-model="paymentFilter" 
          label="Filter by Payment"
          width="200px"
          :options="[
            { label: 'All Payments', value: '' },
            { label: 'Pending', value: 'pending' },
            { label: 'Paid', value: 'paid' },
            { label: 'Failed', value: 'failed' },
            { label: 'Refunded', value: 'refunded' }
          ]"
          @update:modelValue="handleFetch"
        />
        <button @click="handleFetch" class="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#033958]/5 text-[#033958] hover:bg-[#033958] hover:text-white transition-all">
          <Icon name="lucide:rotate-cw" class="w-5 h-5" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white shadow-sm border border-gray-100 overflow-hidden !rounded-3xl">
      <div class="overflow-x-auto">
        <table class="data-table w-full">
          <thead>
            <tr class="!bg-gray-50/50">
              <th class="!py-5 !pl-6">
                <input 
                  type="checkbox" 
                  :checked="selectedIds.length === orders.length && orders.length > 0" 
                  @change="toggleAll"
                  class="custom-checkbox"
                />
              </th>
              <th class="!py-5">Order ID</th>
              <th class="!py-5">Customer</th>
              <th class="!py-5 text-center">Items</th>
              <th class="!py-5">Amount</th>
              <th class="!py-5">Payment</th>
              <th class="!py-5">Status</th>
              <th class="!py-5 !pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="!p-0">
                <CoreSkeletonLoader :rows="5" />
              </td>
            </tr>
            <tr v-else-if="orders.length === 0">
              <td colspan="7" class="!py-10">
                <CoreEmptyState 
                  icon="lucide:shopping-cart" 
                  title="No orders yet" 
                  description="When customers place orders, they will appear here for processing."
                />
              </td>
            </tr>
            <tr v-for="o in orders" :key="o._id" v-else class="group" :class="{ 'bg-blue-50/30': selectedIds.includes(o._id) }">
              <td class="!py-4 !pl-6">
                <input 
                  type="checkbox" 
                  v-model="selectedIds" 
                  :value="o._id"
                  class="custom-checkbox"
                />
              </td>
              <td class="!py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                    <Icon name="lucide:hash" class="w-4 h-4 text-gray-400" />
                  </div>
                  <span class="font-bold text-gray-900 text-sm tracking-tight">{{ o.orderNumber }}</span>
                </div>
              </td>
              <td class="!py-4">
                <div v-if="o.customerId" class="flex flex-col">
                  <span class="font-bold text-gray-900 text-sm leading-tight">{{ typeof o.customerId === 'object' ? (o.customerId as any)?.fullName : 'Customer' }}</span>
                  <span class="text-[10px] font-medium text-gray-400 mt-0.5">{{ typeof o.customerId === 'object' ? (o.customerId as any)?.email : o.customerId }}</span>
                </div>
                <span v-else class="text-gray-400 italic text-sm font-medium">Guest User</span>
              </td>
              <td class="!py-4 text-center">
                <span class="px-2.5 py-1 rounded-lg bg-gray-50 text-gray-700 text-xs font-bold border border-gray-100">
                  {{ o.items?.length || 0 }}
                </span>
              </td>
              <td class="!py-4">
                <span class="font-black text-gray-900 text-sm">₦{{ o.totalAmount.toLocaleString() }}</span>
              </td>
              <td class="!py-4">
                <span :class="[
                  'px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border',
                  o.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  o.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                  'bg-red-50 text-red-600 border-red-100'
                ]">
                  {{ o.paymentStatus }}
                </span>
              </td>
              <td class="!py-4">
                <span :class="['px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border', statusBadge(o.status)]">
                  {{ o.status }}
                </span>
              </td>
              <td class="!py-4 !pr-6 text-right">
                <NuxtLink 
                  :to="`/orders/${o._id}`" 
                  class="inline-flex w-10 h-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-[#033958] hover:text-white transition-all duration-300"
                >
                  <Icon name="lucide:eye" class="w-4 h-4" />
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Bulk Actions Floating Bar -->
    <Transition name="slide-up">
      <div v-if="selectedIds.length > 0" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#033958] text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-8 border border-white/10 backdrop-blur-xl max-w-[90vw] overflow-x-auto">
        <div class="flex items-center gap-3 pr-8 border-r border-white/20 flex-shrink-0">
          <span class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">{{ selectedIds.length }}</span>
          <span class="font-bold text-sm tracking-wide">Orders</span>
        </div>
        
        <div class="flex items-center gap-4 flex-shrink-0">
          <button @click="handleBulkStatus('processing')" class="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-all text-xs font-bold whitespace-nowrap">
            Process
          </button>
          <button @click="handleBulkStatus('shipped')" class="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-all text-xs font-bold whitespace-nowrap">
            Ship
          </button>
          <button @click="handleBulkStatus('delivered')" class="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-all text-xs font-bold whitespace-nowrap">
            Deliver
          </button>
          <button @click="handleBulkStatus('completed')" class="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all text-xs font-bold whitespace-nowrap">
            Complete
          </button>
          <button @click="handleBulkStatus('cancelled')" class="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl transition-all text-xs font-bold whitespace-nowrap">
            Cancel
          </button>
        </div>
        
        <button @click="selectedIds = []" class="ml-4 p-2 hover:bg-white/10 rounded-full transition-all flex-shrink-0">
          <Icon name="lucide:x" size="20" />
        </button>
      </div>
    </Transition>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between mt-8 bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm gap-4">
      <p class="text-sm font-bold text-gray-500 ml-4">Showing page {{ page }} of {{ totalPages }}</p>
      <div class="flex gap-2">
        <button 
          @click="page--; handleFetch()" 
          :disabled="page <= 1" 
          class="btn-secondary !rounded-2xl !px-6 disabled:opacity-20 transition-all font-bold"
        >
          Previous
        </button>
        <button 
          @click="page++; handleFetch()" 
          :disabled="page >= totalPages" 
          class="btn-primary !rounded-2xl !px-6 disabled:opacity-20 transition-all font-bold"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types'
import SelectInput from '@/components/core/SelectInput.vue'
import { useFetchOrders } from '@/composables/modules/orders/useFetchOrders'
import { orders_api } from '@/api_factory/modules/orders'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({ layout: 'dashboard' })

const { orders, loading, total, fetchOrders } = useFetchOrders()
const { showToast } = useCustomToast()

const page = ref(1)
const limit = ref(10)
const search = ref('')
const statusFilter = ref('')
const paymentFilter = ref('')
const selectedIds = ref<string[]>([])

const totalPages = computed(() => Math.ceil(total.value / limit.value))

function toggleAll() {
  if (selectedIds.value.length === orders.value.length) {
    selectedIds.value = []
  } else {
    selectedIds.value = orders.value.map(o => o._id)
  }
}

async function handleBulkStatus(status: string) {
  loading.value = true
  try {
    await orders_api.bulkUpdateStatus({ ids: selectedIds.value, status })
    selectedIds.value = []
    handleFetch()
    showToast({ title: 'Success', message: `Bulk updated to ${status}`, toastType: 'success' })
  } catch (err) {
    showToast({ title: 'Error', message: 'Bulk update failed', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

let dt: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(dt)
  dt = setTimeout(() => { page.value = 1; handleFetch() }, 400)
}

function handleFetch() {
  fetchOrders({
    page: page.value,
    limit: limit.value,
    search: search.value || undefined,
    status: statusFilter.value || undefined,
    paymentStatus: paymentFilter.value || undefined
  })
}

function statusBadge(s: string) {
  return {
    active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    delivered: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    processing: 'bg-blue-50 text-blue-600 border-blue-100',
    shipped: 'bg-blue-50 text-blue-600 border-blue-100',
    confirmed: 'bg-blue-50 text-blue-600 border-blue-100',
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100',
    refunded: 'bg-red-50 text-red-600 border-red-100'
  }[s] || 'bg-gray-100 text-gray-600 border-gray-200'
}

onMounted(handleFetch)
</script>
