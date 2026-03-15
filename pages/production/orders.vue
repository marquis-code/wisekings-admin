<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Purchase Orders</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Manage procurement and vendor invoices</p>
      </div>
      <button @click="showModal = true" class="btn-primary flex items-center gap-2 !rounded-2xl !py-3 !px-6 shadow-lg shadow-[#033958]/20">
        <Icon name="lucide:file-text" class="w-5 h-5" />
        <span class="font-bold">Generate PO</span>
      </button>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50/50">
            <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
            <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendor</th>
            <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Items</th>
            <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
            <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
            <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-if="loading">
             <td colspan="6" class="p-8 text-center text-gray-300"><Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto" /></td>
          </tr>
          <tr v-else-if="orders.length === 0">
             <td colspan="6" class="p-20 text-center">
                <Icon name="lucide:scroll-text" size="48" class="text-gray-100 mx-auto mb-4" />
                <p class="text-gray-400 font-bold">No purchase orders found</p>
             </td>
          </tr>
          <tr v-for="o in orders" :key="o._id" class="hover:bg-gray-50/50 transition-colors">
            <td class="px-8 py-5 font-black text-xs text-[#033958] uppercase">{{ o.poNumber }}</td>
            <td class="px-8 py-5">
              <p class="text-sm font-black text-gray-900 uppercase">{{ o.vendorName }}</p>
              <p class="text-[10px] text-gray-400">{{ o.vendorEmail }}</p>
            </td>
            <td class="px-8 py-5 text-center">
               <span class="px-2 py-1 rounded-lg bg-gray-100 text-[10px] font-black text-gray-500">{{ o.items.length }} Items</span>
            </td>
            <td class="px-8 py-5 font-black text-sm text-gray-950">₦{{ o.totalAmount.toLocaleString() }}</td>
            <td class="px-8 py-5">
              <span :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest', o.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600']">
                 {{ o.status }}
              </span>
            </td>
            <td class="px-8 py-5 text-right text-xs font-bold text-gray-400">
               {{ new Date(o.createdAt).toLocaleDateString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <ProductionPurchaseOrderModal :show="showModal" @close="showModal = false" @success="fetchOrders" />
  </div>
</template>

<script setup lang="ts">
import { usePurchaseOrders } from '@/composables/modules/production/usePurchaseOrders'

definePageMeta({ layout: 'dashboard' })

const { orders, loading, fetchOrders } = usePurchaseOrders()
const showModal = ref(false)

onMounted(fetchOrders)
</script>
