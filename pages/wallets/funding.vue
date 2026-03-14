<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight">Wallet Funding</h1>
        <p class="text-sm text-gray-400 font-medium mt-1">Review and verify direct transfer deposit requests</p>
      </div>
      
      <div class="flex items-center gap-3">
        <button @click="fetchTransactions" class="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
          <Icon name="lucide:refresh-cw" :class="['w-5 h-5', loading ? 'animate-spin' : '']" />
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
       <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div class="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-6">
             <Icon name="lucide:clock" class="w-6 h-6" />
          </div>
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Requests</p>
          <h3 class="text-2xl font-black text-gray-900">{{ transactions.filter(t => t.status === 'pending').length }}</h3>
       </div>
    </div>

    <!-- Transactions Table -->
    <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50">
              <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">User / Date</th>
              <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
              <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type / Method</th>
              <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Proof</th>
              <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="t in transactions" :key="t._id" class="hover:bg-gray-50/30 transition-all group">
              <td class="px-8 py-6">
                 <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs uppercase">
                       {{ t.userId?.fullName?.charAt(0) || 'U' }}
                    </div>
                    <div>
                       <p class="text-sm font-black text-gray-900">{{ t.userId?.fullName || 'Anonymous' }}</p>
                       <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{{ new Date(t.createdAt).toLocaleString() }}</p>
                    </div>
                 </div>
              </td>
              <td class="px-8 py-6">
                <p class="text-sm font-black text-gray-900">₦{{ t.amount.toLocaleString() }}</p>
              </td>
              <td class="px-8 py-6">
                 <div class="flex flex-col gap-1">
                    <span class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 w-fit">{{ t.type }}</span>
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Direct Transfer</span>
                 </div>
              </td>
              <td class="px-8 py-6">
                 <button v-if="t.paymentProof" @click="openProof(t.paymentProof)" class="flex items-center gap-2 text-[10px] font-black text-[#033958] uppercase tracking-widest hover:underline bg-[#033958]/5 px-3 py-1.5 rounded-xl border border-[#033958]/10">
                    <Icon name="lucide:image" class="w-4 h-4" />
                    View Receipt
                 </button>
                 <span v-else class="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No Proof</span>
              </td>
              <td class="px-8 py-6 text-right">
                 <div v-if="t.status === 'pending'" class="flex items-center justify-end gap-2">
                    <button @click="handleVerify(t._id, 'failed')" class="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all border border-rose-100" title="Reject">
                       <Icon name="lucide:x" class="w-5 h-5" />
                    </button>
                    <button @click="handleVerify(t._id, 'completed')" class="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all border border-emerald-100" title="Verify">
                       <Icon name="lucide:check" class="w-5 h-5" />
                    </button>
                 </div>
                 <span v-else :class="['px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border', 
                   t.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                 ]">
                   {{ t.status }}
                 </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="transactions.length === 0 && !loading" class="flex flex-col items-center justify-center py-32 opacity-30">
        <Icon name="lucide:inbox" class="w-16 h-16 mb-4" />
        <p class="text-sm font-black uppercase tracking-[0.2em]">No funding requests found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { wallets_api } from '@/api_factory/modules/wallets'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { showToast } = useCustomToast()
const transactions = ref([])
const loading = ref(false)

async function fetchTransactions() {
  loading.value = true
  try {
    const res = await wallets_api.getTransactions({ type: 'deposit' }) as any
    transactions.value = res.data?.data || res.data || []
  } catch (e) {
    showToast({ title: 'Error', message: 'Failed to load transactions', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

async function handleVerify(id: string, status: 'completed' | 'failed') {
  try {
    await wallets_api.verifyFunding(id, { status })
    showToast({ title: 'Success', message: `Transaction marked as ${status}`, toastType: 'success' })
    fetchTransactions()
  } catch (e) {
    showToast({ title: 'Error', message: 'Failed to verify transaction', toastType: 'error' })
  }
}

function openProof(url: string) {
  window.open(url, '_blank')
}

onMounted(fetchTransactions)
</script>
