<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/partners" class="btn-ghost btn-sm"><Icon name="lucide:arrow-left" class="w-4 h-4" /></NuxtLink>
      <h1 class="text-2xl font-bold text-white">Partner Details</h1>
    </div>
    <div v-if="loading" class="text-center py-20"><Icon name="lucide:loader-2" class="w-8 h-8 animate-spin mx-auto text-dark-400" /></div>
    <div v-else-if="partner" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="card">
        <div class="text-center">
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">{{ partner.companyName?.[0] || '?' }}</div>
          <h2 class="text-xl font-bold text-white">{{ partner.companyName }}</h2>
          <p class="text-dark-400 text-sm">{{ partner.contactPerson }}</p>
          <code class="text-xs bg-dark-800 px-2 py-0.5 rounded mt-2 inline-block">{{ partner.partnerCode }}</code>
          <div class="mt-3"><span :class="partner.status === 'active' ? 'badge-success' : partner.status === 'suspended' ? 'badge-danger' : 'badge-warning'">{{ partner.status }}</span></div>
        </div>
        <div class="mt-6 space-y-3 border-t border-dark-700 pt-4">
          <div class="flex justify-between text-sm"><span class="text-dark-400">Email</span><span class="text-dark-200">{{ partner.email }}</span></div>
          <div class="flex justify-between text-sm"><span class="text-dark-400">Phone</span><span class="text-dark-200">{{ partner.phone || '—' }}</span></div>
          <div class="flex justify-between text-sm"><span class="text-dark-400">Commission</span><span class="text-dark-200">{{ partner.commissionRate }}%</span></div>
          <div class="flex justify-between text-sm"><span class="text-dark-400">Joined</span><span class="text-dark-200">{{ new Date(partner.createdAt).toLocaleDateString() }}</span></div>
        </div>
        <div class="mt-6 flex gap-2">
          <button v-if="partner.status === 'pending'" @click="handleApprove" class="btn-primary btn-sm flex-1"><Icon name="lucide:check" class="w-4 h-4" /> Approve</button>
          <button v-if="partner.status === 'active'" @click="handleSuspend" class="btn-danger btn-sm flex-1"><Icon name="lucide:ban" class="w-4 h-4" /> Suspend</button>
        </div>
      </div>
      <div class="lg:col-span-2 space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="stat-card"><span class="text-dark-400 text-sm">Total Sales</span><p class="text-xl font-bold text-white">₦{{ (partner.totalSalesValue || 0).toLocaleString() }}</p></div>
          <div class="stat-card"><span class="text-dark-400 text-sm">Orders Referred</span><p class="text-xl font-bold text-white">{{ partner.totalOrdersReferred || 0 }}</p></div>
        </div>
        <div class="card"><h3 class="text-lg font-semibold text-white mb-3">Referral Link</h3><div class="flex items-center gap-2"><input :value="partner.referralLink" readonly class="input flex-1" /><button @click="copyLink" class="btn-secondary btn-sm"><Icon name="lucide:copy" class="w-4 h-4" /></button></div></div>
        <div v-if="partner.bankAccountDetails" class="card">
          <h3 class="text-lg font-semibold text-white mb-3">Bank Details</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between"><span class="text-dark-400">Bank</span><span class="text-dark-200">{{ partner.bankAccountDetails.bankName }}</span></div>
            <div class="flex justify-between"><span class="text-dark-400">Account</span><span class="text-dark-200">{{ partner.bankAccountDetails.accountNumber }}</span></div>
            <div class="flex justify-between"><span class="text-dark-400">Name</span><span class="text-dark-200">{{ partner.bankAccountDetails.accountName }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Partner } from '~/types'
definePageMeta({ layout: 'dashboard' })
const route = useRoute(); const api = usePartnersApi(); const toast = useToast()
const partner = ref<Partner | null>(null); const loading = ref(true)

async function fetchPartner() { loading.value = true; try { partner.value = (await api.findById(route.params.id as string)) as any } catch { toast.error('Not found') } finally { loading.value = false } }
async function handleApprove() { try { await api.approve(partner.value!._id); toast.success('Approved'); fetchPartner() } catch { toast.error('Failed') } }
async function handleSuspend() { const r = prompt('Reason:'); if (!r) return; try { await api.suspend(partner.value!._id, r); toast.success('Suspended'); fetchPartner() } catch { toast.error('Failed') } }
function copyLink() { if (partner.value?.referralLink) { navigator.clipboard.writeText(partner.value.referralLink); toast.success('Copied') } }
onMounted(fetchPartner)
</script>
