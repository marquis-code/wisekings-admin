<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="mb-6"><h1 class="text-2xl font-bold text-white">Withdrawal Requests</h1><p class="text-dark-400 text-sm mt-1">Approve, reject, or process payouts</p></div>
    <div class="card mb-6"><div class="flex flex-wrap gap-3">
      <select v-model="statusFilter" class="input max-w-[160px]" @change="handleFetch"><option value="">All</option><option v-for="s in ['pending','approved','processing','paid','rejected']" :key="s" :value="s">{{ s }}</option></select>
    </div></div>
    <div class="table-container">
      <table class="data-table">
        <thead><tr><th>Requested By</th><th>Amount</th><th>Bank</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-if="loading"><td colspan="6" class="text-center py-12 text-dark-400"><Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto" /></td></tr>
          <tr v-else-if="items.length === 0"><td colspan="6" class="text-center py-12 text-dark-400">No withdrawals found</td></tr>
          <tr v-for="w in items" :key="w._id" v-else>
            <td class="text-dark-200 text-sm">{{ w.requestedBy }}</td>
            <td class="font-medium text-white">₦{{ w.amount.toLocaleString() }}</td>
            <td class="text-dark-300 text-sm">{{ w.bankDetails?.bankName || '—' }}</td>
            <td><span :class="getStatusBadgeClass(w.status)">{{ w.status }}</span></td>
            <td class="text-dark-400 text-xs">{{ new Date(w.createdAt).toLocaleDateString() }}</td>
            <td>
              <div class="flex gap-1">
                <button v-if="w.status === 'pending'" @click="handleApprove(w)" class="btn-ghost btn-sm text-emerald-400" title="Approve"><Icon name="lucide:check" class="w-3.5 h-3.5" /></button>
                <button v-if="w.status === 'pending'" @click="handleReject(w)" class="btn-ghost btn-sm text-red-400" title="Reject"><Icon name="lucide:x" class="w-3.5 h-3.5" /></button>
                <button v-if="w.status === 'approved'" @click="handleMarkPaid(w)" class="btn-ghost btn-sm text-blue-400" title="Mark Paid"><Icon name="lucide:banknote" class="w-3.5 h-3.5" /></button>
              </div>
            </td>
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
import type { Withdrawal } from '~/types'
import { useFetchWithdrawals } from '@/composables/modules/wallets/useFetchWithdrawals'
import { useApproveWithdrawal } from '@/composables/modules/wallets/useApproveWithdrawal'
import { useRejectWithdrawal } from '@/composables/modules/wallets/useRejectWithdrawal'
import { useMarkPaidWithdrawal } from '@/composables/modules/wallets/useMarkPaidWithdrawal'

definePageMeta({ layout: 'dashboard' })

const { items, loading, total, fetchWithdrawals } = useFetchWithdrawals()
const { approveWithdrawal: approveAction } = useApproveWithdrawal()
const { rejectWithdrawal: rejectAction } = useRejectWithdrawal()
const { markPaid: paidAction } = useMarkPaidWithdrawal()

const page = ref(1)
const statusFilter = ref('')
const totalPages = computed(() => Math.ceil(total.value / 10))

function handleFetch() {
  fetchWithdrawals({
    page: page.value,
    limit: 10,
    status: statusFilter.value || undefined
  })
}

function getStatusBadgeClass(status: string) {
  switch (status?.toLowerCase()) {
    case 'approved': return 'badge-info'
    case 'paid': return 'badge-success'
    case 'pending': return 'badge-warning'
    case 'processing': return 'badge-info'
    case 'rejected': return 'badge-danger'
    default: return 'badge-neutral'
  }
}

async function handleApprove(w: Withdrawal) {
  if (confirm('Approve this withdrawal?')) {
    const success = await approveAction(w._id)
    if (success) handleFetch()
  }
}

async function handleReject(w: Withdrawal) {
  const reason = prompt('Reason for rejection:')
  if (!reason) return
  const success = await rejectAction(w._id, { reason })
  if (success) handleFetch()
}

async function handleMarkPaid(w: Withdrawal) {
  const reference = prompt('Payment reference:')
  if (!reference) return
  const success = await paidAction(w._id, { reference })
  if (success) handleFetch()
}

onMounted(handleFetch)
</script>
