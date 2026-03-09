<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div><h1 class="text-2xl font-bold text-white">Orders</h1><p class="text-dark-400 text-sm mt-1">Manage all platform orders</p></div>
    </div>
    <div class="card mb-6"><div class="flex flex-wrap gap-3">
      <input v-model="search" type="text" placeholder="Search order number..." class="input max-w-xs" @input="debouncedFetch" />
      <select v-model="statusFilter" class="input max-w-[160px]" @change="handleFetch">
        <option value="">All Statuses</option>
        <option v-for="s in ['pending','confirmed','processing','shipped','delivered','completed','cancelled']" :key="s" :value="s">{{ s }}</option>
      </select>
      <select v-model="paymentFilter" class="input max-w-[160px]" @change="handleFetch">
        <option value="">All Payments</option>
        <option v-for="s in ['pending','paid','failed','refunded']" :key="s" :value="s">{{ s }}</option>
      </select>
    </div></div>
    <div class="table-container">
      <table class="data-table">
        <thead><tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-if="loading"><td colspan="8" class="text-center py-12 text-dark-400"><Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto" /></td></tr>
          <tr v-else-if="orders.length === 0"><td colspan="8" class="text-center py-12 text-dark-400">No orders found</td></tr>
          <tr v-for="o in orders" :key="o._id" v-else>
            <td><code class="text-xs bg-dark-800 px-2 py-0.5 rounded">{{ o.orderNumber }}</code></td>
            <td class="text-dark-200 text-sm">{{ typeof o.customerId === 'object' ? (o.customerId as any)?.fullName : o.customerId }}</td>
            <td>{{ o.items?.length || 0 }}</td>
            <td class="font-medium text-white">₦{{ o.totalAmount.toLocaleString() }}</td>
            <td><span :class="o.paymentStatus === 'paid' ? 'badge-success' : o.paymentStatus === 'failed' ? 'badge-danger' : 'badge-warning'">{{ o.paymentStatus }}</span></td>
            <td><span :class="statusBadge(o.status)">{{ o.status }}</span></td>
            <td class="text-dark-400 text-xs">{{ new Date(o.createdAt).toLocaleDateString() }}</td>
            <td>
              <NuxtLink :to="`/orders/${o._id}`" class="btn-ghost btn-sm"><Icon name="lucide:eye" class="w-3.5 h-3.5" /></NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-4">
      <p class="text-sm text-dark-400">Page {{ page }} of {{ totalPages }}</p>
      <div class="flex gap-2">
        <button @click="page--; handleFetch()" :disabled="page <= 1" class="btn-secondary btn-sm">Previous</button>
        <button @click="page++; handleFetch()" :disabled="page >= totalPages" class="btn-secondary btn-sm">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types'
import { useFetchOrders } from '@/composables/modules/orders/useFetchOrders'

definePageMeta({ layout: 'dashboard' })

const { orders, loading, total, fetchOrders } = useFetchOrders()

const page = ref(1)
const limit = ref(10)
const search = ref('')
const statusFilter = ref('')
const paymentFilter = ref('')

const totalPages = computed(() => Math.ceil(total.value / limit.value))

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
    active: 'badge-success',
    completed: 'badge-success',
    delivered: 'badge-success',
    processing: 'badge-info',
    shipped: 'badge-info',
    confirmed: 'badge-info',
    pending: 'badge-warning',
    cancelled: 'badge-danger',
    refunded: 'badge-danger'
  }[s] || 'badge-neutral'
}

onMounted(handleFetch)
</script>
