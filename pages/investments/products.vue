<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Investment Products</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Configure PiggyVest-style wealth creation opportunities</p>
      </div>
      <button @click="openAddModal" class="btn-primary flex items-center gap-2 !rounded-2xl !py-4 !px-8 shadow-lg shadow-[#033958]/20">
        <Icon name="lucide:piggy-bank" class="w-5 h-5" />
        <span class="font-bold uppercase tracking-widest text-xs">Create New Opportunity</span>
      </button>
    </div>

    <!-- Products Grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       <div v-for="i in 3" :key="i" class="h-64 bg-white rounded-[2rem] animate-pulse border border-gray-100"></div>
    </div>
    
    <div v-else-if="products.length === 0" class="bg-white rounded-[3rem] p-20 text-center border border-gray-100 border-dashed">
       <div class="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
         <Icon name="lucide:search-x" class="w-10 h-10 text-gray-200" />
       </div>
       <h2 class="text-xl font-black text-gray-900 mb-2">No Active Products</h2>
       <p class="text-gray-400 max-w-xs mx-auto text-sm font-medium leading-relaxed">You haven't created any investment products yet. Start by defining your first opportunity.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="p in products" :key="p._id" class="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
        <!-- Status Badge -->
        <div class="absolute top-6 right-6 z-10">
           <span :class="['px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border', p.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100']">
             {{ p.status }}
           </span>
        </div>

        <div class="p-8">
           <div class="flex items-start justify-between mb-8">
              <div class="w-14 h-14 rounded-2xl bg-[#033958]/5 flex items-center justify-center text-[#033958]">
                 <Icon name="lucide:trending-up" size="28" />
              </div>
              <div class="text-right">
                 <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Return On Investment</p>
                 <p class="text-3xl font-black text-emerald-600">{{ p.roiPercentage }}%</p>
              </div>
           </div>

           <h3 class="text-xl font-black text-gray-900 group-hover:text-[#033958] transition-colors mb-2">{{ p.title }}</h3>
           <p class="text-sm text-gray-500 font-medium line-clamp-2 mb-6">{{ p.description }}</p>

           <div class="grid grid-cols-2 gap-4 mb-8">
              <div class="p-4 bg-gray-50 rounded-2xl border border-gray-50">
                 <p class="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">Duration</p>
                 <p class="text-sm font-black text-gray-900">{{ p.durationInMonths }} Months</p>
              </div>
              <div :class="['p-4 rounded-2xl border', p.riskLevel === 'low' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : p.riskLevel === 'medium' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-red-50 border-red-100 text-red-700']">
                 <p class="text-[9px] font-black opacity-60 uppercase tracking-tighter mb-1">Risk Level</p>
                 <p class="text-sm font-black uppercase tracking-widest">{{ p.riskLevel }}</p>
              </div>
           </div>

           <div class="mb-8 space-y-2">
              <div class="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span>Funding Status</span>
                <span>{{ Math.round((p.slotsPurchased / p.totalSlots) * 100) }}%</span>
              </div>
              <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-[#033958] transition-all duration-1000" :style="{ width: `${(p.slotsPurchased / p.totalSlots) * 100}%` }"></div>
              </div>
              <p class="text-center text-[10px] font-bold text-gray-400">{{ (p.totalSlots - p.slotsPurchased).toLocaleString() }} Slots Remaining</p>
           </div>

           <div class="pt-6 border-t border-gray-50 flex items-center justify-between">
              <div>
                 <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Entry Price</p>
                 <p class="text-lg font-black text-[#033958]">₦{{ p.pricePerSlot.toLocaleString() }}</p>
              </div>
              <button @click="openEditModal(p)" class="w-12 h-12 rounded-2xl bg-gray-50 text-gray-900 group-hover:bg-[#033958] group-hover:text-white transition-all duration-300 flex items-center justify-center border border-gray-100 group-hover:border-[#033958]">
                 <Icon name="lucide:settings-2" class="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <InvestmentsInvestmentProductModal 
      :show="showModal" 
      :product="selectedProduct" 
      @close="showModal = false" 
      @success="fetchProducts" 
    />
  </div>
</template>

<script setup lang="ts">
import { useFetchInvestmentProducts } from '@/composables/modules/investments/useFetchInvestmentProducts'

definePageMeta({ layout: 'dashboard' })

const { products, loading, fetchProducts } = useFetchInvestmentProducts()
const showModal = ref(false)
const selectedProduct = ref<any>(null)

function openAddModal() {
  selectedProduct.value = null
  showModal.value = true
}

function openEditModal(p: any) {
  selectedProduct.value = { ...p }
  showModal.value = true
}

onMounted(fetchProducts)
</script>
