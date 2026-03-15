<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#033958]/10 backdrop-blur-md">
        <div class="absolute inset-0 bg-black/5" @click="$emit('close')"></div>
        <div class="relative bg-white rounded-[3.5rem] w-full max-w-6xl h-[92vh] shadow-[0_40px_100px_-20px_rgba(3,57,88,0.3)] animate-modal-in border border-white overflow-hidden flex flex-col">
          <!-- Decoration -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-amber-100/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <!-- Header -->
          <div class="px-12 py-10 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md relative z-20 shrink-0">
            <div class="flex items-center gap-5">
              <div class="w-16 h-16 rounded-[2.2rem] bg-amber-50 flex items-center justify-center text-amber-600 border-2 border-amber-100 shadow-inner">
                <Icon name="lucide:trumpet" class="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h2 class="text-3xl font-black text-gray-900 tracking-tight">{{ mode === 'edit' ? 'Refine' : 'Compose' }} Campaign</h2>
                <div class="flex items-center gap-2 mt-1">
                   <span class="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded-full">Pro Marketer</span>
                   <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Broadcast your brand story</p>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-6">
              <button 
                @click="showSamples = !showSamples" 
                class="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-50 text-gray-900 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:shadow-xl transition-all border border-gray-100"
              >
                <Icon :name="showSamples ? 'lucide:layout-template' : 'lucide:sparkles'" class="w-4 h-4 text-amber-500" />
                {{ showSamples ? 'Hide Samples' : 'Browse Gallery' }}
              </button>
              <button @click="$emit('close')" class="w-14 h-14 rounded-[2rem] bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-white hover:text-red-500 hover:shadow-2xl transition-all border border-gray-100 rotate-0 hover:rotate-90">
                <Icon name="lucide:x" class="w-7 h-7" />
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-hidden flex bg-gray-50/30 relative">
            <!-- Left Sidebar: Sample Gallery -->
            <div :class="[showSamples ? 'w-96' : 'w-0 opacity-0']" class="bg-white border-r border-gray-100 transition-all duration-500 overflow-hidden flex flex-col shrink-0 relative z-10">
               <div class="p-8 border-b border-gray-50 overflow-hidden whitespace-nowrap">
                  <h3 class="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <Icon name="lucide:book-open" class="text-amber-500" />
                    Campaign Presets
                  </h3>
                  <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Pre-built high converting themes</p>
               </div>
               <div class="flex-1 overflow-y-auto p-6 space-y-6 style-scrollbar">
                  <div 
                    v-for="sample in campaignSamples" 
                    :key="sample.id"
                    @click="applySample(sample)"
                    class="group relative aspect-video rounded-[2rem] overflow-hidden border-2 border-transparent hover:border-amber-200 cursor-pointer shadow-sm bg-gray-100 transition-all active:scale-95"
                  >
                    <img :src="sample.previewImage" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div class="absolute bottom-4 left-5 right-5 text-white">
                      <p class="text-[11px] font-black uppercase tracking-widest">{{ sample.name }}</p>
                      <p class="text-[9px] text-gray-300 font-medium mt-1 uppercase">{{ sample.subject }}</p>
                    </div>
                  </div>
               </div>
            </div>

            <!-- Main Canvas -->
            <div class="flex-1 overflow-y-auto p-12 style-scrollbar scroll-smooth">
              <div class="max-w-5xl mx-auto space-y-12 pb-24">
                
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <!-- Meta Column -->
                  <div class="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div class="space-y-3">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Internal Title</label>
                        <input v-model="form.title" placeholder="e.g. Easter Special" class="w-full bg-white border-2 border-gray-50 rounded-[1.8rem] px-6 py-4.5 font-bold text-gray-900 focus:border-amber-200 focus:bg-white focus:ring-4 focus:ring-amber-500/5 outline-none transition-all shadow-sm" />
                     </div>
                     <div class="space-y-3">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Email Subject</label>
                        <input v-model="form.subject" placeholder="What they see first..." class="w-full bg-white border-2 border-gray-50 rounded-[1.8rem] px-6 py-4.5 font-bold text-gray-900 focus:border-amber-200 focus:bg-white focus:ring-4 focus:ring-amber-500/5 outline-none transition-all shadow-sm" />
                     </div>
                     <div class="space-y-3">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Inbox Preview</label>
                        <input v-model="form.previewText" placeholder="Short teaser text..." class="w-full bg-white border-2 border-gray-50 rounded-[1.8rem] px-6 py-4.5 font-bold text-gray-900 focus:border-amber-200 focus:bg-white focus:ring-4 focus:ring-amber-500/5 outline-none transition-all shadow-sm" />
                     </div>
                  </div>

                  <!-- Visual Content -->
                  <div class="lg:col-span-7 space-y-10">
                    <div class="space-y-4">
                       <div class="flex items-center justify-between px-2">
                         <label class="text-xs font-black text-[#033958] uppercase tracking-[0.2em]">Visual Message Builder</label>
                         <div class="flex items-center gap-2">
                           <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                           <span class="text-[9px] font-bold text-gray-400 uppercase">Live Designer</span>
                         </div>
                       </div>
                       <div class="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100 min-h-[500px]">
                         <CoreRichTextEditor v-model="form.content" />
                       </div>
                    </div>
                  </div>

                  <!-- Sidebar Config -->
                  <div class="lg:col-span-5 space-y-10">
                    <!-- Feature Image -->
                    <div class="space-y-5">
                       <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-2 italic">Feature Banner</label>
                       <div class="aspect-[16/9] rounded-[2.5rem] overflow-hidden bg-white border-4 border-white shadow-2xl relative group">
                          <CoreImageUploader v-model="form.bannerUrl" folder="campaigns" />
                       </div>
                    </div>

                    <!-- Audience Selection -->
                    <div class="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
                       <div class="space-y-6">
                          <div class="flex items-center gap-4">
                             <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                               <Icon name="lucide:users" class="w-5 h-5" />
                             </div>
                             <div>
                               <p class="text-[10px] font-black text-gray-900 uppercase tracking-widest">Audience Target</p>
                               <p class="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Who receives this?</p>
                             </div>
                          </div>
                          
                          <div class="relative" ref="audienceDropdown">
                            <div @click="audienceOpen = !audienceOpen" class="w-full bg-gray-50 rounded-2xl px-6 py-4 cursor-pointer flex items-center justify-between border-2 border-transparent hover:border-amber-100 transition-all">
                              <p class="text-xs font-black text-[#033958]">{{ form.targetAudienceLabel }}</p>
                              <Icon name="lucide:chevron-down" class="w-4 h-4 text-gray-400 transition-transform" :class="{'rotate-180': audienceOpen}" />
                            </div>
                            
                            <div v-if="audienceOpen" class="absolute left-0 right-0 top-[calc(100%+8px)] bg-white border border-gray-100 rounded-2xl shadow-2xl z-30 py-3 animate-modal-in overflow-hidden">
                              <div v-for="aud in audiencesList" :key="aud.val" @click="selectAudience(aud.val, aud.label)" class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-amber-50 hover:text-amber-700 cursor-pointer flex items-center justify-between transition-colors">
                                {{ aud.label }}
                                <Icon v-if="form.targetAudience === aud.val" name="lucide:check" size="14" class="text-emerald-500" />
                              </div>
                            </div>
                          </div>

                          <div v-if="form.targetAudience === 'specific'" class="animate-modal-in">
                            <textarea 
                              v-model="form.customEmailsRaw" 
                              placeholder="josh@example.com, sara@brand.com"
                              rows="4"
                              class="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-amber-500/10 outline-none transition-all placeholder:text-gray-300 shadow-inner"
                            ></textarea>
                          </div>
                       </div>

                       <!-- Logistics -->
                       <div class="space-y-6 pt-6 border-t border-gray-50">
                          <div class="flex items-center gap-4">
                             <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                               <Icon name="lucide:calendar-clock" class="w-5 h-5" />
                             </div>
                             <div>
                               <p class="text-[10px] font-black text-gray-900 uppercase tracking-widest">Blast Schedule</p>
                               <p class="text-[9px] text-gray-400 font-bold uppercase tracking-tight">When to dispatch?</p>
                             </div>
                          </div>

                          <div class="flex bg-gray-100/80 p-1.5 rounded-[1.8rem] border border-gray-200">
                            <button 
                              @click="form.scheduleType = 'now'" 
                              :class="['flex-1 py-3 rounded-[1.4rem] text-[9px] font-black uppercase tracking-widest transition-all', form.scheduleType === 'now' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600']"
                            >Right Now</button>
                            <button 
                              @click="form.scheduleType = 'future'" 
                              :class="['flex-1 py-3 rounded-[1.4rem] text-[9px] font-black uppercase tracking-widest transition-all', form.scheduleType === 'future' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600']"
                            >Schedule</button>
                          </div>

                          <div v-if="form.scheduleType === 'future'" class="space-y-6 animate-modal-in">
                            <div class="group">
                              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Dispatch Date & Time</label>
                              <input type="datetime-local" v-model="form.scheduledAt" class="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-black text-[#033958] focus:ring-2 focus:ring-amber-500/10 outline-none transition-all shadow-inner" />
                            </div>
                            
                            <div @click="form.isRecurring = !form.isRecurring" class="flex items-center justify-between p-5 bg-gray-50 rounded-2xl cursor-pointer hover:bg-amber-50/50 transition-colors group/rec">
                               <div class="flex items-center gap-3">
                                 <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                                    <Icon :name="form.isRecurring ? 'lucide:repeat' : 'lucide:calendar'" :class="form.isRecurring ? 'text-amber-500' : 'text-gray-300'" size="16" />
                                 </div>
                                 <span class="text-[10px] font-black text-gray-600 uppercase tracking-widest">Recurring Pattern</span>
                               </div>
                               <button :class="form.isRecurring ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'" class="w-10 h-6 rounded-full relative transition-all">
                                  <div :class="form.isRecurring ? 'translate-x-[18px]' : 'translate-x-1'" class="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform"></div>
                               </button>
                            </div>

                            <div v-if="form.isRecurring" class="animate-modal-in">
                              <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Cron Frequency</label>
                              <input v-model="form.cronExpression" placeholder="e.g. 0 0 * * *" class="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-xs font-black text-[#033958] focus:ring-2 focus:ring-amber-500/10 outline-none transition-all shadow-inner" />
                            </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-12 py-10 bg-white border-t border-gray-100 flex items-center justify-between relative z-20 shrink-0">
            <div class="flex items-center gap-4">
               <button @click="$emit('close')" class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-red-500 transition-colors py-2 px-4 rounded-xl hover:bg-red-50">Discard Campaign</button>
            </div>
            
            <button 
              @click="handleSend" 
              :disabled="sending"
              class="relative bg-[#033958] hover:bg-[#022f42] text-white px-16 py-5 rounded-[2.2rem] font-black uppercase tracking-[0.2em] text-xs transition-all disabled:opacity-50 shadow-2xl shadow-[#033958]/30 flex items-center gap-4 group active:scale-95 overflow-hidden"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>
              <Icon v-if="sending" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
              <span class="relative">{{ sending ? 'Transmitting...' : (form.scheduleType === 'future' ? 'Schedule Blast' : 'Launch Blast') }}</span>
              <Icon v-if="!sending" name="lucide:send" class="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 duration-300 text-amber-300" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
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
const showSamples = ref(false)
const audienceDropdown = ref<HTMLElement>()

const audiencesList = [
  { val: 'all', label: 'Entire Community' },
  { val: 'customers', label: 'Snack Enthusiasts' },
  { val: 'merchants', label: 'Store Owners' },
  { val: 'partners', label: 'Logistics Partners' },
  { val: 'specific', label: 'Handpicked Guests' }
]

const campaignSamples = [
  {
    id: 'welcome',
    name: 'Royalty Welcome',
    previewImage: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=800&auto=format&fit=crop',
    title: 'Welcome to WiseKings Community',
    subject: 'A Royal Invitation Awaits 👑',
    previewText: 'Discover artisan snacks curated for your unique palate.',
    bannerUrl: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=1200&auto=format&fit=crop',
    content: '<h1 style="color: #033958; font-family: serif;">Welcome to the Family!</h1><p>We are thrilled to have you here. At WiseKings, every snack is a story, and every box is a journey.</p><p>Explore our latest creations and enjoy a <strong>10% discount</strong> on your first royal order using code <strong>KINGS10</strong>.</p>'
  },
  {
    id: 'flash',
    name: 'Midnight Crave',
    previewImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop',
    title: 'Flash Sale: Midnight Treats',
    subject: '⚡️ 24 HOURS ONLY: Treat Yourself!',
    previewText: 'Don\'t let these deals slip away. Grab the best now.',
    bannerUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop',
    content: '<h1 style="color: #033958; font-family: serif;">The Crave is Real!</h1><p>For the next 24 hours, beauty meets flavor at half the price.</p><ul><li>50% Off Top-Tier Snacks</li><li>Free Luxury Packaging</li><li>Priority Shipping to your doorstep</li></ul>'
  },
  {
    id: 'season',
    name: 'Seasonal Magic',
    previewImage: 'https://images.unsplash.com/photo-1512909196624-3e5c3f11e69b?q=80&w=800&auto=format&fit=crop',
    title: 'Holiday Artisan Collection',
    subject: '🎁 Magic in Every Box. Limited Edition.',
    previewText: 'The most wonderful snacks of the year are here.',
    bannerUrl: 'https://images.unsplash.com/photo-1512909196624-3e5c3f11e69b?q=80&w=1200&auto=format&fit=crop',
    content: '<h1 style="color: #033958; font-family: serif;">Season of Giving</h1><p>Share the joy of artisan treats this season. Our holiday boxes are hand-packed with love and seasonal magic.</p><p>Limited quantities available. Secure yours today.</p>'
  }
]

const form = reactive({
  title: '',
  subject: '',
  previewText: '',
  bannerUrl: '',
  content: '',
  targetAudience: 'all',
  targetAudienceLabel: 'Entire Community',
  customEmailsRaw: '',
  scheduleType: 'now',
  scheduledAt: '',
  isRecurring: false,
  cronExpression: ''
})

function applySample(sample: any) {
  form.title = sample.title
  form.subject = sample.subject
  form.previewText = sample.previewText
  form.bannerUrl = sample.bannerUrl
  form.content = sample.content
  showToast({ title: 'Magic Applied', message: 'Campaign theme loaded.', toastType: 'success' })
}

function selectAudience(val: string, label: string) {
  form.targetAudience = val
  form.targetAudienceLabel = label
  audienceOpen.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  if (audienceDropdown.value && !audienceDropdown.value.contains(e.target as Node)) {
    audienceOpen.value = false
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
      'all': 'Entire Community',
      'merchants': 'Store Owners',
      'partners': 'Logistics Partners',
      'customers': 'Snack Enthusiasts',
      'specific': 'Handpicked Guests'
    }
    form.targetAudience = props.campaign.targetAudience || 'all'
    form.targetAudienceLabel = audiences[form.targetAudience] || 'Entire Community'

    if (props.campaign.scheduledAt) {
      form.scheduleType = 'future'
      form.scheduledAt = new Date(props.campaign.scheduledAt).toISOString().slice(0, 16)
      form.isRecurring = props.campaign.isRecurring || false
      form.cronExpression = props.campaign.cronExpression || ''
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

async function handleSend() {
  if (!form.title || !form.subject || !form.content) {
    return showToast({ title: 'Wait', message: 'All fields are essential.', toastType: 'error' })
  }

  if (form.scheduleType === 'future' && !form.scheduledAt) {
    return showToast({ title: 'Timeline Required', message: 'Select a dispatch time.', toastType: 'error' })
  }

  sending.value = true
  try {
    const payload = {
      title: form.title,
      subject: form.subject,
      previewText: form.previewText,
      bannerUrl: form.bannerUrl, // Explicitly verified
      content: form.content,
      targetAudience: form.targetAudience === 'specific' ? 'custom' : form.targetAudience,
      customEmails: form.targetAudience === 'specific' ? form.customEmailsRaw.split(',').map(e => e.trim()).filter(e => e) : [],
      scheduledAt: form.scheduleType === 'future' ? form.scheduledAt : undefined,
      isRecurring: form.isRecurring,
      cronExpression: form.isRecurring ? form.cronExpression : undefined
    }

    await marketing_api.sendCampaign(payload)
    showToast({ 
      title: form.scheduleType === 'future' ? 'Transmission Queued' : 'Blast Launched', 
      message: 'Campaign is being processed.', 
      toastType: 'success' 
    })
    emit('success')
    emit('close')
  } catch (e: any) {
    showToast({ title: 'Error', message: e.message || 'Failed to launch blast.', toastType: 'error' })
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.5s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.animate-modal-in { animation: modalZoom 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes modalZoom { from { opacity: 0; transform: scale(0.96) translateY(30px); } to { opacity: 1; transform: scale(1) translateY(0); } }

.style-scrollbar::-webkit-scrollbar { width: 6px; }
.style-scrollbar::-webkit-scrollbar-track { background: transparent; }
.style-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.style-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
