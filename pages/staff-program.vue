<template>
  <div class="space-y-8 md:space-y-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="space-y-1">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full mb-2">
          <Icon name="lucide:award" class="text-amber-500" size="14" />
          <span class="text-[10px] font-black uppercase tracking-widest text-amber-700">SSP Dashboard</span>
        </div>
        <h1 class="text-3xl font-black text-[#033958] tracking-tight">Staff Support Program</h1>
        <p class="text-sm font-medium text-[#033958]/60 max-w-xl">Track staff referral conversions, your personal sales contribution, commission earnings, and view the monthly leaderboard.</p>
      </div>

      <button @click="copyReferralLink" class="inline-flex items-center gap-2 bg-[#033958] hover:bg-gray-900 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#033958]/20 group">
        <Icon name="lucide:share-2" class="group-hover:rotate-12 transition-transform duration-300" />
        Copy Referral Link
      </button>
    </div>

    <!-- Quick Stats Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Sales Generated -->
      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
        <div class="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
        <div class="relative z-10">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
            <Icon name="lucide:trending-up" size="20" />
          </div>
          <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Sales</p>
          <p class="text-2xl font-black text-[#033958]">₦{{ stats.totalSales.toLocaleString() }}</p>
        </div>
      </div>
  
      <!-- Total Orders -->
      <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
        <div class="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
        <div class="relative z-10">
          <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
            <Icon name="lucide:shopping-bag" size="20" />
          </div>
          <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Orders Converted</p>
          <p class="text-2xl font-black text-[#033958]">{{ stats.totalOrders }}</p>
        </div>
      </div>

      <!-- Commission Earned -->
      <div class="bg-[#033958] p-6 rounded-3xl shadow-lg shadow-[#033958]/20 relative overflow-hidden group">
        <div class="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
        <div class="relative z-10">
          <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white mb-4">
            <Icon name="lucide:wallet" size="20" />
          </div>
          <p class="text-xs font-black text-white/60 uppercase tracking-widest mb-1">Commission Earned</p>
          <p class="text-2xl font-black text-white">₦{{ stats.commissionEarned.toLocaleString() }}</p>
        </div>
      </div>

      <!-- Leaderboard Rank -->
      <div class="bg-amber-400 p-6 rounded-3xl shadow-lg shadow-amber-200/40 relative overflow-hidden group">
        <div class="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
        <div class="relative z-10">
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-[#033958] mb-4">
            <Icon name="lucide:trophy" size="20" />
          </div>
          <p class="text-xs font-black text-[#033958]/60 uppercase tracking-widest mb-1">Your Rank</p>
          <p class="text-2xl font-black text-[#033958]">{{ myRank > 0 ? `#${myRank}` : '—' }}</p>
        </div>
      </div>
    </div>

    <!-- Referral Link Card -->
    <div class="bg-gradient-to-br from-[#033958] to-gray-900 p-8 rounded-[32px] relative overflow-hidden">
      <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl"></div>
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-2">
          <p class="text-xs font-black text-white/50 uppercase tracking-widest">Your Referral Link</p>
          <p class="text-lg font-bold text-white/90 break-all">{{ referralLink }}</p>
          <p class="text-xs text-white/40">Share this link with friends and family. When they purchase, you earn commission automatically.</p>
        </div>
        <button @click="copyReferralLink" class="shrink-0 bg-amber-400 hover:bg-amber-300 text-[#033958] px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2">
          <Icon name="lucide:copy" size="16" />
          {{ copied ? 'Copied!' : 'Copy Link' }}
        </button>
      </div>
    </div>

    <!-- Leaderboard -->
    <div class="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
      <div class="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
            <Icon name="lucide:trophy" size="20" />
          </div>
          <div>
            <h2 class="text-base font-black text-[#033958] tracking-tight uppercase">Monthly Leaderboard</h2>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ currentMonthName }} {{ currentYear }}</p>
          </div>
        </div>
      </div>

      <div class="p-6 md:p-8">
        <div v-if="loadingLeaderboard" class="space-y-4">
          <div v-for="i in 5" :key="i" class="h-16 bg-gray-50 rounded-2xl animate-pulse"></div>
        </div>

        <div v-else-if="leaderboard.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-4">
            <Icon name="lucide:bar-chart" size="28" />
          </div>
          <p class="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">No Data Yet</p>
          <p class="text-xs text-gray-400">Start sharing your referral link to appear on the leaderboard.</p>
        </div>
        
        <div v-else class="space-y-3">
          <div
            v-for="(entry, index) in leaderboard"
            :key="entry._id"
            class="flex items-center gap-4 p-4 rounded-2xl border transition-all"
            :class="[
              index === 0 ? 'bg-amber-50/50 border-amber-200' :
              index === 1 ? 'bg-gray-50/50 border-gray-200' :
              index === 2 ? 'bg-orange-50/30 border-orange-100' :
              'bg-white border-gray-100 hover:border-gray-200'
            ]"
          >
            <!-- Rank Medallion -->
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
              :class="[
                index === 0 ? 'bg-amber-400 text-white shadow-lg shadow-amber-400/30' :
                index === 1 ? 'bg-gray-400 text-white shadow-lg shadow-gray-400/30' :
                index === 2 ? 'bg-orange-400 text-white shadow-lg shadow-orange-400/30' :
                'bg-gray-100 text-gray-500'
              ]"
            >
              {{ index + 1 }}
            </div>

            <!-- Staff Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-black text-[#033958] truncate">{{ entry.staffName || entry._id }}</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ entry.totalOrders }} Order{{ entry.totalOrders === 1 ? '' : 's' }}</p>
            </div>

            <!-- Sales Amount -->
            <div class="text-right">
              <p class="text-sm font-black text-[#033958]">₦{{ entry.totalSalesAmount.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Commission History -->
    <div class="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
      <div class="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
            <Icon name="lucide:receipt" size="20" />
          </div>
          <h2 class="text-base font-black text-[#033958] tracking-tight uppercase">Commission History</h2>
        </div>
      </div>

      <div class="p-6 md:p-8">
        <div v-if="loadingCommissions" class="space-y-4">
          <div v-for="i in 3" :key="i" class="h-16 bg-gray-50 rounded-2xl animate-pulse"></div>
        </div>
        
        <div v-else-if="commissions.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-4">
            <Icon name="lucide:coins" size="28" />
          </div>
          <p class="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">No Commissions Yet</p>
          <p class="text-xs text-gray-400">Commissions will appear here once orders from your referral link are completed.</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="c in commissions" :key="c._id" class="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-[#033958]/10 transition-all">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <Icon name="lucide:arrow-down-left" size="18" />
              </div>
              <div>
                <p class="text-sm font-bold text-[#033958]">₦{{ c.commissionAmount?.toLocaleString() }}</p>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ c.commissionRate }}% on ₦{{ c.orderValue?.toLocaleString() }}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest" :class="c.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : c.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-500'">{{ c.status }}</span>
              <p class="text-[10px] text-gray-400 mt-1">{{ new Date(c.createdAt).toLocaleDateString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GATEWAY_ENDPOINT } from '~/api_factory/axios.config'
import { useAuthState } from '~/composables/useAuthState'
import { useCustomToast } from '~/composables/core/useCustomToast'

definePageMeta({
  layout: 'dashboard'
})

const { user } = useAuthState()
const { showToast } = useCustomToast()

const loadingLeaderboard = ref(true)
const loadingCommissions = ref(true)
const leaderboard = ref<any[]>([])
const commissions = ref<any[]>([])
const copied = ref(false)

const stats = ref({
  totalSales: 0,
  totalOrders: 0,
  commissionEarned: 0,
})

const myRank = computed(() => {
  if (!user.value) return 0
  const staffCode = (user.value as any).staffCode
  if (!staffCode) return 0
  const idx = leaderboard.value.findIndex(e => e._id === staffCode)
  return idx >= 0 ? idx + 1 : 0
})

const referralLink = computed(() => {
  const staffCode = (user.value as any)?.staffCode
  return staffCode ? `https://wisekings.ng/?staff=${staffCode}` : 'No staff code assigned'
})

const currentMonthName = computed(() => new Date().toLocaleString('default', { month: 'long' }))
const currentYear = computed(() => new Date().getFullYear())

const copyReferralLink = async () => {
  try {
    await navigator.clipboard.writeText(referralLink.value)
    copied.value = true
    showToast({ title: 'Copied!', message: 'Your referral link has been copied to clipboard.', toastType: 'success' })
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    showToast({ title: 'Error', message: 'Could not copy link.', toastType: 'error' })
  }
}

const fetchLeaderboard = async () => {
  loadingLeaderboard.value = true
  try {
    const res = await GATEWAY_ENDPOINT.get('/orders/staff-leaderboard') as any
    leaderboard.value = res.data || res || []

    // Find my stats in leaderboard
    const staffCode = (user.value as any)?.staffCode
    if (staffCode) {
      const myEntry = leaderboard.value.find(e => e._id === staffCode)
      if (myEntry) {
        stats.value.totalSales = myEntry.totalSalesAmount || 0
        stats.value.totalOrders = myEntry.totalOrders || 0
      }
    }
  } catch (e: any) {
    console.error('Failed to fetch leaderboard', e)
  } finally {
    loadingLeaderboard.value = false
  }
}

const fetchCommissions = async () => {
  loadingCommissions.value = true
  try {
    const res = await GATEWAY_ENDPOINT.get('/commissions/me') as any
    const data = res.data?.data || res.data
    commissions.value = data?.data || data || []

    // Calculate total earned
    stats.value.commissionEarned = commissions.value.reduce((sum: number, c: any) => {
      return sum + (c.commissionAmount || 0)
    }, 0)
  } catch (e: any) {
    console.error('Failed to fetch commissions', e)
  } finally {
    loadingCommissions.value = false
  }
}

onMounted(() => {
  fetchLeaderboard()
  fetchCommissions()
})
</script>
