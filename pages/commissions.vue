<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex items-center justify-between mb-6"><div><h1 class="text-2xl font-bold text-white">Commissions</h1><p class="text-dark-400 text-sm mt-1">Track and manage commission payouts</p></div></div>
    <div class="card mb-6"><div class="flex flex-wrap gap-3">
      <select v-model="statusFilter" class="input max-w-[160px]" @change="handleFetch"><option value="">All</option><option v-for="s in ['pending','approved','paid','reversed']" :key="s" :value="s">{{ s }}</option></select>
    </div></div>
    <div class="table-container">
      <table class="data-table">
        <thead><tr><th>Order</th><th>Merchant</th><th>Amount</th><th>Rate</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-if="loading"><td colspan="7" class="text-center py-12 text-dark-400"><Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto" /></td></tr>
          <tr v-else-if="commissions.length === 0"><td colspan="7" class="text-center py-12 text-dark-400">No commissions found</td></tr>
          <tr v-for="c in commissions" :key="c._id" v-else>
            <td class="text-dark-200 text-sm">{{ typeof c.orderId === 'object' ? (c.orderId as any)?.orderNumber : c.orderId }}</td>
            <td class="text-dark-200 text-sm">{{ typeof c.merchantId === 'object' ? (c.merchantId as any)?.fullName : (c.merchantId || '—') }}</td>
            <td class="font-medium text-white">₦{{ c.amount.toLocaleString() }}</td>
            <td>{{ c.rate }}%</td>
            <td><span :class="c.status === 'paid' ? 'badge-success' : c.status === 'approved' ? 'badge-info' : c.status === 'reversed' ? 'badge-danger' : 'badge-warning'">{{ c.status }}</span></td>
            <td class="text-dark-400 text-xs">{{ new Date(c.createdAt).toLocaleDateString() }}</td>
            <td><button v-if="c.status === 'pending'" @click="handleAdjust(c)" class="btn-ghost btn-sm"><Icon name="lucide:edit" class="w-3.5 h-3.5" /></button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-4">
      <p class="text-sm text-dark-400">Page {{ page }} of {{ totalPages }}</p>
      <div class="flex gap-2"><button @click="page--; handleFetch()" :disabled="page <= 1" class="btn-secondary btn-sm">Prev</button><button @click="page++; handleFetch()" :disabled="page >= totalPages" class="btn-secondary btn-sm">Next</button></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Commission } from '~/types'
import { useFetchCommissions } from '@/composables/modules/commissions/useFetchCommissions'
import { useAdjustCommission } from '@/composables/modules/commissions/useAdjustCommission'

definePageMeta({ layout: 'dashboard' })

const { commissions, loading, total, fetchCommissions } = useFetchCommissions()
const { adjustCommission: adjustAction } = useAdjustCommission()

const page = ref(1)
const statusFilter = ref('')
const totalPages = computed(() => Math.ceil(total.value / 10))

async function handleFetch() {
  await fetchCommissions({
    page: page.value,
    limit: 10,
    status: statusFilter.value || undefined
  })
}

async function handleAdjust(c: Commission) {
  const amount = prompt('Adjustment amount:')
  const reason = prompt('Reason for adjustment:')
  if (!amount || !reason) return
  const success = await adjustAction(c._id, Number(amount), reason)
  if (success) handleFetch()
}

onMounted(handleFetch)
</script>
