<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Partners</h1>
        <p class="text-dark-400 text-sm mt-1">Manage investor partnerships</p>
      </div>
    </div>
    <div class="card mb-6">
      <div class="flex flex-wrap gap-3">
        <input v-model="search" type="text" placeholder="Search partners..." class="input max-w-xs" @input="debouncedFetch" />
        <select v-model="statusFilter" class="input max-w-[160px]" @change="handleFetch">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
    </div>
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr><th>Company</th><th>Contact</th><th>Code</th><th>Commission</th><th>Sales</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr v-if="loading"><td colspan="7" class="text-center py-12 text-dark-400"><Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto" /></td></tr>
          <tr v-else-if="partners.length === 0"><td colspan="7" class="text-center py-12 text-dark-400">No partners found</td></tr>
          <tr v-for="p in partners" :key="p._id" v-else>
            <td><p class="font-medium text-white">{{ p.companyName }}</p><p class="text-xs text-dark-400">{{ p.email }}</p></td>
            <td class="text-dark-200">{{ p.contactPerson }}</td>
            <td><code class="text-xs bg-dark-800 px-2 py-0.5 rounded">{{ p.partnerCode }}</code></td>
            <td>{{ p.commissionRate }}%</td>
            <td>₦{{ (p.totalSalesValue || 0).toLocaleString() }}</td>
            <td><span :class="p.status === 'active' ? 'badge-success' : p.status === 'suspended' ? 'badge-danger' : 'badge-warning'">{{ p.status }}</span></td>
            <td>
              <div class="flex items-center gap-2">
                <NuxtLink :to="`/partners/${p._id}`" class="btn-ghost btn-sm"><Icon name="lucide:eye" class="w-3.5 h-3.5" /></NuxtLink>
                <button v-if="p.status === 'pending'" @click="handleApprove(p)" class="btn-ghost btn-sm text-emerald-400"><Icon name="lucide:check" class="w-3.5 h-3.5" /></button>
                <button v-if="p.status === 'active'" @click="handleSuspend(p)" class="btn-ghost btn-sm text-red-400"><Icon name="lucide:ban" class="w-3.5 h-3.5" /></button>
              </div>
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
import type { Partner } from '~/types'
import { useFetchPartners } from '@/composables/modules/partners/useFetchPartners'
import { useApprovePartner } from '@/composables/modules/partners/useApprovePartner'
import { useSuspendPartner } from '@/composables/modules/partners/useSuspendPartner'

definePageMeta({ layout: 'dashboard' })

const { partners, loading, total, fetchPartners } = useFetchPartners()
const { approvePartner: approveAction } = useApprovePartner()
const { suspendPartner: suspendAction } = useSuspendPartner()

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

async function handleApprove(p: Partner) {
  const success = await approveAction(p._id)
  if (success) handleFetch()
}

async function handleSuspend(p: Partner) {
  const reason = prompt('Reason for suspension:')
  if (!reason) return
  const success = await suspendAction(p._id, reason)
  if (success) handleFetch()
}

onMounted(handleFetch)
</script>
