<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    
    <!-- Header & Navigation -->
    <div class="flex items-center gap-4 mb-8">
      <NuxtLink 
        to="/orders" 
        class="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 shadow-sm transition-all"
      >
        <Icon name="lucide:arrow-left" class="w-5 h-5" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-black text-gray-900 tracking-tight">Order Details</h1>
        <p class="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">Fulfillment & Shipment Tracking</p>
      </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
      <Icon name="lucide:loader-2" class="w-10 h-10 animate-spin text-[#033958]/20" />
      <p class="mt-4 text-sm font-bold text-gray-400">Loading order manifest...</p>
    </div>

    <div v-else-if="order" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Main Content Block -->
      <div class="lg:col-span-8 space-y-6">
        <!-- Order Items -->
        <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
            <h2 class="text-lg font-black text-gray-900 tracking-tight">Purchase Items</h2>
            <div class="px-3 py-1 bg-[#033958]/5 rounded-lg border border-[#033958]/10 group">
              <code class="text-[11px] font-mono font-black text-[#033958] tracking-wider">{{ order.orderNumber }}</code>
            </div>
          </div>
          
          <div class="space-y-6">
            <div v-for="item in order.items" :key="item.productId" class="flex items-center gap-5 p-2 transition-all hover:bg-gray-50/50 rounded-2xl group">
              <div class="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100 shadow-inner group-hover:scale-105 transition-transform duration-300">
                <img v-if="item.image" :src="item.image" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                  <Icon name="lucide:image" class="w-6 h-6" />
                </div>
              </div>
              <div class="flex-1">
                <p class="text-sm font-black text-gray-900 leading-tight">{{ item.name }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">Qty: {{ item.quantity }}</span>
                  <span class="text-[10px] font-bold text-gray-400">@ ₦{{ item.price.toLocaleString() }}</span>
                </div>
              </div>
              <p class="text-sm font-black text-gray-900">₦{{ (item.price * item.quantity).toLocaleString() }}</p>
            </div>
          </div>

          <div class="mt-8 pt-8 border-t border-gray-50 space-y-3 px-2">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400 font-black uppercase tracking-widest text-[10px]">Subtotal</span>
              <span class="text-gray-700 font-bold">₦{{ order.totalAmount.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-400 font-black uppercase tracking-widest text-[10px]">Processing & Shipping</span>
              <span class="text-gray-700 font-bold">₦{{ (order.shippingFee || 0).toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center pt-4 border-t border-gray-50">
              <span class="text-sm font-black text-gray-900 tracking-tight">Total Payment Amount</span>
              <span class="text-2xl font-black text-[#033958]">₦{{ (order.totalAmount + (order.shippingFee || 0)).toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Shipping Manifest -->
        <div v-if="order.shippingAddress" class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Icon name="lucide:truck" class="w-5 h-5" />
            </div>
            <h2 class="text-lg font-black text-gray-900 tracking-tight">Shipping Destination</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Recipient</p>
              <p class="text-base font-black text-gray-900">{{ order.shippingAddress.fullName }}</p>
              <p class="text-sm font-bold text-gray-500 mt-1 flex items-center gap-2">
                <Icon name="lucide:phone" class="w-3 h-3" />
                {{ order.shippingAddress.phone }}
              </p>
            </div>
            <div class="space-y-1">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Delivery Address</p>
              <p class="text-sm font-bold text-gray-700 leading-relaxed">{{ order.shippingAddress.address }}</p>
              <p class="text-xs font-black text-indigo-600 lowercase tracking-tight">{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions & Summary Sidebar -->
      <div class="lg:col-span-4 space-y-6">
        <!-- Fulfillment Status Control -->
        <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Icon name="lucide:refresh-cw" class="w-5 h-5" />
            </div>
            <h2 class="text-lg font-black text-gray-900 tracking-tight">Fulfillment</h2>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Current Order Status</label>
              <select 
                v-model="selectedStatus" 
                class="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#033958]/10 transition-all outline-none"
              >
                <option v-for="s in ['pending','confirmed','processing','shipped','delivered','completed','cancelled']" :key="s" :value="s" class="capitalize">{{ s }}</option>
              </select>
            </div>
            
            <button 
              @click="updateStatus" 
              class="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-[#033958] text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#033958]/20 disabled:opacity-50" 
              :disabled="updating"
            >
              <Icon v-if="updating" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <Icon v-else name="lucide:save" class="w-4 h-4" />
              {{ updating ? 'Processing...' : 'Save Status' }}
            </button>
          </div>
        </div>

        <!-- Payment & Context Summary -->
        <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
           <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b border-gray-50">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</span>
              <span :class="[
                'px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border',
                order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
              ]">{{ order.paymentStatus || 'pending' }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-50">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gateway</span>
              <span class="text-xs font-bold text-gray-700 capitalize">{{ order.paymentProvider || '—' }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-50">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Source Referral</span>
              <span class="text-xs font-black text-[#033958] bg-[#033958]/5 px-2 py-0.5 rounded border border-[#033958]/10">{{ order.referralCode || 'none' }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</span>
              <span class="text-[11px] font-bold text-gray-500 text-right">{{ new Date(order.createdAt).toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Proof Verification (for Direct Transfer) -->
        <div v-if="order.paymentProvider === 'direct_transfer' && order.paymentProof" class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Icon name="lucide:file-text" class="w-5 h-5" />
            </div>
            <h3 class="text-lg font-black text-gray-900 tracking-tight">Payment Proof</h3>
          </div>
          
          <div class="space-y-6">
            <div class="aspect-video rounded-3xl overflow-hidden border border-gray-100 bg-gray-50 group relative cursor-pointer" @click="openProof(order.paymentProof)">
              <img :src="order.paymentProof" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Icon name="lucide:maximize" class="w-8 h-8 text-white" />
              </div>
            </div>

            <div v-if="order.paymentProofStatus === 'pending'" class="grid grid-cols-2 gap-4">
              <button 
                @click="verifyOrderProof('rejected')" 
                class="py-4 rounded-2xl bg-rose-50 text-rose-600 font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100"
                :disabled="verifying"
              >
                Reject Proof
              </button>
              <button 
                @click="verifyOrderProof('verified')" 
                class="py-4 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                :disabled="verifying"
              >
                Verify Payment
              </button>
            </div>
            <div v-else class="flex items-center justify-center p-4 rounded-2xl border" :class="order.paymentProofStatus === 'verified' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'">
               <Icon :name="order.paymentProofStatus === 'verified' ? 'lucide:check-circle' : 'lucide:x-circle'" class="w-5 h-5 mr-2" />
               <span class="text-xs font-black uppercase tracking-widest">Payment {{ order.paymentProofStatus }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order, OrderStatus } from '~/types'
import { orders_api } from '@/api_factory/modules/orders'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({ layout: 'dashboard' })
const route = useRoute(); const { showToast } = useCustomToast()
const order = ref<any | null>(null); const loading = ref(true); const updating = ref(false); const verifying = ref(false)
const selectedStatus = ref('')

function openProof(url: string) { window.open(url, '_blank') }

async function verifyOrderProof(status: 'verified' | 'rejected') {
  verifying.value = true
  try {
    await orders_api.verifyProof(order.value!._id, status)
    showToast({ title: 'Success', message: `Payment proof ${status}`, toastType: 'success' })
    fetchOrder()
  } catch {
    showToast({ title: 'Error', message: 'Failed to update proof status', toastType: 'error' })
  } finally {
    verifying.value = false
  }
}

async function fetchOrder() { 
  loading.value = true; 
  try { 
    const r = await orders_api.getById(route.params.id as string) as any; 
    const data = r?.data || r;
    order.value = data; 
    selectedStatus.value = data?.status 
  } catch { 
    showToast({ title: 'Error', message: 'Order not found', toastType: 'error' }) 
  } finally { 
    loading.value = false 
  } 
}
async function updateStatus() { if (!selectedStatus.value) return; updating.value = true; try { await orders_api.updateStatus(order.value!._id, selectedStatus.value as OrderStatus); showToast({ title: 'Success', message: 'Order status updated', toastType: 'success' }); fetchOrder() } catch { showToast({ title: 'Error', message: 'Failed to update status', toastType: 'error' }) } finally { updating.value = false } }
onMounted(fetchOrder)
</script>
