<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/orders" class="btn-ghost btn-sm"><Icon name="lucide:arrow-left" class="w-4 h-4" /></NuxtLink>
      <h1 class="text-2xl font-bold text-white">Order Details</h1>
    </div>
    <div v-if="loading" class="text-center py-20"><Icon name="lucide:loader-2" class="w-8 h-8 animate-spin mx-auto text-dark-400" /></div>
    <div v-else-if="order" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-white">Items</h2>
            <code class="text-sm bg-dark-800 px-2 py-0.5 rounded">{{ order.orderNumber }}</code>
          </div>
          <div class="space-y-3">
            <div v-for="item in order.items" :key="item.productId" class="flex items-center gap-4 py-3 border-b border-dark-700/50 last:border-0">
              <div class="w-12 h-12 rounded-lg bg-dark-800 overflow-hidden flex-shrink-0">
                <img v-if="item.image" :src="item.image" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1"><p class="text-sm font-medium text-white">{{ item.name }}</p><p class="text-xs text-dark-400">Qty: {{ item.quantity }}</p></div>
              <p class="text-sm font-medium text-white">₦{{ (item.price * item.quantity).toLocaleString() }}</p>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-dark-700 space-y-2">
            <div class="flex justify-between text-sm"><span class="text-dark-400">Subtotal</span><span class="text-dark-200">₦{{ order.totalAmount.toLocaleString() }}</span></div>
            <div class="flex justify-between text-sm"><span class="text-dark-400">Shipping</span><span class="text-dark-200">₦{{ (order.shippingFee || 0).toLocaleString() }}</span></div>
            <div class="flex justify-between text-sm font-bold"><span class="text-white">Total</span><span class="text-white">₦{{ (order.totalAmount + (order.shippingFee || 0)).toLocaleString() }}</span></div>
          </div>
        </div>
        <div v-if="order.shippingAddress" class="card">
          <h2 class="text-lg font-semibold text-white mb-3">Shipping Address</h2>
          <p class="text-sm text-dark-200">{{ order.shippingAddress.fullName }}</p>
          <p class="text-sm text-dark-400">{{ order.shippingAddress.address }}, {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }}</p>
          <p class="text-sm text-dark-400">{{ order.shippingAddress.phone }}</p>
        </div>
      </div>
      <div class="space-y-6">
        <div class="card">
          <h2 class="text-lg font-semibold text-white mb-3">Status</h2>
          <select v-model="selectedStatus" class="input mb-3">
            <option v-for="s in ['pending','confirmed','processing','shipped','delivered','completed','cancelled']" :key="s" :value="s">{{ s }}</option>
          </select>
          <button @click="updateStatus" class="btn-primary w-full btn-sm" :disabled="updating">
            {{ updating ? 'Updating...' : 'Update Status' }}
          </button>
        </div>
        <div class="card space-y-3">
          <div class="flex justify-between text-sm"><span class="text-dark-400">Payment</span><span :class="order.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'">{{ order.paymentStatus }}</span></div>
          <div class="flex justify-between text-sm"><span class="text-dark-400">Provider</span><span class="text-dark-200 capitalize">{{ order.paymentProvider || '—' }}</span></div>
          <div class="flex justify-between text-sm"><span class="text-dark-400">Referral</span><span class="text-dark-200">{{ order.referralCode || '—' }}</span></div>
          <div class="flex justify-between text-sm"><span class="text-dark-400">Created</span><span class="text-dark-200">{{ new Date(order.createdAt).toLocaleString() }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order, OrderStatus } from '~/types'
definePageMeta({ layout: 'dashboard' })
const route = useRoute(); const api = useOrdersApi(); const toast = useToast()
const order = ref<Order | null>(null); const loading = ref(true); const updating = ref(false)
const selectedStatus = ref('')

async function fetchOrder() { loading.value = true; try { const r = await api.findById(route.params.id as string); order.value = r as any; selectedStatus.value = (r as any)?.status } catch { toast.error('Order not found') } finally { loading.value = false } }
async function updateStatus() { if (!selectedStatus.value) return; updating.value = true; try { await api.updateStatus(order.value!._id, selectedStatus.value as OrderStatus); toast.success('Status updated'); fetchOrder() } catch { toast.error('Failed') } finally { updating.value = false } }
onMounted(fetchOrder)
</script>
