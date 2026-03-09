<template>
  <div>
    <definePageMeta :layout="'dashboard'" />

    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/merchants" class="btn-ghost btn-sm">
        <Icon name="lucide:arrow-left" class="w-4 h-4" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-white">Merchant Details</h1>
    </div>

    <div v-if="loading" class="text-center py-20 text-dark-400">
      <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin mx-auto" />
    </div>

    <div v-else-if="merchant" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile -->
      <div class="card lg:col-span-1">
        <div class="text-center">
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {{ merchant.fullName?.[0] || '?' }}
          </div>
          <h2 class="text-xl font-bold text-white">{{ merchant.fullName }}</h2>
          <p class="text-dark-400 text-sm">{{ merchant.email }}</p>
          <code class="text-xs bg-dark-800 px-2 py-0.5 rounded mt-2 inline-block">{{ merchant.merchantCode }}</code>
          <div class="mt-3">
            <span :class="merchant.status === 'active' ? 'badge-success' : merchant.status === 'suspended' ? 'badge-danger' : 'badge-warning'">
              {{ merchant.status }}
            </span>
          </div>
        </div>

        <div class="mt-6 space-y-3 border-t border-dark-700 pt-4">
          <div class="flex justify-between text-sm">
            <span class="text-dark-400">Phone</span>
            <span class="text-dark-200">{{ merchant.phone || '—' }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-dark-400">Category</span>
            <span class="badge-info capitalize">{{ merchant.category }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-dark-400">Rank</span>
            <span class="badge-neutral capitalize">{{ merchant.rank }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-dark-400">Commission</span>
            <span class="text-dark-200">{{ merchant.commissionRate }}%</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-dark-400">Joined</span>
            <span class="text-dark-200">{{ new Date(merchant.createdAt).toLocaleDateString() }}</span>
          </div>
        </div>

        <div class="mt-6 flex gap-2">
          <button v-if="merchant.status === 'active'" @click="handleSuspend" class="btn-danger btn-sm flex-1">
            <Icon name="lucide:ban" class="w-4 h-4" /> Suspend
          </button>
          <button v-if="merchant.status === 'suspended'" @click="handleActivate" class="btn-primary btn-sm flex-1">
            <Icon name="lucide:check-circle" class="w-4 h-4" /> Activate
          </button>
        </div>
      </div>

      <!-- Stats & Details -->
      <div class="lg:col-span-2 space-y-6">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div class="stat-card">
            <span class="text-dark-400 text-sm">Total Sales</span>
            <p class="text-xl font-bold text-white">₦{{ (merchant.totalSalesValue || 0).toLocaleString() }}</p>
          </div>
          <div class="stat-card">
            <span class="text-dark-400 text-sm">Monthly Sales</span>
            <p class="text-xl font-bold text-white">₦{{ (merchant.monthlySalesValue || 0).toLocaleString() }}</p>
          </div>
          <div class="stat-card">
            <span class="text-dark-400 text-sm">Orders Referred</span>
            <p class="text-xl font-bold text-white">{{ merchant.totalOrdersReferred || 0 }}</p>
          </div>
        </div>

        <!-- Referral Link -->
        <div class="card">
          <h3 class="text-lg font-semibold text-white mb-3">Referral Link</h3>
          <div class="flex items-center gap-2">
            <input :value="merchant.referralLink" readonly class="input flex-1" />
            <button @click="copyLink" class="btn-secondary btn-sm">
              <Icon name="lucide:copy" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Bank Details -->
        <div v-if="merchant.bankAccountDetails" class="card">
          <h3 class="text-lg font-semibold text-white mb-3">Bank Details</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-dark-400">Bank</span>
              <span class="text-dark-200">{{ merchant.bankAccountDetails.bankName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-dark-400">Account Name</span>
              <span class="text-dark-200">{{ merchant.bankAccountDetails.accountName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-dark-400">Account Number</span>
              <span class="text-dark-200">{{ merchant.bankAccountDetails.accountNumber }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Merchant } from '~/types'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const api = useMerchantsApi()
const toast = useToast()

const merchant = ref<Merchant | null>(null)
const loading = ref(true)

async function fetchMerchant() {
  loading.value = true
  try {
    const res = await api.findById(route.params.id as string)
    merchant.value = res as any
  } catch { toast.error('Failed to load merchant') }
  finally { loading.value = false }
}

async function handleSuspend() {
  const reason = prompt('Reason for suspension:')
  if (!reason) return
  try {
    await api.suspend(merchant.value!._id, reason)
    toast.success('Merchant suspended')
    fetchMerchant()
  } catch { toast.error('Failed to suspend') }
}

async function handleActivate() {
  try {
    await api.activate(merchant.value!._id)
    toast.success('Merchant activated')
    fetchMerchant()
  } catch { toast.error('Failed to activate') }
}

function copyLink() {
  if (merchant.value?.referralLink) {
    navigator.clipboard.writeText(merchant.value.referralLink)
    toast.success('Copied to clipboard')
  }
}

onMounted(fetchMerchant)
</script>
