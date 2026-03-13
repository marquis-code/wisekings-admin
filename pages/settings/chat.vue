<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-black text-slate-900 uppercase tracking-tight">Chat Settings</h1>
        <p class="text-slate-500">Configure AI personality, auto-responses, and business hours.</p>
      </div>
      <button @click="save" :disabled="saving" class="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50">
        <Icon v-if="saving" name="lucide:loader-2" class="animate-spin" />
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <Icon name="lucide:loader-2" class="w-12 h-12 text-indigo-600 animate-spin" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Left Column: AI & Global -->
      <div class="md:col-span-2 space-y-8">
        <!-- AI Configuration -->
        <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <Icon name="lucide:bot" size="24" />
              </div>
              <h2 class="text-xl font-bold text-slate-900">AI Assistant</h2>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="config.aiEnabled" class="sr-only peer">
              <div class="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">AI Personality / System Prompt</label>
              <textarea v-model="config.aiSystemPrompt" rows="4" class="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Describe how the AI should behave..."></textarea>
            </div>
          </div>
        </div>

        <!-- Auto-Responses -->
        <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <Icon name="lucide:message-square" size="24" />
              </div>
              <h2 class="text-xl font-bold text-slate-900">Auto-Responses (FAQs)</h2>
            </div>
            <button @click="addTrigger" class="text-sm font-bold text-indigo-600 hover:text-indigo-700">+ Add Trigger</button>
          </div>

          <div class="space-y-4">
            <div v-for="(ar, i) in config.autoResponses" :key="i" class="p-6 bg-slate-50 rounded-2xl border border-slate-100 group relative">
              <button @click="config.autoResponses.splice(i, 1)" class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-rose-500 hover:scale-110 transition-all">
                <Icon name="lucide:trash-2" size="18" />
              </button>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Trigger Keyword</label>
                  <input v-model="ar.trigger" class="w-full bg-white border-slate-200 rounded-xl px-4 py-2 text-sm" placeholder="e.g. 'shipping'" />
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Response Message</label>
                  <textarea v-model="ar.response" class="w-full bg-white border-slate-200 rounded-xl px-4 py-2 text-sm" rows="2" placeholder="The response..."></textarea>
                </div>
              </div>
            </div>
            <div v-if="config.autoResponses.length === 0" class="text-center py-10 opacity-30 italic text-sm">No auto-responses configured yet.</div>
          </div>
        </div>

        <!-- Delayed Response -->
        <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <Icon name="lucide:clock" size="24" />
            </div>
            <h2 class="text-xl font-bold text-slate-900">Wait-Time Handling</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="md:col-span-1">
              <label class="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Threshold</label>
              <div class="flex items-center gap-2">
                <input type="number" v-model="config.delayedResponseThreshold" class="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2 font-bold" />
                <span class="text-xs text-slate-400">min</span>
              </div>
            </div>
            <div class="md:col-span-3">
              <label class="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Delayed Message</label>
              <input v-model="config.delayedResponseMessage" class="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2" />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Business Hours & Offline -->
      <div class="space-y-8">
        <div class="bg-indigo-900 rounded-3xl p-8 text-white shadow-xl">
          <h2 class="text-xl font-bold mb-6 flex items-center gap-3">
            <Icon name="lucide:calendar" /> Business Hours
          </h2>
          <div class="space-y-4">
            <div v-for="(hours, day) in config.businessHours" :key="day" class="flex items-center justify-between text-sm py-1 border-b border-white/10 last:border-0 capitalize">
              <span class="font-medium text-indigo-200 w-20">{{ day }}</span>
              <div class="flex items-center gap-2">
                <template v-if="!hours.isClosed">
                  <input type="text" v-model="hours.open" class="bg-white/10 border-0 rounded px-1.5 py-0.5 w-14 text-center text-xs" />
                  <span class="opacity-30">-</span>
                  <input type="text" v-model="hours.close" class="bg-white/10 border-0 rounded px-1.5 py-0.5 w-14 text-center text-xs" />
                </template>
                <span v-else class="text-rose-400 font-bold uppercase text-[10px]">Closed</span>
                <button @click="hours.isClosed = !hours.isClosed" class="ml-2 hover:scale-110 transition-all">
                  <Icon :name="hours.isClosed ? 'lucide:unlock' : 'lucide:lock'" size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <label class="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Offline Message</label>
          <textarea v-model="config.offlineMessage" rows="5" class="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 text-sm text-slate-600 focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Sent when business is closed..."></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = ref<any>({
  aiEnabled: true,
  aiSystemPrompt: '',
  autoResponses: [],
  businessHours: {},
  offlineMessage: '',
  delayedResponseThreshold: 5,
  delayedResponseMessage: ''
})

const loading = ref(true)
const saving = ref(false)
const { accessToken } = useAuthState()
const rtConfig = useRuntimeConfig()

async function fetchConfig() {
  try {
    const res: any = await $fetch(`${rtConfig.public.apiBase}/chat/config`, {
      headers: { Authorization: `Bearer ${accessToken.value}` }
    })
    config.value = res
  } catch (err) {
    console.error('Failed to fetch chat config', err)
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  try {
    await $fetch(`${rtConfig.public.apiBase}/chat/config`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken.value}` },
      body: config.value
    })
    // Show success toast (if available)
  } catch (err) {
    console.error('Failed to save chat config', err)
  } finally {
    saving.value = false
  }
}

function addTrigger() {
  config.value.autoResponses.push({ trigger: '', response: '', isActive: true })
}

onMounted(fetchConfig)
</script>
