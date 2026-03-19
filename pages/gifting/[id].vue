<template>
  <main v-if="loading && !request" class="p-10 text-center text-gray-500">Loading details...</main>
  <main v-else-if="request" class="max-w-5xl mx-auto space-y-6 pb-20">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <NuxtLink to="/gifting" class="text-gray-500 hover:text-gray-900 text-sm font-bold flex items-center gap-1 mb-2">
          &larr; Back to Requests
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-900">Request #{{ request._id.slice(-6).toUpperCase() }}</h1>
      </div>
      <div>
        <span class="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider" :class="{
          'bg-yellow-100 text-yellow-800 border fill-yellow-200': request.status === 'pending',
          'bg-blue-100 text-blue-800 border fill-blue-200': request.status === 'approved',
          'bg-green-100 text-green-800 border fill-green-200': request.status === 'paid',
          'bg-purple-100 text-purple-800 border fill-purple-200': request.status === 'shipped',
        }">
          {{ request.status }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Primary Info Column -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Curated Products -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Selected Products</h2>
          <div class="space-y-4">
            <div v-for="item in request.products" :key="item.product._id" class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <img :src="item.product.images[0]" class="w-12 h-12 rounded object-cover bg-gray-50" />
                <div>
                  <p class="font-bold text-gray-900">{{ item.product.name }}</p>
                  <p class="text-xs text-gray-500">{{ item.quantity }} packs</p>
                </div>
              </div>
            </div>
          </div>
          <p v-if="request.specialInstructions" class="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-700 italic border border-gray-100">
            <strong>Notes:</strong> "{{ request.specialInstructions }}"
          </p>
        </div>

        <!-- Participants -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Sender Profile</h2>
            <p class="font-bold text-gray-900">{{ request.senderDetails.name }}</p>
            <p class="text-sm text-gray-600 mb-1 mt-2">📧 {{ request.senderDetails.email }}</p>
            <p class="text-sm text-gray-600">📱 {{ request.senderDetails.phone }}</p>
          </div>
          
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Recipient Profile</h2>
            <p class="font-bold text-gray-900">{{ request.recipientDetails.name }}</p>
            <span class="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded mt-1 mb-2">{{ request.recipientDetails.occasion }}</span>
            <p class="text-sm text-gray-600">📱 {{ request.recipientDetails.phone }}</p>
            <p class="text-sm text-gray-600 mt-2"><strong>Address:</strong> {{ request.recipientDetails.address }}</p>
            <p class="text-sm text-gray-600"><strong>Country:</strong> {{ request.recipientDetails.country }}</p>
          </div>
        </div>
      </div>

      <!-- Action / Cost Column -->
      <div class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
          <h2 class="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Pricing & Actions</h2>
          
          <!-- Pricing Inputs -->
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Products Cost (₦)</label>
              <input v-model="form.productsCost" :disabled="request.status !== 'pending'" type="number" class="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#033958] bg-gray-50" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Shipping Fee (₦)</label>
              <input v-model="form.shippingFee" :disabled="request.status !== 'pending'" type="number" class="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#033958] bg-gray-50" />
            </div>
            <div class="pt-2 border-t border-gray-100">
              <label class="block text-xs font-bold text-gray-900 uppercase mb-1">Total Cost To Invoice (₦)</label>
              <input v-model="totalCostCalc" disabled type="number" class="w-full px-3 py-2 rounded-lg border-2 border-amber-200 font-bold bg-amber-50 text-amber-900" />
            </div>
          </div>

          <!-- Actions -->
          <div class="border-t border-gray-100 pt-6 space-y-3">
            <button v-if="request.status === 'pending'" @click="handleAction('approved')" :disabled="updating" class="w-full bg-[#033958] text-white py-3 rounded-lg font-bold hover:bg-[#033958]/90 transition">
              Approve & Send Invoice
            </button>
            <button v-if="request.status === 'pending'" @click="handleAction('rejected')" :disabled="updating" class="w-full bg-red-50 text-red-600 py-3 rounded-lg font-bold hover:bg-red-100 transition">
              Reject Request
            </button>
            
            <button v-if="request.status === 'approved'" @click="handleAction('paid')" :disabled="updating" class="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">
              Mark as Paid (Send Receipt)
            </button>
            
            <button v-if="request.status === 'paid'" @click="handleAction('shipped')" :disabled="updating" class="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition">
              Mark as Shipped
            </button>
          </div>
        </div>
      </div>
      
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGetGiftingById } from '@/composables/modules/gifting/fetch'
import { useUpdateGifting } from '@/composables/modules/gifting/update'

const route = useRoute()
const { fetchGiftingById, loading, request } = useGetGiftingById()
const { updateGifting, loading: updating } = useUpdateGifting()

const form = reactive({
  productsCost: 0,
  shippingFee: 0
})

const totalCostCalc = computed(() => {
  return Number(form.productsCost) + Number(form.shippingFee)
})

onMounted(async () => {
  const data = await fetchGiftingById(route.params.id as string)
  if (data) {
    form.productsCost = data.pricing?.productsCost || 0
    form.shippingFee = data.pricing?.shippingFee || 0
  }
})

const handleAction = async (status: string) => {
  const payload: any = { status }
  
  if (status === 'approved') {
    if (totalCostCalc.value <= 0) {
      alert("Total cost must be greater than 0.")
      return
    }
    payload.productsCost = Number(form.productsCost)
    payload.shippingFee = Number(form.shippingFee)
    payload.totalCost = totalCostCalc.value
  }

  await updateGifting(route.params.id as string, payload)
  await fetchGiftingById(route.params.id as string) // Refresh
}
</script>
