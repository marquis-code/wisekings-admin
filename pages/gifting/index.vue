<template>
  <main>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Gifting Requests</h1>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-10 text-center text-gray-500">Loading requests...</div>
      <div v-else-if="!requests.length" class="p-10 text-center text-gray-500">No gifting requests found.</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left whitespace-nowrap">
          <thead class="bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-700">
            <tr>
              <th class="px-6 py-4">Sender</th>
              <th class="px-6 py-4">Recipient</th>
              <th class="px-6 py-4">Occasion</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Date</th>
              <th class="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-for="req in requests" :key="req._id" class="hover:bg-gray-50/50">
              <td class="px-6 py-4">
                <p class="font-bold text-gray-900">{{ req.senderDetails.name }}</p>
                <p class="text-xs text-gray-500">{{ req.senderDetails.email }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="font-bold text-gray-900">{{ req.recipientDetails.name }}</p>
                <p class="text-xs text-gray-500 truncate max-w-[200px]">{{ req.recipientDetails.country }}</p>
              </td>
              <td class="px-6 py-4 text-gray-500">{{ req.recipientDetails.occasion }}</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" :class="{
                  'bg-yellow-100 text-yellow-700': req.status === 'pending',
                  'bg-blue-100 text-blue-700': req.status === 'approved',
                  'bg-green-100 text-green-700': req.status === 'paid',
                  'bg-purple-100 text-purple-700': req.status === 'shipped',
                  'bg-red-100 text-red-700': req.status === 'rejected'
                }">
                  {{ req.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-500">{{ new Date(req.createdAt).toLocaleDateString() }}</td>
              <td class="px-6 py-4 text-right">
                <NuxtLink :to="`/gifting/${req._id}`" class="text-[#033958] font-bold hover:underline">View &rarr;</NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGetGiftings } from '@/composables/modules/gifting/fetch'

const { fetchGiftings, loading, requests } = useGetGiftings()

onMounted(() => {
  fetchGiftings()
})
</script>
