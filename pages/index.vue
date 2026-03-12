<template>
  <div class="space-y-10">
    <definePageMeta :layout="'dashboard'" />

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm', stat.bgColor]">
            <Icon :name="stat.icon" :class="['w-6 h-6', stat.iconColor]" />
          </div>
          <div class="text-right">
            <span class="text-gray-400 text-xs font-bold uppercase tracking-wider">{{ stat.label }}</span>
            <p class="text-2xl font-black text-gray-900 mt-1">{{ stat.value }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
          <span class="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
            <Icon name="lucide:arrow-up-right" class="w-3 h-3 mr-0.5" />
            12%
          </span>
          <span class="text-[10px] font-medium text-gray-400">{{ stat.subtitle }}</span>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Orders -->
      <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-xl font-bold text-gray-900 tracking-tight">Recent Orders</h2>
            <p class="text-sm text-gray-500 font-medium">Manage and track latest purchases</p>
          </div>
          <NuxtLink to="/orders" class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-900 transition-all border border-gray-100">
            <Icon name="lucide:arrow-right" class="w-5 h-5" />
          </NuxtLink>
        </div>
        
        <div v-if="recentOrders.length === 0" class="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <Icon name="lucide:package" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p class="text-gray-500 font-medium">No orders found yet</p>
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="order in recentOrders" :key="order._id" class="flex items-center justify-between p-4 bg-gray-50/30 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-white transition-all group">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#033958] transition-colors">
                <Icon name="lucide:shopping-bag" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900">{{ order.orderNumber }}</p>
                <p class="text-xs text-gray-500 font-medium">₦{{ order.totalAmount.toLocaleString() }}</p>
              </div>
            </div>
            <span :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', statusBadge(order.status)]">{{ order.status }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Merchants -->
      <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-xl font-bold text-gray-900 tracking-tight">Latest Merchants</h2>
            <p class="text-sm text-gray-500 font-medium">Professional store partners</p>
          </div>
          <NuxtLink to="/merchants" class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-900 transition-all border border-gray-100">
            <Icon name="lucide:arrow-right" class="w-5 h-5" />
          </NuxtLink>
        </div>

        <div v-if="recentMerchants.length === 0" class="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <Icon name="lucide:store" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p class="text-gray-500 font-medium">No merchants registered</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="merchant in recentMerchants" :key="merchant._id" class="flex items-center justify-between p-4 bg-gray-50/30 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-white transition-all group">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <Icon name="lucide:store" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900">{{ merchant.fullName }}</p>
                <p class="text-xs text-gray-500 font-medium tracking-tight">{{ merchant.merchantCode }}</p>
              </div>
            </div>
            <span :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', statusBadge(merchant.status)]">{{ merchant.status || 'active' }}</span>
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
    active: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    pending: 'bg-amber-50 text-amber-600 border border-amber-100',
    suspended: 'bg-rose-50 text-rose-600 border border-rose-100',
    completed: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    delivered: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    processing: 'bg-blue-50 text-blue-600 border border-blue-100',
    shipped: 'bg-blue-50 text-blue-600 border border-blue-100',
    cancelled: 'bg-gray-50 text-gray-600 border border-gray-100',
  }
  return map[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
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
