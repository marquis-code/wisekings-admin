<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Commissions</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Track and manage sales commission payouts for partners</p>
      </div>
      <div class="flex gap-3">
        <div class="px-5 py-2.5 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-2">
          <Icon name="lucide:calculator" class="w-4 h-4 text-amber-600" />
          <span class="text-xs font-black text-amber-700 uppercase tracking-widest">Payout Analytics</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-center">
      <div class="flex flex-wrap gap-3">
        <SelectInput 
          v-model="statusFilter" 
          label="Filter by Status"
          :options="[
            { label: 'All Payout Statuses', value: '' },
            { label: 'Pending', value: 'pending' },
            { label: 'Approved', value: 'approved' },
            { label: 'Paid', value: 'paid' },
            { label: 'Reversed', value: 'reversed' }
          ]"
          @update:modelValue="handleFetch"
        />
        <button @click="handleFetch" class="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#033958]/5 text-[#033958] hover:bg-[#033958] hover:text-white transition-all">
          <Icon name="lucide:rotate-cw" class="w-5 h-5" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white shadow-sm border border-gray-100 overflow-hidden !rounded-3xl">
      <div class="overflow-x-auto">
        <table class="data-table w-full">
          <thead>
            <tr class="!bg-gray-50/50">
              <th class="!py-5 !pl-6">Source Order</th>
              <th class="!py-5">Target Merchant</th>
              <th class="!py-5">Amount</th>
              <th class="!py-5 text-center">Commission Rate</th>
              <th class="!py-5">Payout Status</th>
              <th class="!py-5 !pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="!p-0">
                <CoreSkeletonLoader :rows="6" />
              </td>
            </tr>
            <tr v-else-if="commissions.length === 0">
              <td colspan="6" class="!py-10">
                <CoreEmptyState 
                  icon="lucide:badge-cent" 
                  title="No commissions recorded" 
                  description="Payout records will be generated automatically as orders are completed."
                />
              </td>
            </tr>
            <tr v-for="c in commissions" :key="c._id" v-else class="hover:bg-gray-50/50 transition-colors">
              <td class="!py-4 !pl-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                    <Icon name="lucide:hash" class="w-4 h-4" />
                  </div>
                  <span class="text-sm font-bold text-gray-700">
                    {{ typeof c.orderId === 'object' ? (c.orderId as any)?.orderNumber : c.orderId }}
                  </span>
                </div>
              </td>
              <td class="!py-4 text-sm font-medium text-gray-600 truncate max-w-[200px]">
                {{ typeof c.merchantId === 'object' ? (c.merchantId as any)?.fullName : (c.merchantId || '—') }}
              </td>
              <td class="!py-4 font-black text-gray-900">
                ₦{{ c.amount.toLocaleString() }}
              </td>
              <td class="!py-4 text-center">
                <span class="px-2 py-0.5 rounded bg-gray-50 text-gray-500 text-[10px] font-black italic border border-gray-100">
                  {{ c.rate }}%
                </span>
              </td>
              <td class="!py-4">
                <span :class="[
                  'px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border',
                  c.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  c.status === 'reversed' ? 'bg-red-50 text-red-600 border-red-100' : 
                  c.status === 'approved' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                  'bg-amber-50 text-amber-600 border-amber-100'
                ]">
                  {{ c.status }}
                </span>
              </td>
              <td class="!py-4 !pr-6 text-right">
                <button 
                  v-if="c.status === 'pending'" 
                  @click="handleAdjust(c)" 
                  class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-[#033958] hover:text-white transition-all duration-300"
                  title="Adjust Commission"
                >
                  <Icon name="lucide:edit-3" class="w-4 h-4" />
                </button>
                <div v-else class="text-[10px] font-bold text-gray-400 italic">Locked</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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
import type { Commission } from '~/types'
import SelectInput from '@/components/core/SelectInput.vue'
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
