<template>
  <div class="space-y-8">
    <definePageMeta :layout="'dashboard'" />

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Support Center</h1>
        <p class="text-gray-500 font-medium">Manage customer complaints and AI-prioritized tickets.</p>
      </div>
      <div class="flex gap-4">
        <div class="flex bg-white border border-gray-100 p-1 rounded-2xl shadow-sm">
          <button 
            v-for="status in ['all', 'open', 'resolved']" 
            :key="status"
            @click="activeStatus = status"
            :class="['px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all', activeStatus === status ? 'bg-[#033958] text-white shadow-xl shadow-[#033958]/20' : 'text-gray-400 hover:text-gray-600']"
          >
            {{ status }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tickets Table -->
    <div class="table-container bg-white shadow-sm border-gray-100 overflow-hidden !rounded-[3rem]">
      <table class="data-table">
        <thead>
          <tr class="!bg-gray-50/50">
            <th class="!py-5 !pl-10">Ticket</th>
            <th class="!py-5">Customer</th>
            <th class="!py-5">Category</th>
            <th class="!py-5">Priority</th>
            <th class="!py-5">Status</th>
            <th class="!py-5 !pr-10 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading"><td colspan="6" class="!py-20 text-center text-gray-400">Loading tickets...</td></tr>
          <tr v-else-if="tickets.length === 0">
            <td colspan="6" class="!py-20 text-center">
              <div class="flex flex-col items-center gap-4 opacity-30">
                <Icon name="lucide:smile-plus" class="w-16 h-16" />
                <p class="font-black uppercase tracking-widest text-xs">No active complaints. Excellent!</p>
              </div>
            </td>
          </tr>
          <tr v-for="t in filteredTickets" :key="t._id" class="group">
            <td class="!py-6 !pl-10">
              <div>
                <p class="text-[10px] font-black text-[#033958] uppercase tracking-[0.2em] mb-1">{{ t.ticketNumber }}</p>
                <p class="font-bold text-gray-900 group-hover:text-[#033958] transition-colors line-clamp-1 truncate max-w-xs">{{ t.subject }}</p>
              </div>
            </td>
            <td class="!py-6">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                  <Icon name="lucide:user" class="w-4 h-4 text-gray-400" />
                </div>
                <span class="font-bold text-gray-700 text-sm">{{ t.customerId?.fullName || 'Anonymous' }}</span>
              </div>
            </td>
            <td class="!py-6">
              <span class="text-xs font-black text-[#033958] uppercase tracking-widest">{{ t.category || 'Classifying...' }}</span>
            </td>
            <td class="!py-6">
              <div :class="['inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border', getPriorityClass(t.priority)]">
                {{ t.priority || 'Analyzing' }}
              </div>
            </td>
            <td class="!py-6">
              <div class="flex items-center gap-2">
                <div :class="['w-2 h-2 rounded-full', t.status === 'open' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400']"></div>
                <span class="text-xs font-bold text-gray-600 capitalize">{{ t.status.replace('_', ' ') }}</span>
              </div>
            </td>
            <td class="!py-6 !pr-10 text-right">
              <button @click="openTicket(t)" class="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-[#033958] hover:text-white transition-all flex items-center justify-center ml-auto">
                <Icon name="lucide:chevron-right" class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- AI Ticket Insight Callout -->
    <div class="p-8 bg-gradient-to-r from-[#033958] to-[#044c75] rounded-[3rem] text-white flex items-center justify-between shadow-2xl shadow-[#033958]/20 overflow-hidden relative group">
      <div class="relative z-10 flex items-center gap-8">
        <div class="w-20 h-20 rounded-[2rem] bg-white/10 flex items-center justify-center backdrop-blur-xl ring-1 ring-white/20">
          <Icon name="lucide:zap" class="w-10 h-10 text-amber-300" />
        </div>
        <div>
          <h3 class="text-2xl font-black uppercase tracking-tight">AI Smart-Route Active</h3>
          <p class="text-white/70 font-medium">WiseKings AI is automatically grouping tickets by sentiment and technical impact.</p>
        </div>
      </div>
      <Icon name="lucide:brain" class="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 rotate-12 transition-transform group-hover:scale-110" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { support_api } from '@/api_factory/modules/support'

const tickets = ref<any[]>([])
const loading = ref(false)
const activeStatus = ref('all')

async function fetchTickets() {
  loading.value = true
  try {
    const res = await support_api.getTickets()
    tickets.value = res?.data?.data || res?.data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const filteredTickets = computed(() => {
  if (activeStatus.value === 'all') return tickets.value
  return tickets.value.filter(t => t.status === activeStatus.value)
})

function getPriorityClass(priority: string) {
  switch (priority?.toLowerCase()) {
    case 'urgent': return 'bg-red-50 text-red-600 border-red-100'
    case 'high': return 'bg-orange-50 text-orange-600 border-orange-100'
    case 'medium': return 'bg-amber-50 text-amber-600 border-amber-100'
    default: return 'bg-gray-50 text-gray-500 border-gray-100'
  }
}

function openTicket(t: any) {
  // Logic to navigate to ticket details or open modal
  navigateTo(`/support/${t._id}`)
}

definePageMeta({
  layout: 'dashboard'
})

onMounted(fetchTickets)
</script>
