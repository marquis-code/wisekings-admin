<template>
  <div class="space-y-10">
    <definePageMeta :layout="'dashboard'" />

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black text-gray-900 tracking-tight">Market Inventory</h1>
        <p class="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">Real-time Supermarket Stock Monitoring</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span class="text-[10px] font-black uppercase tracking-widest">Live Updates</span>
        </div>
      </div>
    </div>

    <!-- Inventory Grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in 6" :key="i" class="h-64 bg-white rounded-[2.5rem] border border-gray-100 animate-pulse"></div>
    </div>

    <div v-else-if="merchants.length === 0" class="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
      <Icon name="lucide:store" class="w-16 h-16 text-gray-100 mb-4" />
      <p class="text-gray-400 font-bold">No supermarkets in your network yet</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="merchant in merchants" :key="merchant._id" class="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
        <!-- Stock Status Header -->
        <div class="p-8 pb-4">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-2xl bg-[#033958]/5 flex items-center justify-center text-[#033958]">
              <Icon name="lucide:store" class="w-6 h-6" />
            </div>
            <span :class="[
              'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border',
              merchant.currentStock > 20 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
              merchant.currentStock > 0 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
            ]">
              {{ merchant.currentStock > 20 ? 'Good Stock' : merchant.currentStock > 0 ? 'Low Stock' : 'Out of Stock' }}
            </span>
          </div>
          <h3 class="text-lg font-black text-gray-900 tracking-tight line-clamp-1">{{ merchant.fullName }}</h3>
          <p class="text-xs text-gray-400 font-medium">Lagos, Nigeria</p>
        </div>

        <!-- Big Stock Number -->
        <div class="flex-1 px-8 py-4 flex flex-col items-center justify-center text-center">
            <span class="text-5xl font-black text-[#033958] tracking-tighter">{{ merchant.currentStock || 0 }}</span>
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Items on Shelf</span>
        </div>

        <!-- Latest Photo Preview -->
        <div class="px-8 pb-8 space-y-4">
            <div class="h-32 rounded-3xl bg-gray-50 border border-gray-100 overflow-hidden relative group/img cursor-pointer">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                    <Icon name="lucide:eye" class="w-6 h-6" />
                    <span class="text-[10px] font-black uppercase tracking-widest">View Shelf Photo</span>
                </div>
                <div class="w-full h-full flex items-center justify-center text-gray-300 italic text-xs font-medium">
                    No recent photo
                </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-gray-50">
               <div class="flex -space-x-2">
                   <div v-for="i in 3" :key="i" class="w-6 h-6 rounded-full bg-gray-200 border-2 border-white ring-1 ring-gray-100 flex items-center justify-center">
                       <Icon name="lucide:user" class="w-3 h-3 text-gray-400" />
                   </div>
               </div>
               <span class="text-[10px] font-bold text-gray-400">3 Facilitators</span>
            </div>
            
            <button class="w-full py-4 rounded-2xl bg-gray-50 text-gray-900 font-black text-[10px] uppercase tracking-widest hover:bg-[#033958] hover:text-white transition-all">
                Full Performance Report
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFetchMerchants } from '@/composables/modules/merchants/useFetchMerchants'

definePageMeta({ layout: 'dashboard' })

const { merchants, loading, fetchMerchants } = useFetchMerchants()

onMounted(() => {
    fetchMerchants({ page: 1, limit: 12 })
})
</script>
