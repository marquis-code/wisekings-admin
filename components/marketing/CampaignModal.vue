<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/5 backdrop-blur-[2px]">
        <div class="relative bg-white w-full max-w-5xl h-[95vh] rounded-3xl overflow-hidden shadow-2xl animate-modal-in flex flex-col border border-gray-100">
          <!-- Header -->
          <div class="px-10 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
            <h2 class="text-2xl font-serif text-gray-900">
              {{ mode === 'edit' ? 'Edit Campaign' : 'Create Campaign' }}
            </h2>
            <button @click="$emit('close')" class="text-sm text-gray-400 hover:text-gray-900 transition-colors">Cancel</button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-10 bg-gray-50/30 style-scrollbar">
            <div class="max-w-4xl mx-auto space-y-8">
              
              <!-- Campaign Details -->
              <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <h3 class="text-sm font-serif text-gray-900 mb-6">Campaign Details</h3>
                <div class="space-y-4">
                  <input v-model="form.title" placeholder="Campaign Name" class="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm text-gray-900 focus:ring-1 focus:ring-gray-200 outline-none transition-all placeholder:text-gray-400 font-serif" />
                  <input v-model="form.subject" placeholder="Subject Line" class="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm text-gray-900 focus:ring-1 focus:ring-gray-200 outline-none transition-all placeholder:text-gray-400 font-serif" />
                  <input v-model="form.previewText" placeholder="Preview Text" class="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm text-gray-900 focus:ring-1 focus:ring-gray-200 outline-none transition-all placeholder:text-gray-400 font-serif" />
                </div>
                
                <div class="mt-8">
                  <p class="text-[11px] text-gray-500 mb-2 font-serif">Campaign Banner</p>
                  <div class="flex items-center gap-6">
                    <CoreImageUploader
                      v-model="form.bannerUrl"
                      folder="campaigns"
                      label="Upload Banner"
                      class="flex-1"
                    />
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <h3 class="text-sm font-serif text-gray-900 mb-6">Content</h3>
                <div class="rounded-xl overflow-hidden mt-2">
                  <CoreRichTextEditor v-model="form.content" placeholder="Start writing your campaign..." />
                </div>
              </div>

              <!-- Audience -->
              <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <h3 class="text-sm font-serif text-gray-900 mb-6">Audience</h3>
                <div class="relative" ref="audienceDropdown">
                  <div @click="audienceOpen = !audienceOpen" class="w-full bg-gray-50 rounded-xl px-5 py-3 cursor-pointer flex items-center justify-between border border-transparent hover:border-gray-200 transition-colors">
                    <div>
                      <p class="text-[9px] text-gray-400 font-serif">Target Audience</p>
                      <p class="text-sm font-serif text-gray-900 mt-0.5">{{ form.targetAudienceLabel }}</p>
                    </div>
                    <Icon name="lucide:chevron-down" class="w-4 h-4 text-gray-400 transition-transform" :class="{'rotate-180': audienceOpen}" />
                  </div>
                  
                  <!-- Dropdown List -->
                  <div v-if="audienceOpen" class="absolute left-0 right-0 top-[calc(100%+8px)] bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-2">
                    <div class="px-4 pb-2 pt-1 border-b border-gray-50 mb-2">
                       <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                          <Icon name="lucide:search" class="w-4 h-4 text-gray-300" />
                          <input type="text" placeholder="Search..." class="bg-transparent border-none text-[11px] font-serif w-full outline-none placeholder:text-gray-300 text-gray-700" />
                       </div>
                    </div>
                    <div @click="selectAudience('all', 'All Clients')" class="px-5 py-3 text-xs font-serif text-gray-700 hover:bg-gray-50 cursor-pointer">All Clients</div>
                    <div @click="selectAudience('active', 'Active Clients')" class="px-5 py-3 text-xs font-serif text-gray-700 hover:bg-gray-50 cursor-pointer">Active Clients</div>
                    <div @click="selectAudience('specific', 'Specific Emails')" class="px-5 py-3 text-xs font-serif text-gray-700 hover:bg-gray-50 cursor-pointer">Specific Emails</div>
                  </div>
                </div>

                <!-- Custom Emails Input -->
                <div v-if="form.targetAudience === 'specific'" class="mt-6 animate-modal-in">
                  <p class="text-[11px] text-gray-500 mb-2 font-serif">Manual Email Entry (comma separated)</p>
                  <textarea 
                    v-model="form.customEmailsRaw" 
                    placeholder="example@mail.com, another@mail.com, ..."
                    rows="4"
                    class="w-full bg-gray-50 border-none rounded-xl px-5 py-4 text-sm text-gray-900 focus:ring-1 focus:ring-gray-200 outline-none transition-all placeholder:text-gray-400 font-serif resize-none"
                  ></textarea>
                </div>
              </div>

              <!-- Schedule -->
              <div class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <h3 class="text-sm font-serif text-gray-900 mb-6">Schedule</h3>
                <div class="relative" ref="scheduleDropdown">
                  <div @click="scheduleOpen = !scheduleOpen" class="w-full bg-gray-50 rounded-xl px-5 py-3 cursor-pointer flex items-center justify-between border border-transparent hover:border-gray-200 transition-colors">
                    <div>
                      <p class="text-[9px] text-gray-400 font-serif">Send Time</p>
                      <p class="text-sm font-serif text-gray-900 mt-0.5">{{ form.scheduleLabel }}</p>
                    </div>
                    <Icon name="lucide:chevron-down" class="w-4 h-4 text-gray-400 transition-transform" :class="{'rotate-180': scheduleOpen}" />
                  </div>
                  
                  <!-- Dropdown List -->
                  <div v-if="scheduleOpen" class="absolute left-0 right-0 top-[calc(100%+8px)] bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-2">
                     <div class="px-4 pb-2 pt-1 border-b border-gray-50 mb-2">
                       <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-emerald-500 rounded-lg transition-all">
                          <Icon name="lucide:search" class="w-4 h-4 text-gray-300" />
                          <input type="text" placeholder="Search..." class="bg-transparent border-none text-[11px] font-serif w-full outline-none placeholder:text-gray-300 text-gray-700" />
                       </div>
                    </div>
                    <div @click="selectSchedule('now', 'Send Immediately')" class="px-5 py-3 text-xs font-serif text-gray-700 hover:bg-gray-50 cursor-pointer">Send Immediately</div>
                    <div @click="selectSchedule('future', 'Schedule for Future')" class="px-5 py-3 text-xs font-serif text-gray-700 hover:bg-gray-50 cursor-pointer">Schedule for Future</div>
                    <div @click="selectSchedule('recurring', 'Recurring (Cron)')" class="px-5 py-3 text-xs font-serif text-gray-700 hover:bg-gray-50 cursor-pointer">Recurring (Cron)</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Footer -->
          <div class="px-10 py-6 border-t border-gray-100 bg-white shrink-0 flex items-center justify-end gap-6">
            <button @click="$emit('close')" class="text-sm text-gray-500 font-serif hover:text-gray-900 transition-colors">Cancel</button>
            <button 
              @click="handleSend" 
              :disabled="sending"
              class="bg-black text-white px-8 py-3 rounded-xl font-serif text-sm hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {{ sending ? 'Authorizing...' : (mode === 'edit' ? 'Resend Campaign' : 'Create Campaign') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { marketing_api } from '@/api_factory/modules/marketing'
import { useCustomToast } from '@/composables/core/useCustomToast'

const props = defineProps<{ 
  show: boolean, 
  campaign?: any, 
  mode?: 'create' | 'edit' 
}>()
const emit = defineEmits(['close', 'success'])
const { showToast } = useCustomToast()

const sending = ref(false)
const audienceOpen = ref(false)
const scheduleOpen = ref(false)
const audienceDropdown = ref<HTMLElement>()
const scheduleDropdown = ref<HTMLElement>()

const form = reactive({
  title: '',
  subject: '',
  previewText: '',
  bannerUrl: '',
  content: '',
  targetAudience: 'all',
  targetAudienceLabel: 'All Clients',
  customEmailsRaw: '',
  schedule: 'now',
  scheduleLabel: 'Send Immediately'
})

function selectAudience(val: string, label: string) {
  form.targetAudience = val
  form.targetAudienceLabel = label
  audienceOpen.value = false
}

function selectSchedule(val: string, label: string) {
  form.schedule = val
  form.scheduleLabel = label
  scheduleOpen.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  if (audienceDropdown.value && !audienceDropdown.value.contains(e.target as Node)) {
    audienceOpen.value = false
  }
  if (scheduleDropdown.value && !scheduleDropdown.value.contains(e.target as Node)) {
    scheduleOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  if (props.campaign && props.mode !== 'create') {
    form.title = props.campaign.title || ''
    form.subject = props.campaign.subject || ''
    form.previewText = props.campaign.previewText || ''
    form.bannerUrl = props.campaign.bannerUrl || ''
    form.content = props.campaign.content || ''
    
    const audiences: Record<string, string> = {
      'all': 'All Clients',
      'merchants': 'Merchants',
      'partners': 'Partners',
      'customers': 'Customers'
    }
    form.targetAudience = props.campaign.targetAudience || 'all'
    form.targetAudienceLabel = audiences[form.targetAudience] || 'All Clients'
  }
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

async function handleSend() {
  if (!form.title || !form.subject || !form.content) {
    return showToast({ title: 'Missing Information', message: 'Campaign name, subject, and content are required.', toastType: 'error' })
  }

  sending.value = true
  try {
    await marketing_api.sendCampaign({
      title: form.title,
      subject: form.subject,
      previewText: form.previewText,
      bannerUrl: form.bannerUrl,
      content: form.content,
      targetAudience: form.targetAudience === 'specific' ? 'custom' : form.targetAudience,
      customEmails: form.targetAudience === 'specific' ? form.customEmailsRaw.split(',').map(e => e.trim()).filter(e => e) : []
    })
    showToast({ title: 'Campaign Created', message: 'Campaign successfully dispatched.', toastType: 'success' })
    emit('success')
    emit('close')
  } catch (e: any) {
    showToast({ title: 'Error', message: e.message || 'Failed to dispatch campaign.', toastType: 'error' })
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.animate-modal-in { animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes modalIn { from { opacity: 0; transform: scale(0.98) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }

.font-serif {
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
}
</style>
