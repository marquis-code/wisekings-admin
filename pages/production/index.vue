<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Production Analytics</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Track batches, costs, and net profitability</p>
      </div>
      <div class="flex gap-4">
        <NuxtLink to="/production/materials" class="btn-secondary !rounded-2xl !py-3 !px-6 border-dashed border-2">
            <Icon name="lucide:package" class="w-5 h-5 mr-2" />
            Inventory & Costs
        </NuxtLink>
        <button @click="showBatchModal = true" class="btn-primary flex items-center gap-2 !rounded-2xl !py-3 !px-6 shadow-lg shadow-[#033958]/20">
            <Icon name="lucide:calculator" class="w-5 h-5" />
            <span class="font-bold">Record New Batch</span>
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6">
            <Icon name="lucide:trending-up" size="24" />
        </div>
        <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
        <p class="text-3xl font-black text-gray-900">₦{{ totalRevenue.toLocaleString() }}</p>
      </div>
      <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div class="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-6">
            <Icon name="lucide:banknote" size="24" />
        </div>
        <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Production Expenses</p>
        <p class="text-3xl font-black text-gray-900">₦{{ totalExpenses.toLocaleString() }}</p>
      </div>
      <div class="bg-gray-950 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div class="absolute -right-4 -bottom-4 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl"></div>
        <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 mb-6 border border-white/10">
            <Icon name="lucide:pie-chart" size="24" />
        </div>
        <p class="text-xs font-black text-white/40 uppercase tracking-widest mb-1">Net Profit</p>
        <p class="text-3xl font-black text-white">₦{{ totalProfit.toLocaleString() }}</p>
      </div>
    </div>

    <!-- Batch History -->
    <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
        <h3 class="text-sm font-black text-[#033958] uppercase tracking-widest">Recent Production Batches</h3>
        <span class="text-[10px] font-bold text-gray-400 uppercase">{{ batches.length }} Batches Recorded</span>
      </div>
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-white">
            <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Batch ID</th>
            <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product</th>
            <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Expenses</th>
            <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Profit</th>
            <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Margin</th>
            <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Date</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-if="loading">
            <td colspan="6" class="px-8 py-10 text-center"><Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto text-gray-300" /></td>
          </tr>
          <tr v-else-if="batches.length === 0">
            <td colspan="6" class="px-8 py-20 text-center">
              <Icon name="lucide:clipboard-list" class="w-12 h-12 text-gray-100 mx-auto mb-4" />
              <p class="text-gray-400 font-bold text-sm">No batches recorded yet</p>
            </td>
          </tr>
          <tr v-for="b in batches" :key="b._id" class="hover:bg-gray-50/50 transition-colors">
            <td class="px-8 py-5">
              <span class="font-black text-xs text-gray-900 uppercase tracking-tighter">{{ b.batchNumber }}</span>
            </td>
            <td class="px-8 py-5">
              <p class="text-sm font-bold text-gray-700">{{ b.productId?.name || 'Unknown' }}</p>
              <p class="text-[10px] font-black text-gray-400 uppercase">{{ b.quantityProduced }} SKUs Produced</p>
            </td>
            <td class="px-8 py-5 text-sm font-bold text-red-500">₦{{ b.totalProductionCost.toLocaleString() }}</td>
            <td class="px-8 py-5 text-sm font-black text-emerald-600">₦{{ b.profit.toLocaleString() }}</td>
            <td class="px-8 py-5">
              <span :class="['px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase', b.marginPercentage > 20 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600']">
                {{ b.marginPercentage.toFixed(1) }}%
              </span>
            </td>
            <td class="px-8 py-5 text-right font-medium text-xs text-gray-400">
              {{ new Date(b.createdAt).toLocaleDateString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modals -->
    <ProductionBatchModal :show="showBatchModal" @close="showBatchModal = false" @success="fetchBatches" />
  </div>
</template>

<script setup lang="ts">
import { useFetchBatches } from '@/composables/modules/production/useFetchBatches'

definePageMeta({ layout: 'dashboard' })

const { batches, loading, fetchBatches } = useFetchBatches()
const showBatchModal = ref(false)

const totalRevenue = computed(() => batches.value.reduce((sum, b) => sum + b.revenue, 0))
const totalExpenses = computed(() => batches.value.reduce((sum, b) => sum + b.totalProductionCost, 0))
const totalProfit = computed(() => batches.value.reduce((sum, b) => sum + b.profit, 0))

onMounted(fetchBatches)
</script>
