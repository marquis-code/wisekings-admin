<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Withdrawals</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Review and process merchant payout requests</p>
      </div>
      <div class="flex gap-3">
        <div class="px-5 py-2.5 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-2">
          <Icon name="lucide:arrow-up-right" class="w-4 h-4 text-indigo-600" />
          <span class="text-xs font-black text-indigo-700 uppercase tracking-widest">Payout Management</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-center">
      <div class="flex flex-wrap gap-3">
        <SelectInput 
          v-model="statusFilter" 
          label="Filter by Status"
          width="240px"
          :options="[
            { label: 'All Request Statuses', value: '' },
            { label: 'Pending', value: 'pending' },
            { label: 'Approved', value: 'approved' },
            { label: 'Processing', value: 'processing' },
            { label: 'Paid', value: 'paid' },
            { label: 'Rejected', value: 'rejected' }
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
              <th class="!py-5 !pl-6">Requested By</th>
              <th class="!py-5">Amount</th>
              <th class="!py-5">Bank Details</th>
              <th class="!py-5 text-center">Current Status</th>
              <th class="!py-5">Request Date</th>
              <th class="!py-5 !pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="!p-0">
                <CoreSkeletonLoader :rows="5" />
              </td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="6" class="!py-10">
                <CoreEmptyState 
                  icon="lucide:wallet" 
                  title="No withdrawals found" 
                  description="Pending merchant payout requests will be listed here for approval."
                />
              </td>
            </tr>
            <tr v-for="w in items" :key="w._id" v-else class="hover:bg-gray-50/50 transition-colors">
              <td class="!py-4 !pl-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Icon name="lucide:user" class="w-4 h-4" />
                  </div>
                  <span class="text-sm font-bold text-gray-900">{{ w.requestedBy }}</span>
                </div>
              </td>
              <td class="!py-4">
                <span class="font-black text-gray-900">₦{{ w.amount.toLocaleString() }}</span>
              </td>
              <td class="!py-4">
                <div class="text-sm font-bold text-gray-700 leading-tight">{{ w.bankDetails?.bankName || '—' }}</div>
                <div class="text-[10px] text-gray-400 font-medium uppercase mt-0.5">{{ w.bankDetails?.accountNumber || '—' }}</div>
              </td>
              <td class="!py-4 text-center">
                <span :class="[
                  'px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border',
                  w.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  w.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 
                  w.status === 'approved' || w.status === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                  'bg-amber-50 text-amber-600 border-amber-100'
                ]">
                  {{ w.status }}
                </span>
              </td>
              <td class="!py-4">
                <span class="text-xs font-bold text-gray-500">{{ new Date(w.createdAt).toLocaleDateString() }}</span>
              </td>
              <td class="!py-4 !pr-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button v-if="w.status === 'pending'" @click="handleApprove(w)" class="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Approve Request">
                    <Icon name="lucide:check" class="w-4 h-4" />
                  </button>
                  <button v-if="w.status === 'pending'" @click="handleReject(w)" class="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Reject Request">
                    <Icon name="lucide:x" class="w-4 h-4" />
                  </button>
                  <button v-if="w.status === 'approved'" @click="handleMarkPaid(w)" class="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Confirm Payment">
                    <Icon name="lucide:banknote" class="w-4 h-4" />
                  </button>
                  <div v-if="w.status === 'paid'" class="text-[10px] font-black text-emerald-500 uppercase italic">Completed</div>
                </div>
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
import type { Withdrawal } from '~/types'
import SelectInput from '@/components/core/SelectInput.vue'
import { useFetchWithdrawals } from '@/composables/modules/wallets/useFetchWithdrawals'
import { useApproveWithdrawal } from '@/composables/modules/wallets/useApproveWithdrawal'
import { useRejectWithdrawal } from '@/composables/modules/wallets/useRejectWithdrawal'
import { useMarkPaidWithdrawal } from '@/composables/modules/wallets/useMarkPaidWithdrawal'
import { useConfirm } from '@/composables/core/useConfirm'

definePageMeta({ layout: 'dashboard' })

const { items, loading, total, fetchWithdrawals } = useFetchWithdrawals()
const { approveWithdrawal: approveAction } = useApproveWithdrawal()
const { rejectWithdrawal: rejectAction } = useRejectWithdrawal()
const { markAsPaid: paidAction } = useMarkPaidWithdrawal()
const { openConfirm } = useConfirm()

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
  if (await openConfirm({
    title: 'Approve Withdrawal',
    message: `Are you sure you want to approve the withdrawal of ₦${w.amount.toLocaleString()}?`,
    confirmText: 'Approve',
    confirmClass: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20',
    icon: 'lucide:check-circle'
  })) {
    const success = await approveAction(w._id)
    if (success) handleFetch()
  }
}

async function handleReject(w: Withdrawal) {
  if (await openConfirm({
    title: 'Reject Withdrawal',
    message: `Are you sure you want to reject the withdrawal of ₦${w.amount.toLocaleString()}?`,
    confirmText: 'Reject',
    confirmClass: 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20',
    icon: 'lucide:alert-circle'
  })) {
    const reason = prompt('Reason for rejection:')
    if (!reason) return
    const success = await rejectAction(w._id, reason)
    if (success) handleFetch()
  }
}

async function handleMarkPaid(w: Withdrawal) {
  if (await openConfirm({
    title: 'Mark as Paid',
    message: `Confirm that payment of ₦${w.amount.toLocaleString()} has been sent?`,
    confirmText: 'Mark Paid',
    confirmClass: 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20',
    icon: 'lucide:banknote'
  })) {
    const reference = prompt('Payment reference:')
    if (!reference) return
    const success = await paidAction(w._id, reference)
    if (success) handleFetch()
  }
}

onMounted(handleFetch)
</script>
