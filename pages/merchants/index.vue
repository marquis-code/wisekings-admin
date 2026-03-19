<template>
  <div>
    <definePageMeta :layout="'dashboard'" />

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Merchants</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Manage and monitor all onboarded store partners</p>
      </div>
      <div class="flex gap-3">
        <div class="px-5 py-2.5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-2">
          <Icon name="lucide:store" class="w-4 h-4 text-emerald-600" />
          <span class="text-xs font-black text-emerald-700 uppercase tracking-widest">{{ total }} Total Merchants</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-center">
      <div class="relative flex-1 min-w-[300px]">
        <Icon name="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          v-model="search" 
          type="text" 
          placeholder="Search by name, email or code..." 
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
            { label: 'Active', value: 'active' },
            { label: 'Pending', value: 'pending' },
            { label: 'Suspended', value: 'suspended' }
          ]"
          @update:modelValue="handleFetch"
        />
        <SelectInput 
          v-model="categoryFilter" 
          label="Filter by Category"
          width="200px"
          :options="[
            { label: 'All Categories', value: '' },
            { label: 'Standard', value: 'standard' },
            { label: 'Gold', value: 'gold' },
            { label: 'Premium', value: 'premium' }
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
              <th class="!py-5 !pl-6">Merchant Details</th>
              <th class="!py-5">Rank/Category</th>
              <th class="!py-5">Commission</th>
              <th class="!py-5">Total Sales</th>
              <th class="!py-5">Status</th>
              <th class="!py-5 !pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="!p-0">
                <CoreSkeletonLoader :rows="5" avatar />
              </td>
            </tr>
            <tr v-else-if="merchants.length === 0">
              <td colspan="6" class="!py-10">
                <CoreEmptyState 
                  icon="lucide:store" 
                  title="No merchants found" 
                  description="When business partners register, they will appear here for management."
                />
              </td>
            </tr>
            <tr v-for="m in merchants" :key="m._id" v-else class="group">
              <td class="!py-4 !pl-6">
                <div class="flex items-center gap-4">
                  <div class="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-black text-sm uppercase">
                    {{ m.fullName.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm leading-tight">{{ m.fullName }}</p>
                    <p class="text-[10px] font-medium text-gray-400 mt-0.5 tracking-tight uppercase">{{ m.merchantCode }} • {{ m.email }}</p>
                  </div>
                </div>
              </td>
              <td class="!py-4 text-sm">
                <div class="flex flex-col gap-1">
                  <span class="inline-flex px-2 py-0.5 rounded bg-gray-50 text-gray-600 text-[10px] font-black uppercase tracking-widest border border-gray-100 max-w-fit">
                    {{ m.category }}
                  </span>
                  <span class="text-xs font-bold text-gray-400 capitalize">{{ m.rank }}</span>
                </div>
              </td>
              <td class="!py-4">
                <div class="flex items-center gap-1.5">
                  <Icon name="lucide:percent" class="w-3.5 h-3.5 text-blue-500" />
                  <span class="text-sm font-bold text-gray-700">{{ m.commissionRate }}%</span>
                </div>
              </td>
              <td class="!py-4">
                <span class="font-black text-gray-900 text-sm">₦{{ (m.totalSalesValue || 0).toLocaleString() }}</span>
              </td>
              <td class="!py-4">
                <span :class="[
                  'px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border',
                  m.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  m.status === 'suspended' ? 'bg-red-50 text-red-600 border-red-100' : 
                  'bg-amber-50 text-amber-600 border-amber-100'
                ]">
                  {{ m.status }}
                </span>
              </td>
              <td class="!py-4 !pr-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink 
                    :to="`/merchants/${m._id}`" 
                    class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-[#033958] hover:text-white transition-all duration-300"
                    title="View Details"
                  >
                    <Icon name="lucide:eye" class="w-4 h-4" />
                  </NuxtLink>
                  <button 
                    v-if="m.status === 'active'" 
                    @click="handleSuspend(m)" 
                    class="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                    title="Suspend Merchant"
                  >
                    <Icon name="lucide:ban" class="w-4 h-4" />
                  </button>
                  <button 
                    v-if="m.status === 'suspended'" 
                    @click="handleActivate(m)" 
                    class="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-300"
                    title="Activate Merchant"
                  >
                    <Icon name="lucide:check-circle" class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <CorePagination 
      v-model="page" 
      :total="total" 
      :limit="limit" 
      @update:modelValue="handleFetch"
    />
  </div>
</template>

<script setup lang="ts">
import type { Merchant } from '~/types'
import SelectInput from '@/components/core/SelectInput.vue'
import { useFetchMerchants } from '@/composables/modules/merchants/useFetchMerchants'
import { useSuspendMerchant } from '@/composables/modules/merchants/useSuspendMerchant'
import { useActivateMerchant } from '@/composables/modules/merchants/useActivateMerchant'
import { useConfirm } from '@/composables/core/useConfirm'

definePageMeta({ layout: 'dashboard' })

const { merchants, loading, total, fetchMerchants } = useFetchMerchants()
const { suspendMerchant: suspendAction } = useSuspendMerchant()
const { activateMerchant: activateAction } = useActivateMerchant()
const { openConfirm } = useConfirm()

const page = ref(1)
const limit = ref(10)
const search = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')

const totalPages = computed(() => Math.ceil(total.value / limit.value))

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; handleFetch() }, 400)
}

function handleFetch() {
  fetchMerchants({
    page: page.value,
    limit: limit.value,
    search: search.value || undefined,
    status: statusFilter.value || undefined,
    category: categoryFilter.value || undefined,
  })
}

async function handleSuspend(m: Merchant) {
  if (await openConfirm({
    title: 'Suspend Merchant',
    message: `Are you sure you want to suspend "${m.fullName}"?`,
    confirmText: 'Suspend',
    confirmClass: 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20',
    icon: 'lucide:ban'
  })) {
    const success = await suspendAction(m._id)
    if (success) handleFetch()
  }
}

async function handleActivate(m: Merchant) {
  if (await openConfirm({
    title: 'Activate Merchant',
    message: `Are you sure you want to activate "${m.fullName}"?`,
    confirmText: 'Activate',
    confirmClass: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20',
    icon: 'lucide:check-circle'
  })) {
    const success = await activateAction(m._id)
    if (success) handleFetch()
  }
}

onMounted(handleFetch)
</script>
