<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">KYC Review</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Verify individual documents for merchants and partners</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex gap-2 bg-gray-100 p-1 rounded-2xl w-fit">
          <button 
            @click="activeKycStatus = 'pending'" 
            :class="['px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', activeKycStatus === 'pending' ? 'bg-[#033958] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700']"
          >Pending</button>
          <button 
            @click="activeKycStatus = 'approved'" 
            :class="['px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', activeKycStatus === 'approved' ? 'bg-[#033958] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700']"
          >Approved</button>
          <button 
            @click="activeKycStatus = 'rejected'" 
            :class="['px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', activeKycStatus === 'rejected' ? 'bg-[#033958] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700']"
          >Rejected</button>
          <button 
            @click="activeKycStatus = 'submitted'" 
            :class="['px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', activeKycStatus === 'submitted' ? 'bg-[#033958] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700']"
          >All</button>
        </div>
        <div class="flex gap-2 bg-gray-100 p-1 rounded-2xl w-fit">
          <button 
            @click="userType = 'merchants'" 
            :class="['px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', userType === 'merchants' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
          >Merchants</button>
          <button 
            @click="userType = 'partners'" 
            :class="['px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', userType === 'partners' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
          >Partners</button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-container bg-white shadow-sm border-gray-100 overflow-hidden !rounded-3xl">
      <table class="data-table">
        <thead>
          <tr class="!bg-gray-50/50">
            <th class="!py-5 !pl-6">User Details</th>
            <th class="!py-5">Document</th>
            <th class="!py-5">ID Number</th>
            <th class="!py-5">Submitted At</th>
            <th class="!py-5">Status</th>
            <th class="!py-5 !pr-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading"><td colspan="6" class="!py-10 text-center text-gray-400">Loading kyc data...</td></tr>
          <tr v-else-if="items.length === 0"><td colspan="6" class="!py-10 text-center text-gray-400">No documents found matching the criteria.</td></tr>
          <tr v-for="(item, idx) in items" :key="idx" class="group">
            <td class="!py-4 !pl-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-gray-600 border">{{ (item.user.fullName || item.user.contactPerson || 'U').charAt(0) }}</div>
                <div>
                   <p class="font-bold text-gray-900 text-sm">{{ item.user.fullName || item.user.contactPerson }}</p>
                   <p class="text-[10px] text-gray-400 font-medium">{{ item.user.email }}</p>
                </div>
              </div>
            </td>
            <td class="!py-4">
              <p class="text-[11px] font-black text-gray-700 uppercase tracking-wider">{{ item.doc.documentLabel }}</p>
              <p class="text-[10px] text-gray-400 font-medium">{{ item.doc.documentType }}</p>
            </td>
            <td class="!py-4 text-xs font-black text-gray-700">{{ item.doc.idNumber }}</td>
            <td class="!py-4 text-[10px] text-gray-400">{{ formatDate(item.doc.submittedAt) }}</td>
            <td class="!py-4">
              <span :class="[
                'px-2.5 py-0.5 rounded-xl text-[10px] font-black uppercase tracking-widest border',
                getBadgeClasses(item.doc.status)
              ]">{{ item.doc.status }}</span>
            </td>
            <td class="!py-4 !pr-6 text-right">
              <div class="flex items-center justify-end gap-2">
                <button @click="viewDoc(item)" title="View Document" class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-[#033958] hover:text-white transition-all"><Icon name="lucide:eye" class="w-4 h-4" /></button>
                <button v-if="item.doc.status === 'pending'" @click="handleStatusUpdate(item, 'approved')" title="Approve" class="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"><Icon name="lucide:check" class="w-4 h-4" /></button>
                <button v-if="item.doc.status === 'pending'" @click="handleStatusUpdate(item, 'rejected')" title="Reject" class="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"><Icon name="lucide:x" class="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Doc Preview Modal -->
    <Teleport to="body">
      <div v-if="previewItem" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="previewItem = null"></div>
        <div class="relative bg-white rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl animate-modal-in">
          <div class="p-8 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 class="text-xl font-black text-gray-900 uppercase tracking-widest">Document Preview</h2>
              <p class="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">{{ previewItem.doc.documentLabel }} - {{ previewItem.user.fullName || previewItem.user.contactPerson }}</p>
            </div>
            <button @click="previewItem = null" class="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"><Icon name="lucide:x" /></button>
          </div>
          <div class="p-10 bg-gray-50 flex justify-center min-h-[500px]">
            <template v-if="previewItem.doc.documentUrl">
              <img v-if="isFileImage(previewItem.doc.documentUrl)" :src="previewItem.doc.documentUrl" class="max-w-full max-h-[60vh] rounded-2xl shadow-lg border border-gray-200 object-contain" />
              <div v-else class="flex flex-col items-center justify-center bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 w-full max-w-md">
                <Icon name="lucide:file-text" class="w-20 h-20 text-red-500 mb-6" />
                <p class="text-lg font-black text-gray-900 text-center mb-2">{{ getFileName(previewItem.doc.documentUrl) }}</p>
                <p class="text-gray-500 font-medium text-center mb-8">This is a document file (PDF/DOC) and cannot be previewed directly.</p>
                <a :href="previewItem.doc.documentUrl" target="_blank" class="px-8 py-4 bg-[#033958] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-[#033958]/20 flex items-center gap-3">
                  Download Document
                  <Icon name="lucide:download" class="w-4 h-4" />
                </a>
              </div>
            </template>
            <div v-else class="flex items-center justify-center text-gray-400 font-black uppercase">No URL provided</div>
          </div>
          <div class="p-8 bg-white border-t border-gray-100 flex justify-end gap-4">
               <button v-if="previewItem.doc.status === 'pending'" @click="handleStatusUpdate(previewItem, 'rejected')" class="px-8 py-4 rounded-2xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all uppercase tracking-widest text-xs">Reject Document</button>
               <button v-if="previewItem.doc.status === 'pending'" @click="handleStatusUpdate(previewItem, 'approved')" class="px-8 py-4 rounded-2xl bg-[#033958] text-white font-bold hover:bg-[#022f42] transition-all uppercase tracking-widest text-xs">Verify & Approve</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { merchants_api } from '@/api_factory/modules/merchants'
import { partners_api } from '@/api_factory/modules/partners'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({ layout: 'dashboard' })

const { showToast } = useCustomToast()
const userType = ref<'merchants' | 'partners'>('merchants')
const activeKycStatus = ref<'pending' | 'approved' | 'rejected' | 'submitted'>('pending')
const loading = ref(true)
const items = ref<any[]>([]) // Flat list of documents
const previewItem = ref<any>(null)

async function fetchKyc() {
  loading.value = true
  items.value = []
  try {
    const api = userType.value === 'merchants' ? merchants_api : partners_api
    const res = await api.get({ 
        kycStatus: activeKycStatus.value,
        limit: 100 // Fetch more to ensure we see them all
    })
    const users = res.data || []
    
    const flatDocs: any[] = []
    users.forEach((user: any) => {
      const documents = user.kyc?.documents || []
      documents.forEach((doc: any) => {
        // Filter by active status
        const matchesStatus = activeKycStatus.value === 'submitted' 
            ? doc.status !== 'not_submitted'
            : doc.status === activeKycStatus.value

        if (matchesStatus) {
          flatDocs.push({
             user: {
               _id: user._id,
               fullName: user.fullName || user.contactPerson || user.userId?.fullName || 'Unknown',
               email: user.email || user.userId?.email || 'N/A',
             },
             doc: doc
          })
        }
      })
    })

    // Sort: Pending first, then by date desc
    items.value = flatDocs.sort((a, b) => {
      if (a.doc.status === 'pending' && b.doc.status !== 'pending') return -1
      if (a.doc.status !== 'pending' && b.doc.status === 'pending') return 1
      return new Date(b.doc.submittedAt || 0).getTime() - new Date(a.doc.submittedAt || 0).getTime()
    })

  } catch (e) {
    console.error('Error fetching KYC:', e)
  }
  loading.value = false
}

function viewDoc(item: any) {
  previewItem.value = item
}

async function handleStatusUpdate(item: any, status: 'approved' | 'rejected') {
  let reason = ''
  if (status === 'rejected') {
    reason = prompt('Reason for rejection:') || 'Document unclear or invalid.'
    if (reason === null) return // Cancelled
  }
  
  try {
    const api = userType.value === 'merchants' ? merchants_api : partners_api
    await api.updateKycDocumentStatus(item.user._id, { 
      documentType: item.doc.documentType, 
      status, 
      reason 
    })
    
    showToast({ title: 'Success', message: `Document ${status} successfully`, toastType: 'success' })
    previewItem.value = null
    fetchKyc()
  } catch (e: any) {
    showToast({ title: 'Error', message: e.message || 'Action failed', toastType: 'error' })
  }
}

function getBadgeClasses(status: string) {
  if (status === 'approved') return 'bg-emerald-50 text-emerald-600 border-emerald-100'
  if (status === 'rejected') return 'bg-red-50 text-red-600 border-red-100'
  if (status === 'pending') return 'bg-amber-50 text-amber-600 border-amber-100'
  return 'bg-gray-50 text-gray-500 border-gray-100'
}

function formatDate(date: any) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function isFileImage(url: string) {
  if (!url) return false
  return url.match(/\.(jpeg|jpg|gif|png|webp)/i) != null
}

function getFileName(url: string) {
  if (!url) return ''
  return url.split('/').pop() || 'document'
}

watch([userType, activeKycStatus], fetchKyc)
onMounted(fetchKyc)
</script>

<style scoped>
.animate-modal-in { animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
</style>
