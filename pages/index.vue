<template>
  <div>
    <definePageMeta :layout="'dashboard'" />

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="flex items-center justify-between">
          <span class="text-dark-400 text-sm">{{ stat.label }}</span>
          <div :class="['w-10 h-10 rounded-lg flex items-center justify-center', stat.bgColor]">
            <Icon :name="stat.icon" :class="['w-5 h-5', stat.iconColor]" />
          </div>
        </div>
        <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
        <p class="text-xs text-dark-400">{{ stat.subtitle }}</p>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Orders -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-white">Recent Orders</h2>
          <NuxtLink to="/orders" class="text-primary-400 text-sm hover:text-primary-300">View all →</NuxtLink>
        </div>
        <div v-if="recentOrders.length === 0" class="text-center py-8 text-dark-400">
          <Icon name="lucide:package" class="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No orders yet</p>
        </div>
        <div v-else class="space-y-3">
          <div v-for="order in recentOrders" :key="order._id" class="flex items-center justify-between py-2 border-b border-dark-700/50 last:border-0">
            <div>
              <p class="text-sm font-medium text-dark-200">{{ order.orderNumber }}</p>
              <p class="text-xs text-dark-400">₦{{ order.totalAmount.toLocaleString() }}</p>
            </div>
            <span :class="statusBadge(order.status)">{{ order.status }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Merchants -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-white">Recent Merchants</h2>
          <NuxtLink to="/merchants" class="text-primary-400 text-sm hover:text-primary-300">View all →</NuxtLink>
        </div>
        <div v-if="recentMerchants.length === 0" class="text-center py-8 text-dark-400">
          <Icon name="lucide:store" class="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No merchants yet</p>
        </div>
        <div v-else class="space-y-3">
          <div v-for="merchant in recentMerchants" :key="merchant._id" class="flex items-center justify-between py-2 border-b border-dark-700/50 last:border-0">
            <div>
              <p class="text-sm font-medium text-dark-200">{{ merchant.fullName }}</p>
              <p class="text-xs text-dark-400">{{ merchant.merchantCode }}</p>
            </div>
            <span :class="statusBadge(merchant.status)">{{ merchant.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFetchOrders } from '@/composables/modules/orders/useFetchOrders'
import { useFetchMerchants } from '@/composables/modules/merchants/useFetchMerchants'
import { orders_api } from '@/api_factory/modules/orders'
import { merchants_api } from '@/api_factory/modules/merchants'

definePageMeta({ layout: 'dashboard' })

const { orders: recentOrders, fetchOrders } = useFetchOrders()
const { merchants: recentMerchants, fetchMerchants } = useFetchMerchants()

const orderStats = ref<any>({})
const merchantStats = ref<any>({})

const stats = computed(() => [
  {
    label: 'Total Orders',
    value: orderStats.value?.total || 0,
    subtitle: 'All time',
    icon: 'lucide:shopping-cart',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
  },
  {
    label: 'Active Merchants',
    value: merchantStats.value?.active || 0,
    subtitle: `${merchantStats.value?.total || 0} total`,
    icon: 'lucide:store',
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
  },
  {
    label: 'Revenue',
    value: `₦${((orderStats.value?.totalRevenue || 0) / 1000).toFixed(0)}k`,
    subtitle: 'Total sales',
    icon: 'lucide:trending-up',
    bgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
  },
  {
    label: 'Pending Withdrawals',
    value: orderStats.value?.pendingWithdrawals || 0,
    subtitle: 'Awaiting action',
    icon: 'lucide:wallet',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
  },
])

function statusBadge(status: string) {
  const map: Record<string, string> = {
    active: 'badge-success',
    pending: 'badge-warning',
    suspended: 'badge-danger',
    completed: 'badge-success',
    delivered: 'badge-success',
    processing: 'badge-info',
    shipped: 'badge-info',
    cancelled: 'badge-danger',
  }
  return map[status?.toLowerCase()] || 'badge-neutral'
}

onMounted(async () => {
  try {
    await Promise.allSettled([
      fetchOrders({ page: 1, limit: 5, sortOrder: 'desc' }),
      fetchMerchants({ page: 1, limit: 5, sortOrder: 'desc' }),
      orders_api.getStats().then(res => orderStats.value = res.data || res),
      merchants_api.getStats().then(res => merchantStats.value = res.data || res),
    ])
  } catch { /* silently fail on dashboard load */ }
})
</script>
