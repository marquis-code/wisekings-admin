<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Partners</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Manage and monitor investor partnerships</p>
      </div>
      <div class="flex gap-3">
        <div class="px-5 py-2.5 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-2">
          <Icon name="lucide:handshake" class="w-4 h-4 text-blue-600" />
          <span class="text-xs font-black text-blue-700 uppercase tracking-widest">{{ total }} Total Partners</span>
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
          placeholder="Search by company, person or code..." 
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
              <th class="!py-5 !pl-6">Company</th>
              <th class="!py-5">Contact Person</th>
              <th class="!py-5 text-center">Comm. Rate</th>
              <th class="!py-5 text-right">Total Sales</th>
              <th class="!py-5 text-center">Status</th>
              <th class="!py-5 !pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="!p-0">
                <CoreSkeletonLoader :rows="5" avatar />
              </td>
            </tr>
            <tr v-else-if="partners.length === 0">
              <td colspan="6" class="!py-10">
                <CoreEmptyState 
                  icon="lucide:handshake" 
                  title="No partners found" 
                  description="Onboarded corporate partners will appear here for commission tracking."
                />
              </td>
            </tr>
            <tr v-for="p in partners" :key="p._id" v-else class="group">
              <td class="!py-4 !pl-6">
                <div class="flex items-center gap-4">
                  <div class="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-xs uppercase">
                    {{ p.companyName ? p.companyName.substring(0, 2) : 'PT' }}
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 text-sm leading-tight">{{ p.companyName }}</p>
                    <p class="text-[10px] font-medium text-gray-400 mt-0.5 tracking-tight uppercase">{{ p.partnerCode }} • {{ p.email }}</p>
                  </div>
                </div>
              </td>
              <td class="!py-4">
                <span class="text-sm font-bold text-gray-700">{{ p.contactPerson }}</span>
              </td>
              <td class="!py-4 text-center">
                <span class="px-2.5 py-1 rounded-lg bg-gray-50 text-gray-700 text-xs font-bold border border-gray-100 italic">
                  {{ p.commissionRate }}%
                </span>
              </td>
              <td class="!py-4 text-right">
                <span class="font-black text-gray-900 text-sm tracking-tight">₦{{ (p.totalSalesValue || 0).toLocaleString() }}</span>
              </td>
              <td class="!py-4 text-center">
                <span :class="[
                  'px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border',
                  p.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  p.status === 'suspended' ? 'bg-red-50 text-red-600 border-red-100' : 
                  'bg-amber-50 text-amber-600 border-amber-100'
                ]">
                  {{ p.status }}
                </span>
              </td>
              <td class="!py-4 !pr-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink 
                    :to="`/partners/${p._id}`" 
                    class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-[#033958] hover:text-white transition-all duration-300"
                    title="View Portfolio"
                  >
                    <Icon name="lucide:eye" class="w-4 h-4" />
                  </NuxtLink>
                  <button 
                    v-if="p.status === 'pending'" 
                    @click="handleApprove(p)" 
                    class="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-300"
                    title="Approve Partner"
                  >
                    <Icon name="lucide:check" class="w-4 h-4" />
                  </button>
                  <button 
                    v-if="p.status === 'active'" 
                    @click="handleSuspend(p)" 
                    class="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                    title="Suspend Partner"
                  >
                    <Icon name="lucide:ban" class="w-4 h-4" />
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
import type { Partner } from '~/types'
import SelectInput from '@/components/core/SelectInput.vue'
import { useFetchPartners } from '@/composables/modules/partners/useFetchPartners'
import { useApprovePartner } from '@/composables/modules/partners/useApprovePartner'
import { useSuspendPartner } from '@/composables/modules/partners/useSuspendPartner'
import { useConfirm } from '@/composables/core/useConfirm'

definePageMeta({ layout: 'dashboard' })

const { partners, loading, total, fetchPartners } = useFetchPartners()
const { approvePartner: approveAction } = useApprovePartner()
const { suspendPartner: suspendAction } = useSuspendPartner()
const { openConfirm } = useConfirm()

const page = ref(1)
const limit = ref(10)
const search = ref('')
const statusFilter = ref('')

const totalPages = computed(() => Math.ceil(total.value / limit.value))

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; handleFetch() }, 400)
}

function handleFetch() {
  fetchPartners({
    page: page.value,
    limit: limit.value,
    search: search.value || undefined,
    status: statusFilter.value || undefined
  })
}

async function handleApprove(p: any) {
  if (await openConfirm({
    title: 'Approve Partner',
    message: `Are you sure you want to approve "${p.fullName}"? This will send them an LPO Financing Agreement notification email.`,
    confirmText: 'Approve',
    confirmClass: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20',
    icon: 'lucide:check-circle'
  })) {
    const success = await approveAction(p._id)
    if (success) handleFetch()
  }
}

async function handleSuspend(p: any) {
  if (await openConfirm({
    title: 'Suspend Partner',
    message: `Are you sure you want to suspend "${p.fullName}"?`,
    confirmText: 'Suspend',
    confirmClass: 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20',
    icon: 'lucide:ban'
  })) {
    const success = await suspendAction(p._id, 'suspension')
    if (success) handleFetch()
  }
}

onMounted(handleFetch)
</script>
