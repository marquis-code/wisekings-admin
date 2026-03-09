<template>
  <div>
    <definePageMeta :layout="'dashboard'" />

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Merchants</h1>
        <p class="text-dark-400 text-sm mt-1">Manage all merchants on the platform</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex flex-wrap gap-3">
        <input v-model="search" type="text" placeholder="Search merchants..." class="input max-w-xs" @input="debouncedFetch" />
        <select v-model="statusFilter" class="input max-w-[160px]" @change="handleFetch">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
        <select v-model="categoryFilter" class="input max-w-[160px]" @change="handleFetch">
          <option value="">All Categories</option>
          <option value="standard">Standard</option>
          <option value="gold">Gold</option>
          <option value="premium">Premium</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Merchant</th>
            <th>Code</th>
            <th>Category</th>
            <th>Rank</th>
            <th>Commission</th>
            <th>Sales</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="8" class="text-center py-12 text-dark-400">
              <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading merchants...
            </td>
          </tr>
          <tr v-else-if="merchants.length === 0">
            <td colspan="8" class="text-center py-12 text-dark-400">
              <Icon name="lucide:store" class="w-8 h-8 mx-auto mb-2 opacity-50" />
              No merchants found
            </td>
          </tr>
          <tr v-for="m in merchants" :key="m._id" v-else>
            <td>
              <div>
                <p class="font-medium text-white">{{ m.fullName }}</p>
                <p class="text-xs text-dark-400">{{ m.email }}</p>
              </div>
            </td>
            <td><code class="text-xs bg-dark-800 px-2 py-0.5 rounded">{{ m.merchantCode }}</code></td>
            <td><span class="badge-info capitalize">{{ m.category }}</span></td>
            <td><span class="badge-neutral capitalize">{{ m.rank }}</span></td>
            <td>{{ m.commissionRate }}%</td>
            <td>₦{{ (m.totalSalesValue || 0).toLocaleString() }}</td>
            <td>
              <span :class="m.status === 'active' ? 'badge-success' : m.status === 'suspended' ? 'badge-danger' : 'badge-warning'">
                {{ m.status }}
              </span>
            </td>
            <td>
              <div class="flex items-center gap-2">
                <NuxtLink :to="`/merchants/${m._id}`" class="btn-ghost btn-sm">
                  <Icon name="lucide:eye" class="w-3.5 h-3.5" />
                </NuxtLink>
                <button v-if="m.status === 'active'" @click="handleSuspend(m)" class="btn-ghost btn-sm text-red-400">
                  <Icon name="lucide:ban" class="w-3.5 h-3.5" />
                </button>
                <button v-if="m.status === 'suspended'" @click="handleActivate(m)" class="btn-ghost btn-sm text-emerald-400">
                  <Icon name="lucide:check-circle" class="w-3.5 h-3.5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-4">
      <p class="text-sm text-dark-400">Page {{ page }} of {{ totalPages }} ({{ total }} total)</p>
      <div class="flex gap-2">
        <button @click="page--; handleFetch()" :disabled="page <= 1" class="btn-secondary btn-sm">Previous</button>
        <button @click="page++; handleFetch()" :disabled="page >= totalPages" class="btn-secondary btn-sm">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Merchant } from '~/types'
import { useFetchMerchants } from '@/composables/modules/merchants/useFetchMerchants'
import { useSuspendMerchant } from '@/composables/modules/merchants/useSuspendMerchant'
import { useActivateMerchant } from '@/composables/modules/merchants/useActivateMerchant'

definePageMeta({ layout: 'dashboard' })

const { merchants, loading, total, fetchMerchants } = useFetchMerchants()
const { suspendMerchant: suspendAction } = useSuspendMerchant()
const { activateMerchant: activateAction } = useActivateMerchant()

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
  if (confirm(`Suspend Merchant "${m.fullName}"?`)) {
    const success = await suspendAction(m._id)
    if (success) handleFetch()
  }
}

async function handleActivate(m: Merchant) {
  const success = await activateAction(m._id)
  if (success) handleFetch()
}

onMounted(handleFetch)
</script>
