<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    
    <div v-if="loading" class="flex flex-col items-center justify-center p-20">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-[#033958] rounded-full animate-spin"></div>
      <p class="mt-4 text-gray-500 font-medium">Loading campaign details...</p>
    </div>

    <div v-else-if="campaign" class="max-w-4xl mx-auto py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <button @click="$router.back()" class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            <Icon name="lucide:arrow-left" class="w-5 h-5" />
          </button>
          <div>
            <div class="flex items-center gap-3 mb-1">
              <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                {{ campaign.targetAudience }}
              </span>
              <span class="text-xs font-bold text-gray-400">
                Sent {{ new Date(campaign.createdAt).toLocaleString() }}
              </span>
            </div>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">{{ campaign.title }}</h1>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Campaign Summary Info -->
        <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Subject Line</p>
               <p class="text-lg font-bold text-gray-900">{{ campaign.subject }}</p>
            </div>
            <div v-if="campaign.previewText">
               <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Preview Text</p>
               <p class="text-base text-gray-700">{{ campaign.previewText }}</p>
            </div>
            <div>
               <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Sender</p>
               <p class="text-base font-medium text-gray-700">
                  {{ campaign.createdBy?.fullName || 'Administrator' }}
               </p>
            </div>
          </div>
        </div>

        <!-- Campaign Banner -->
        <div v-if="campaign.bannerUrl" class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Campaign Banner</p>
          <div class="w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            <img :src="campaign.bannerUrl" class="w-full max-h-96 object-contain" alt="Campaign Banner" />
          </div>
        </div>

        <!-- Campaign Content Preview -->
        <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Email Content Preview</p>
          <div class="prose prose-sm max-w-none p-6 bg-gray-50 rounded-2xl border border-gray-100" v-html="campaign.content"></div>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center p-20 text-center">
      <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <Icon name="lucide:alert-circle" class="w-8 h-8 text-red-500" />
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-1">Campaign Not Found</h3>
      <p class="text-gray-500 mb-6">The campaign you are looking for does not exist or has been deleted.</p>
      <button @click="$router.push('/marketing')" class="btn-primary !rounded-xl !px-6 !py-2.5">Back to Marketing</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { marketing_api } from '@/api_factory/modules/marketing'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const campaignId = route.params.id as string

const loading = ref(true)
const campaign = ref<any>(null)

async function fetchCampaign() {
  if (!campaignId) {
    loading.value = false
    return
  }
  
  loading.value = true
  try {
    const res = await marketing_api.getCampaignById(campaignId)
    campaign.value = res.data?.data || res.data || null
  } catch (error) {
    console.error('Failed to fetch campaign:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCampaign()
})
</script>
