<template>
  <div>
    <definePageMeta :layout="'dashboard'" />

    <!-- Header & Navigation -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <div class="flex items-center gap-4">
        <NuxtLink 
          to="/partners" 
          class="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 shadow-sm transition-all"
        >
          <Icon name="lucide:arrow-left" class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-black text-gray-900 tracking-tight">Partner Profile</h1>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-xs text-gray-500 font-medium uppercase tracking-widest">Corporate Partner</span>
            <span class="w-1 h-1 rounded-full bg-gray-300"></span>
            <code class="text-[10px] font-mono font-black text-indigo-600 uppercase">{{ partner?.partnerCode }}</code>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button 
          v-if="partner?.status === 'pending'" 
          @click="handleApprove" 
          class="h-11 px-6 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
        >
          <Icon name="lucide:check-circle" class="w-4 h-4" /> Approve Partner
        </button>
        <button 
          v-if="partner?.status === 'active'" 
          @click="handleSuspend" 
          class="h-11 px-6 flex items-center justify-center gap-2 rounded-xl bg-rose-50 text-rose-600 font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm"
        >
          <Icon name="lucide:ban" class="w-4 h-4" /> Suspend
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
      <Icon name="lucide:loader-2" class="w-10 h-10 animate-spin text-[#033958]/20" />
      <p class="mt-4 text-sm font-bold text-gray-400">Loading partner profile...</p>
    </div>

    <template v-else-if="partner">
      <!-- Tab Navigation -->
      <div class="flex items-center gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm w-fit">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2',
            activeTab === tab.id 
              ? 'bg-[#033958] text-white shadow-lg shadow-[#033958]/20' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          ]"
        >
          <Icon :name="tab.icon" class="w-4 h-4" />
          {{ tab.name }}
          <span v-if="tab.id === 'kyc' && pendingKycCount > 0" class="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Main Content Area -->
        <div class="lg:col-span-8">
          <TransitionGroup name="fade" mode="out-in">
            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'" key="overview" class="space-y-8">
              <!-- Stats Cards -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div class="absolute right-[-10%] bottom-[-10%] opacity-[0.03] group-hover:scale-110 transition-transform duration-700 text-[#033958]">
                    <Icon name="lucide:trending-up" class="w-40 h-40" />
                  </div>
                  <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Total Sales value</span>
                  <div class="flex items-baseline gap-1">
                    <span class="text-sm font-black text-gray-400">₦</span>
                    <p class="text-4xl font-black text-gray-900 tracking-tight leading-none">
                      {{ (partner.totalSalesValue || 0).toLocaleString() }}
                    </p>
                  </div>
                </div>
                
                <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div class="absolute right-[-10%] bottom-[-10%] opacity-[0.03] group-hover:scale-110 transition-transform duration-700 text-indigo-600">
                    <Icon name="lucide:users" class="w-40 h-40" />
                  </div>
                  <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Referral Count</span>
                  <p class="text-4xl font-black text-indigo-600 tracking-tight leading-none">
                    {{ partner.totalOrdersReferred || 0 }}
                  </p>
                </div>
              </div>

              <!-- Referral Link -->
              <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Icon name="lucide:link" class="w-5 h-5" />
                    </div>
                    <h3 class="text-lg font-black text-gray-900 tracking-tight">Referral Link</h3>
                  </div>
                  <button @click="copyLink" class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/10">
                    Copy Link
                  </button>
                </div>
                <div class="relative">
                  <input 
                    :value="partner.referralLink" 
                    readonly 
                    class="w-full bg-gray-50 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-600 pr-12 focus:ring-0" 
                  />
                </div>
              </div>

              <!-- Company Details -->
              <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                <h3 class="text-lg font-black text-gray-900 tracking-tight mb-8">Company Summary</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <div class="space-y-4">
                    <div class="flex flex-col">
                      <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Company Name</span>
                      <span class="text-base font-bold text-gray-800">{{ partner.companyName }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Person</span>
                      <span class="text-base font-bold text-gray-800">{{ partner.contactPerson }}</span>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div class="flex flex-col">
                      <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</span>
                      <span class="text-base font-bold text-gray-800">{{ partner.email }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</span>
                      <span class="text-base font-bold text-gray-800">{{ partner.phone || '—' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- KYC Documents Tab -->
            <div v-else-if="activeTab === 'kyc'" key="kyc" class="space-y-6">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <h3 class="text-xl font-black text-gray-900 tracking-tight">KYC Verification</h3>
                  <p class="text-gray-500 text-sm font-medium">Review and verify submitted corporate documents.</p>
                </div>
                <div class="flex items-center gap-3">
                  <div class="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100">
                    {{ pendingKycCount }} Pending
                  </div>
                </div>
              </div>

              <div v-if="!partner.kyc?.documents?.length" class="bg-white rounded-[2.5rem] p-12 border border-dashed border-gray-200 flex flex-col items-center text-center">
                <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
                  <Icon name="lucide:file-question" class="w-8 h-8" />
                </div>
                <h4 class="text-lg font-black text-gray-900">No Documents Found</h4>
                <p class="text-gray-500 text-sm font-medium mt-1">This partner has not been assigned any KYC requirements yet.</p>
              </div>

              <div v-else class="grid grid-cols-1 gap-4">
                <div 
                  v-for="doc in partner.kyc.documents" 
                  :key="doc._id"
                  class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center gap-6"
                >
                  <div class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#033958] shrink-0">
                    <Icon :name="getDocIcon(doc.documentType)" class="w-6 h-6" />
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h4 class="font-black text-gray-900 truncate">{{ doc.documentLabel }}</h4>
                      <span v-if="doc.isRequired" class="px-2 py-0.5 bg-red-50 text-red-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-red-100 shrink-0">Required</span>
                    </div>
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <span v-if="doc.idNumber">ID: <span class="text-gray-700 tracking-normal">{{ doc.idNumber }}</span></span>
                      <span v-if="doc.submittedAt" class="flex items-center gap-1">
                        <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                        Submitted {{ formatDate(doc.submittedAt) }}
                      </span>
                    </p>
                  </div>

                  <div class="flex items-center gap-4">
                    <div class="text-right">
                      <span :class="[
                        'px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border',
                        getBadgeClasses(doc.status)
                      ]">
                        {{ doc.status }}
                      </span>
                    </div>

                    <div class="flex items-center gap-2">
                      <button 
                        v-if="doc.documentUrl" 
                        @click="openDocPreview(doc)"
                        class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-[#033958] hover:bg-gray-100 transition-all"
                        title="View Document"
                      >
                        <Icon name="lucide:eye" class="w-5 h-5" />
                      </button>
                      
                      <template v-if="doc.status === 'pending'">
                        <button 
                          @click="updateDocStatus(doc, 'approved')"
                          class="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          title="Approve"
                        >
                          <Icon name="lucide:check" class="w-5 h-5" />
                        </button>
                        <button 
                          @click="updateDocStatus(doc, 'rejected')"
                          class="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          title="Reject"
                        >
                          <Icon name="lucide:x" class="w-5 h-5" />
                        </button>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Activity Tab -->
            <div v-else-if="activeTab === 'activity'" key="activity" class="space-y-6 text-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
              <Icon name="lucide:activity" class="w-12 h-12 mx-auto text-gray-200 mb-4" />
              <h4 class="text-lg font-black text-gray-900">No Activity Yet</h4>
              <p class="text-gray-500 text-sm font-medium">Activity logs for this partner will appear here.</p>
            </div>

            <!-- Settlement Tab -->
            <div v-else-if="activeTab === 'settlement'" key="settlement" class="space-y-8">
              <div v-if="partner.bankAccountDetails" class="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                <div class="flex items-center gap-4 mb-10">
                  <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <Icon name="lucide:landmark" class="w-7 h-7" />
                  </div>
                  <div>
                    <h3 class="text-xl font-black text-gray-900 tracking-tight">Payout Details</h3>
                    <p class="text-gray-500 text-sm font-medium uppercase tracking-widest mt-0.5">Configured Settlement Method</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div class="p-8 bg-gray-100 rounded-[2rem] flex flex-col justify-center">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Bank Institution</p>
                    <p class="text-2xl font-black text-[#033958] leading-tight">
                      {{ partner.bankAccountDetails.bankName }}
                    </p>
                  </div>

                  <div class="space-y-6">
                    <div class="bg-white p-6 rounded-2xl border border-gray-50">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Name</p>
                      <p class="text-lg font-bold text-gray-900 italic tracking-tight">{{ partner.bankAccountDetails.accountName }}</p>
                    </div>
                    <div class="bg-white p-6 rounded-2xl border border-gray-50">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Number</p>
                      <p class="text-2xl font-black text-indigo-600 tracking-[0.2em] font-mono">{{ partner.bankAccountDetails.accountNumber }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="bg-white rounded-[2.5rem] p-12 border border-dashed border-gray-200 flex flex-col items-center text-center">
                <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
                  <Icon name="lucide:credit-card" class="w-8 h-8" />
                </div>
                <h4 class="text-lg font-black text-gray-900">No Settlement Link</h4>
                <p class="text-gray-500 text-sm font-medium mt-1">This partner has not added their payout account yet.</p>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Sidebar Column -->
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
            <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Partner Status</h4>
            
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-500">Account status</span>
                <span :class="[
                  'px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border',
                  partner.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  partner.status === 'suspended' ? 'bg-red-50 text-red-600 border-red-100' : 
                  'bg-amber-50 text-amber-600 border-amber-100'
                ]">
                  {{ partner.status }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-500">KYC Status</span>
                <span :class="[
                  'px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border',
                  overallKycStatus === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  overallKycStatus === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                  'bg-gray-50 text-gray-400 border-gray-100'
                ]">
                  {{ overallKycStatus }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-500">Commission Rate</span>
                <span class="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-lg border border-indigo-100">
                  {{ partner.commissionRate }}%
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-500">Partner Tier</span>
                <span class="px-2.5 py-1 bg-gray-50 text-gray-700 text-xs font-black rounded-lg border border-gray-100 uppercase tracking-widest">
                  {{ partner.tier || 'Standard' }}
                </span>
              </div>
            </div>

            <div v-if="partner.status === 'suspended' && partner.suspensionReason" class="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100">
              <p class="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Suspension Reason</p>
              <p class="text-sm font-medium text-red-700 leading-tight">{{ partner.suspensionReason }}</p>
            </div>
          </div>

          <div class="bg-[#033958] rounded-[2.5rem] p-8 shadow-xl shadow-[#033958]/20 relative overflow-hidden text-white">
            <Icon name="lucide:shield" class="absolute right-[-10%] top-[-10%] w-32 h-32 opacity-10" />
            <h4 class="text-sm font-black uppercase tracking-[0.2em] mb-2 opacity-60">Engagement Info</h4>
            <div class="space-y-6 mt-8 relative z-10">
              <div>
                <p class="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Member Since</p>
                <p class="text-base font-bold">{{ formatDate(partner.createdAt) }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Last Updated</p>
                <p class="text-base font-bold">{{ formatDate(partner.updatedAt) }}</p>
              </div>
              <div class="pt-4 flex items-center gap-3">
                <div class="w-1 h-1 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></div>
                <p class="text-[10px] font-black uppercase tracking-widest">Profile synchronized</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- KYC Document Modal -->
    <CoreKycDocumentModal 
      :show="showDocModal" 
      :document="selectedDoc" 
      @close="showDocModal = false"
      @approve="handleModalApprove"
      @reject="handleModalReject"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { partners_api } from '@/api_factory/modules/partners'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useConfirm } from '@/composables/core/useConfirm'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { showToast } = useCustomToast()
const { openConfirm } = useConfirm()

const partner = ref<any>(null)
const loading = ref(true)
const activeTab = ref('overview')

// Modal State
const showDocModal = ref(false)
const selectedDoc = ref<any>(null)

function openDocPreview(doc: any) {
  selectedDoc.value = doc
  showDocModal.value = true
}

async function handleModalApprove(doc: any) {
  showDocModal.value = false
  await updateDocStatus(doc, 'approved')
}

async function handleModalReject(doc: any) {
  showDocModal.value = false
  await updateDocStatus(doc, 'rejected')
}

const tabs = [
  { id: 'overview', name: 'Overview', icon: 'lucide:layout-grid' },
  { id: 'kyc', name: 'KYC Documents', icon: 'lucide:shield-check' },
  { id: 'activity', name: 'Activity', icon: 'lucide:activity' },
  { id: 'settlement', name: 'Settlement', icon: 'lucide:landmark' }
]

const pendingKycCount = computed(() => {
  if (!partner.value?.kyc?.documents) return 0
  return partner.value.kyc.documents.filter((d: any) => d.status === 'pending').length
})

const overallKycStatus = computed(() => {
  if (!partner.value?.kyc?.documents?.length) return 'not_submitted'
  const docs = partner.value.kyc.documents
  if (docs.every((d: any) => d.status === 'approved')) return 'approved'
  if (docs.some((d: any) => d.status === 'pending')) return 'pending'
  if (docs.some((d: any) => d.status === 'rejected')) return 'rejected'
  return 'not_submitted'
})

async function fetchPartner() {
  loading.value = true
  try {
    const res = await partners_api.getById(route.params.id as string)
    partner.value = res.data || res
  } catch (err: any) {
    showToast({ title: 'Error', message: 'Partner not found', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

async function handleApprove() { 
  if (await openConfirm({
    title: 'Approve Partner',
    message: 'Are you sure you want to approve this partner? This will give them full access to the platform.',
    confirmText: 'Approve',
    confirmClass: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20',
    icon: 'lucide:check-circle'
  })) {
    try { 
      await partners_api.approve(partner.value!._id)
      showToast({ title: 'Success', message: 'Partner approved successfully', toastType: 'success' })
      fetchPartner()
    } catch { 
      showToast({ title: 'Error', message: 'Failed to approve', toastType: 'error' }) 
    } 
  }
}

async function handleSuspend() { 
  if (await openConfirm({
    title: 'Suspend Partner',
    message: 'Are you sure you want to suspend this partner account?',
    confirmText: 'Suspend',
    confirmClass: 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20',
    icon: 'lucide:ban'
  })) {
    const reason = prompt('Reason for suspension:')
    if (!reason) return
    try { 
      await partners_api.suspend(partner.value!._id, { reason })
      showToast({ title: 'Suspended', message: 'Partner account suspended', toastType: 'warning' })
      fetchPartner()
    } catch { 
      showToast({ title: 'Error', message: 'Failed to suspend', toastType: 'error' }) 
    } 
  }
}

async function updateDocStatus(doc: any, status: 'approved' | 'rejected') {
  let reason = ''
  if (status === 'rejected') {
    reason = prompt('Reason for rejection:') || ''
    if (!reason) return
  }

  const title = status === 'approved' ? 'Approve Document' : 'Reject Document'
  const message = `Are you sure you want to ${status} "${doc.documentLabel}"?`
  
  if (await openConfirm({
    title,
    message,
    confirmText: status.charAt(0).toUpperCase() + status.slice(1),
    confirmClass: status === 'approved' ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 'bg-rose-600 text-white shadow-rose-600/20',
    icon: status === 'approved' ? 'lucide:check-circle' : 'lucide:alert-circle'
  })) {
    try {
      await partners_api.updateKycDocumentStatus(partner.value._id, {
        documentType: doc.documentType,
        status,
        reason: reason || undefined
      })
      showToast({ title: 'Success', message: `Document ${status} successfully`, toastType: 'success' })
      fetchPartner()
    } catch (err: any) {
      showToast({ title: 'Error', message: err.message || 'Failed to update status', toastType: 'error' })
    }
  }
}

function copyLink() {
  if (partner.value?.referralLink) {
    navigator.clipboard.writeText(partner.value.referralLink)
    showToast({ title: 'Copied', message: 'Referral link copied to clipboard', toastType: 'success' })
  }
}

function getDocIcon(type: string) {
  if (type.includes('id') || type.includes('passport') || type.includes('license') || type.includes('pvc')) return 'lucide:id-card'
  if (type.includes('cac') || type.includes('cert') || type.includes('tin')) return 'lucide:building-2'
  if (type.includes('address') || type.includes('bill')) return 'lucide:home'
  return 'lucide:file-text'
}

function getBadgeClasses(status: string) {
  if (status === 'approved') return 'bg-emerald-50 text-emerald-600 border-emerald-100'
  if (status === 'pending') return 'bg-amber-50 text-amber-600 border-amber-100'
  if (status === 'rejected') return 'bg-rose-50 text-rose-600 border-rose-100'
  return 'bg-gray-50 text-gray-400 border-gray-100'
}

function formatDate(date: any) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(fetchPartner)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
