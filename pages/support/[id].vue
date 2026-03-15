<template>
  <div class="space-y-8 pb-20">
    <definePageMeta :layout="'dashboard'" />

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-6">
        <button @click="navigateTo('/support')" class="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#033958] transition-all">
          <Icon name="lucide:arrow-left" class="w-6 h-6" />
        </button>
        <div>
          <div class="flex items-center gap-3">
             <h1 class="text-3xl font-bold text-gray-900 tracking-tight">{{ ticket?.ticketNumber }}</h1>
             <span :class="['px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border', getPriorityClass(ticket?.priority)]">
                {{ ticket?.priority }}
             </span>
          </div>
          <p class="text-gray-500 font-medium">{{ ticket?.subject }}</p>
        </div>
      </div>
      <div>
        <SelectInput 
          v-model="ticket.status" 
          label="Ticket Status"
          :options="[
            { label: 'Open', value: 'open' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Resolved', value: 'resolved' },
            { label: 'Closed', value: 'closed' }
          ]"
          @update:modelValue="updateStatus"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Chat Context -->
      <div class="lg:col-span-2 space-y-6">
        <!-- AI Summary Card -->
        <div v-if="ticket?.aiSummary" class="p-8 bg-emerald-50 rounded-[3rem] border border-emerald-100 flex items-start gap-6">
          <div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-600/10">
            <Icon name="lucide:sparkles" class="w-7 h-7" />
          </div>
          <div>
            <h4 class="text-xs font-black text-emerald-800 uppercase tracking-widest mb-1">AI Intelligence Summary</h4>
            <p class="text-emerald-900 font-medium leading-relaxed">{{ ticket.aiSummary }}</p>
          </div>
        </div>

        <!-- Conversation Board -->
        <div class="bg-white rounded-[3rem] border border-gray-50 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div class="p-8 border-b border-gray-50 bg-gray-50/30">
            <h3 class="font-black text-gray-900 uppercase tracking-tight text-sm">Case Conversation</h3>
          </div>
          <div class="flex-1 overflow-y-auto p-8 space-y-6" ref="commentList">
            <!-- Original Description -->
            <div class="flex justify-start">
               <div class="max-w-[80%] bg-gray-50 p-6 rounded-[2.5rem] rounded-tl-none border border-gray-100">
                  <p class="text-gray-800 font-medium leading-relaxed">{{ ticket?.description }}</p>
                  <p class="text-[10px] font-bold text-gray-400 uppercase mt-4">{{ ticket?.customerId?.fullName }} • Initial Query</p>
               </div>
            </div>

            <!-- Comments -->
            <div 
              v-for="c in ticket?.comments" 
              :key="c.createdAt"
              :class="['flex', c.senderId?._id === userId ? 'justify-end' : 'justify-start']"
            >
               <div :class="['max-w-[80%] p-6 rounded-[2.5rem] border', c.senderId?._id === userId ? 'bg-[#033958] text-white border-[#033958] rounded-tr-none shadow-xl shadow-[#033958]/20' : 'bg-white border-gray-100 rounded-tl-none']">
                  <p class="font-medium leading-relaxed">{{ c.message }}</p>
                  <p :class="['text-[10px] font-bold uppercase mt-4', c.senderId?._id === userId ? 'text-white/60' : 'text-gray-400']">
                    {{ c.senderId?.fullName || 'Staff' }} • {{ formatDate(c.createdAt) }}
                  </p>
               </div>
            </div>
          </div>
          <!-- Action Bar -->
          <div class="p-8 border-t border-gray-50 bg-gray-50/50 flex gap-4 items-center">
            <input 
              v-model="newComment" 
              @keyup.enter="postComment"
              placeholder="Type your response to the customer..."
              class="flex-1 bg-white border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-[#033958]/10 outline-none transition-all shadow-sm"
            />
            <button 
              @click="postComment"
              :disabled="!newComment.trim() || posting"
              class="w-14 h-14 rounded-2xl bg-[#033958] text-white flex items-center justify-center transition-all shadow-2xl shadow-[#033958]/20 active:scale-90"
            >
              <Icon name="lucide:send-horizontal" class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Info Sidebar -->
      <div class="space-y-6">
        <div class="bg-white p-8 rounded-[3rem] border border-gray-50 shadow-sm space-y-8">
           <div>
              <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Customer Details</h4>
              <div class="flex items-center gap-4">
                 <div class="w-12 h-12 rounded-2xl bg-[#033958]/5 flex items-center justify-center text-[#033958]">
                    <Icon name="lucide:user" class="w-6 h-6" />
                 </div>
                 <div>
                    <p class="font-black text-gray-900 leading-none mb-1">{{ ticket?.customerId?.fullName }}</p>
                    <p class="text-xs font-bold text-gray-400">{{ ticket?.customerId?.email }}</p>
                 </div>
              </div>
           </div>
           
           <div class="pt-8 border-t border-gray-50">
              <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">AI Triage</h4>
              <div class="space-y-4">
                 <div class="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                    <span class="text-xs font-black text-gray-400 uppercase tracking-widest">Category</span>
                    <span class="text-xs font-black text-[#033958] uppercase tracking-widest">{{ ticket?.category }}</span>
                 </div>
                 <div class="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                    <span class="text-xs font-black text-gray-400 uppercase tracking-widest">Assigned Team</span>
                    <span class="text-xs font-black text-[#033958] uppercase tracking-widest">{{ ticket?.assignedTeam || 'Global Support' }}</span>
                 </div>
              </div>
           </div>

           <div class="pt-8 border-t border-gray-50">
              <button class="w-full py-4 rounded-2xl bg-red-50 text-red-600 font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Report Malicious Account</button>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SelectInput from '@/components/core/SelectInput.vue'
import { support_api } from '@/api_factory/modules/support'
// Re-importing common auth patterns found in WiseKings
const user = useCookie('wk_admin_user') // Often WiseKings stores user in cookie
const userId = computed(() => (user.value as any)?._id || (user.value as any)?.id)
const route = useRoute()

const ticket = ref<any>({ comments: [] })
const loading = ref(false)
const newComment = ref('')
const posting = ref(false)

async function fetchTicket() {
  loading.value = true
  try {
    const res = await support_api.getTicket(route.params.id as string)
    ticket.value = res?.data || {}
  } finally {
    loading.value = false
  }
}

async function postComment() {
  if (!newComment.value.trim() || posting.value) return
  posting.value = true
  try {
    await support_api.addComment(ticket.value._id, newComment.value)
    newComment.value = ''
    await fetchTicket()
  } finally {
    posting.value = false
  }
}

async function updateStatus() {
  try {
    await support_api.updateStatus(ticket.value._id, ticket.value.status)
  } catch (e) {
    console.error(e)
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getPriorityClass(p: string) {
  if (p === 'urgent') return 'bg-red-500 text-white border-transparent'
  if (p === 'high') return 'bg-orange-500 text-white border-transparent'
  return 'bg-[#033958] text-white border-transparent'
}

definePageMeta({
  layout: 'dashboard'
})

onMounted(fetchTicket)
</script>
