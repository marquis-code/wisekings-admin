<template>
  <div>
    <definePageMeta :layout="'dashboard'" />

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Guest Inquiries</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Manage messages and inquiries from storefront visitors</p>
      </div>
      <div class="flex gap-3">
        <div class="px-5 py-2.5 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-2">
          <Icon name="lucide:message-square" class="w-4 h-4 text-indigo-600" />
          <span class="text-xs font-black text-indigo-700 uppercase tracking-widest">{{ total }} Total Inquiries</span>
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
          placeholder="Search by name, email or message..." 
          class="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-600/10 transition-all font-medium" 
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
            { label: 'Pending', value: 'pending' },
            { label: 'Processed', value: 'processed' },
            { label: 'Archived', value: 'archived' }
          ]"
          @update:modelValue="handleFetch"
        />
        <button @click="handleFetch" class="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-600/5 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">
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
              <th class="!py-5 !pl-6">Visitor Details</th>
              <th class="!py-5">Subject</th>
              <th class="!py-5">Message Snippet</th>
              <th class="!py-5">Status</th>
              <th class="!py-5">Date</th>
              <th class="!py-5 !pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="!p-0">
                <CoreSkeletonLoader :rows="5" />
              </td>
            </tr>
            <tr v-else-if="inquiries.length === 0">
              <td colspan="6" class="!py-10">
                <CoreEmptyState 
                  icon="lucide:mail-open" 
                  title="No inquiries found" 
                  description="Guest messages from the contact form will appear here."
                />
              </td>
            </tr>
            <tr v-for="i in inquiries" :key="i._id" v-else class="group">
              <td class="!py-4 !pl-6">
                <div>
                  <p class="font-bold text-gray-900 text-sm leading-tight">{{ i.name }}</p>
                  <p class="text-[10px] font-medium text-gray-400 mt-0.5 tracking-tight uppercase">{{ i.email }}</p>
                </div>
              </td>
              <td class="!py-4 text-sm font-semibold text-gray-700">
                {{ i.subject }}
              </td>
              <td class="!py-4 text-sm text-gray-500 max-w-xs truncate">
                {{ i.message }}
              </td>
              <td class="!py-4">
                <span :class="[
                  'px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border',
                  i.status === 'processed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  i.status === 'archived' ? 'bg-gray-50 text-gray-600 border-gray-100' : 
                  'bg-amber-50 text-amber-600 border-amber-100'
                ]">
                  {{ i.status }}
                </span>
              </td>
              <td class="!py-4 text-xs font-medium text-gray-400">
                {{ new Date(i.createdAt).toLocaleDateString() }}
              </td>
              <td class="!py-4 !pr-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="viewInquiry(i)" 
                    class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                    title="View Message"
                  >
                    <Icon name="lucide:eye" class="w-4 h-4" />
                  </button>
                  <button 
                    v-if="i.status === 'pending'" 
                    @click="handleUpdateStatus(i, 'processed')" 
                    class="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-300"
                    title="Mark as Processed"
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

    <!-- Modal for viewing inquiry details -->
    <div v-if="selectedInquiry" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/40 backdrop-blur-sm">
        <div class="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in">
            <div class="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h3 class="text-xl font-black text-gray-900 uppercase tracking-tight">Inquiry Detail</h3>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">{{ selectedInquiry.subject }}</p>
                </div>
                <button @click="selectedInquiry = null" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors shadow-sm">
                    <Icon name="lucide:x" size="20" />
                </button>
            </div>
            <div class="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
                <div class="grid grid-cols-2 gap-8">
                    <div>
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">From</p>
                        <p class="text-sm font-bold text-gray-900">{{ selectedInquiry.name }}</p>
                    </div>
                    <div>
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Channel</p>
                        <p class="text-sm font-bold text-gray-900">{{ selectedInquiry.email }}</p>
                    </div>
                </div>
                <div>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Intel/Message Content</p>
                    <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-sm text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                        {{ selectedInquiry.message }}
                    </div>
                </div>
            </div>
            <div class="p-8 bg-gray-50/50 border-t border-gray-50 flex justify-end gap-3">
                <button 
                    @click="handleUpdateStatus(selectedInquiry, 'archived'); selectedInquiry = null" 
                    class="px-6 py-3 bg-white text-gray-500 border border-gray-100 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-sm"
                >
                    Archive
                </button>
                <button 
                  v-if="selectedInquiry.status !== 'processed'"
                  @click="handleUpdateStatus(selectedInquiry, 'processed'); selectedInquiry = null" 
                  class="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10"
                >
                    Mark Processed
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SelectInput from '@/components/core/SelectInput.vue'
import { useFetchInquiries } from '@/composables/modules/inquiries/useFetchInquiries'
import { useUpdateInquiryStatus } from '@/composables/modules/inquiries/useUpdateInquiryStatus'
import { useConfirm } from '@/composables/core/useConfirm'

definePageMeta({ layout: 'dashboard' })

const { inquiries, loading, total, fetchInquiries } = useFetchInquiries()
const { updateStatus } = useUpdateInquiryStatus()
const { openConfirm } = useConfirm()

const statusFilter = ref('')
const search = ref('')
const selectedInquiry = ref<any>(null)

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { handleFetch() }, 400)
}

function handleFetch() {
  fetchInquiries({
    search: search.value || undefined,
    status: statusFilter.value || undefined,
  })
}

function viewInquiry(i: any) {
    selectedInquiry.value = i
}

async function handleUpdateStatus(i: any, status: string) {
  if (await openConfirm({
    title: 'Update Inquiry Status',
    message: `Mark this inquiry as "${status}"?`,
    confirmText: 'Confirm',
    confirmClass: status === 'processed' ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-white',
    icon: status === 'processed' ? 'lucide:check-circle' : 'lucide:archive'
  })) {
    const success = await updateStatus(i._id, status)
    if (success) handleFetch()
  }
}

onMounted(handleFetch)
</script>
