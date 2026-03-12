<template>
  <div class="space-y-8 pb-20">
    <definePageMeta :layout="'dashboard'" />

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">AI Scaling Insights</h1>
        <p class="text-gray-500 font-medium">Automated Intelligence protecting and growing your revenue.</p>
      </div>
      <div class="flex gap-4">
        <button @click="refreshAll" :disabled="loading" class="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-sm text-[#033958] hover:shadow-xl hover:shadow-[#033958]/5 transition-all active:scale-95 disabled:opacity-50">
          <Icon name="lucide:refresh-cw" class="w-4 h-4" :class="{ 'animate-spin': loading }" />
          Re-Analyze Data
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="card in insightCards" 
        :key="card.title"
        class="bg-white p-8 rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-[#033958]/5 transition-all group"
      >
        <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110', card.bgClass]">
          <Icon :name="card.icon" class="w-7 h-7" :class="card.iconClass" />
        </div>
        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{{ card.title }}</p>
        <div class="flex items-end justify-between">
          <h3 class="text-3xl font-black text-gray-900">{{ card.value }}</h3>
          <span class="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">{{ card.trend }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Demand Forecasting -->
      <div class="bg-white rounded-[3rem] border border-gray-50 shadow-sm overflow-hidden flex flex-col">
        <div class="p-8 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 class="text-xl font-black text-gray-900 uppercase tracking-tight">Demand Forecasting</h3>
            <p class="text-xs font-bold text-gray-400 mt-0.5">Predicted sell-out dates based on trends</p>
          </div>
          <Icon name="lucide:bar-chart-3" class="w-6 h-6 text-gray-200" />
        </div>
        <div class="p-8 flex-1">
          <div v-if="loading" class="space-y-4">
             <div v-for="i in 3" :key="i" class="h-20 bg-gray-50 rounded-3xl animate-pulse"></div>
          </div>
          <div v-else class="space-y-6">
            <div v-for="item in forecasts" :key="item.name" class="flex items-center gap-6">
              <div class="w-16 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-[10px] text-gray-400">
                PROD
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-bold text-gray-900">{{ item.name }}</span>
                  <span class="text-xs font-bold text-amber-600 uppercase tracking-widest">{{ item.status }}</span>
                </div>
                <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div :class="['h-full transition-all duration-1000', item.color]" :style="{ width: item.confidence + '%' }"></div>
                </div>
              </div>
              <div class="text-right">
                <p class="font-black text-xs text-gray-900">{{ item.prediction }}</p>
                <p class="text-[10px] font-bold text-gray-400 uppercase">Est. Date</p>
              </div>
            </div>
          </div>
        </div>
        <div class="p-6 bg-gray-50/50 border-t border-gray-50">
          <button class="w-full py-4 rounded-2xl bg-white border border-gray-200 font-black text-[10px] uppercase tracking-widest text-gray-600 hover:bg-gray-100 transition-all">Export Report</button>
        </div>
      </div>

      <!-- Churn Alerts -->
      <div class="bg-white rounded-[3rem] border border-gray-50 shadow-sm overflow-hidden flex flex-col">
        <div class="p-8 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h3 class="text-xl font-black text-gray-900 uppercase tracking-tight">Churn Vulnerability</h3>
            <p class="text-xs font-bold text-gray-400 mt-0.5">Customers flagged for early intervention</p>
          </div>
          <Icon name="lucide:user-minus" class="w-6 h-6 text-gray-200" />
        </div>
        <div class="p-8 flex-1">
          <div v-if="loading" class="space-y-4">
             <div v-for="i in 3" :key="i" class="h-20 bg-gray-50 rounded-3xl animate-pulse"></div>
          </div>
          <div v-else class="space-y-4">
            <div v-for="user in churnAlerts" :key="user.name" class="p-6 rounded-[2rem] bg-gray-50 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-red-100">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 font-black">
                  {{ user.initials }}
                </div>
                <div>
                  <p class="font-bold text-gray-900">{{ user.name }}</p>
                  <p class="text-[10px] font-bold text-red-500 uppercase tracking-widest">{{ user.risk }}% Probability</p>
                </div>
              </div>
              <button class="px-5 py-2.5 rounded-xl bg-white border border-gray-100 font-bold text-[10px] uppercase tracking-widest text-[#033958] hover:bg-[#033958] hover:text-white transition-all">Intervene</button>
            </div>
          </div>
        </div>
        <div class="p-6 bg-gray-50/50 border-t border-gray-50">
          <button class="w-full py-4 rounded-2xl bg-[#033958] font-black text-[10px] uppercase tracking-widest text-white shadow-xl shadow-[#033958]/20 hover:scale-[1.02] transition-all">Bulk Campaign</button>
        </div>
      </div>
    </div>

    <!-- Staff Productivity Insights -->
    <div class="bg-white rounded-[4rem] border border-gray-50 shadow-sm overflow-hidden min-h-[400px] relative">
      <div class="absolute top-0 right-0 w-96 h-96 bg-[#033958]/[0.02] rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div class="p-10 border-b border-gray-50 flex items-center justify-between relative z-10">
        <div>
          <h3 class="text-2xl font-black text-gray-900 uppercase tracking-tight">Staff Productivity Analysis</h3>
          <p class="text-sm font-bold text-gray-400 mt-1">AI-generated operational efficiency report from audit logs</p>
        </div>
        <div class="w-16 h-16 rounded-3xl bg-[#033958] flex items-center justify-center shadow-xl shadow-[#033958]/20">
          <Icon name="lucide:zap" class="w-8 h-8 text-white" />
        </div>
      </div>
      
      <div class="p-10 relative z-10">
        <div v-if="loading" class="space-y-6">
          <div class="h-6 w-3/4 bg-gray-100 rounded-full animate-pulse"></div>
          <div class="h-6 w-1/2 bg-gray-100 rounded-full animate-pulse"></div>
          <div class="h-32 bg-gray-50 rounded-[2rem] animate-pulse"></div>
        </div>
        <div v-else class="prose prose-slate max-w-none">
          <div class="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100/50 text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
            {{ productivityInsight || 'Analysis pending. Click "Re-Analyze Data" to generate insights.' }}
          </div>
        </div>
      </div>
      
      <div class="p-8 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
         <div class="flex items-center gap-4">
            <div class="flex -space-x-3">
               <div v-for="i in 4" :key="i" class="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-black uppercase text-gray-400">ST</div>
            </div>
            <p class="text-[10px] font-black uppercase tracking-widest text-[#033958]">Top performing officers identified</p>
         </div>
         <button class="px-8 py-4 rounded-2xl bg-white border border-gray-100 font-black text-[10px] uppercase tracking-widest text-gray-600 hover:bg-[#033958] hover:text-white transition-all shadow-sm">View Full Audit Matrix</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ai_api } from '@/api_factory/modules/ai'

const loading = ref(false)
const productivityInsight = ref('')

const insightCards = [
  { title: 'Predicted Sales', value: '$42,500', trend: '+12%', icon: 'lucide:trending-up', bgClass: 'bg-emerald-50', iconClass: 'text-emerald-600' },
  { title: 'Churn Risk', value: '14 Customers', trend: '-2.4%', icon: 'lucide:alert-triangle', bgClass: 'bg-red-50', iconClass: 'text-red-500' },
  { title: 'Staff Efficiency', value: '94%', trend: 'Peak', icon: 'lucide:zap', bgClass: 'bg-[#033958]/5', iconClass: 'text-[#033958]' },
  { title: 'Fraud Alerts', value: '0 Active', trend: 'Secure', icon: 'lucide:shield-check', bgClass: 'bg-blue-50', iconClass: 'text-blue-500' },
]

const forecasts = [
  { name: 'WiseKing Salted Chips (Box)', status: 'HIGH DEMAND', confidence: 85, color: 'bg-emerald-500', prediction: 'March 18' },
  { name: 'Supreme Cashew Nuts (Bulk)', status: 'DEPLEATING', confidence: 92, color: 'bg-red-500', prediction: 'March 14' },
  { name: 'Premium Plantain Chips', status: 'STABLE', confidence: 45, color: 'bg-amber-500', prediction: 'April 02' },
]

const churnAlerts = [
  { name: 'Afolabi John', initials: 'AJ', risk: 88, riskLevel: 'Critical' },
  { name: 'Emeka Superstore', initials: 'ES', risk: 42, riskLevel: 'Moderate' },
  { name: 'Victoria Global', initials: 'VG', risk: 15, riskLevel: 'Low' },
]

async function refreshAll() {
  loading.value = true
  try {
    const [f, c, p] = await Promise.all([
      ai_api.getForecast(),
      ai_api.getChurnAnalysis(),
      ai_api.getProductivity()
    ]) as any
    // Note: In real app, update reactive lists from results
    productivityInsight.value = p?.data?.insight || ''
  } catch (e: any) {
     console.error('Analysis failed', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => refreshAll())

definePageMeta({
  layout: 'dashboard'
})
</script>
