<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#033958]/10 backdrop-blur-md">
        <div class="absolute inset-0 bg-black/5" @click="$emit('close')"></div>
        <div class="relative bg-white rounded-[3.5rem] w-full max-w-6xl h-[92vh] flex flex-col shadow-[0_40px_100px_-20px_rgba(3,57,88,0.3)] animate-modal-in border border-white overflow-hidden">
          <!-- Decoration -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-amber-100/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <!-- Header -->
          <div class="px-12 py-10 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md relative z-20">
            <div class="flex items-center gap-5">
              <div class="w-16 h-16 rounded-[2rem] bg-amber-50 flex items-center justify-center text-amber-600 border-2 border-amber-100 shadow-inner">
                <Icon name="lucide:sparkles" class="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h2 class="text-3xl font-black text-gray-900 tracking-tight">{{ isEdit ? 'Refine' : 'Design' }} Template</h2>
                <div class="flex items-center gap-2 mt-1">
                  <span class="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded-full">Creative Studio</span>
                  <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Craft memorable experiences</p>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-6">
              <div class="flex bg-gray-100/80 p-1.5 rounded-[1.8rem] border border-gray-200">
                <button 
                  @click="viewMode = 'edit'" 
                  :class="['px-8 py-3 rounded-[1.4rem] text-[10px] font-black uppercase tracking-widest transition-all', viewMode === 'edit' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600']"
                >Canvas</button>
                <button 
                  @click="viewMode = 'preview'" 
                  :class="['px-8 py-3 rounded-[1.4rem] text-[10px] font-black uppercase tracking-widest transition-all', viewMode === 'preview' ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-gray-600']"
                >Preview</button>
              </div>
              <button @click="$emit('close')" class="w-14 h-14 rounded-[2rem] bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-white hover:text-red-500 hover:shadow-2xl transition-all border border-gray-100 hover:border-red-100 active:scale-95">
                <Icon name="lucide:x" class="w-7 h-7" />
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="flex-1 flex overflow-hidden bg-gray-50/30">
            <!-- Sidebar: Library -->
            <div v-show="viewMode === 'edit'" class="w-80 bg-white border-r border-gray-100 flex flex-col relative z-10 shadow-xl shadow-gray-200/20">
               <div class="p-8 border-b border-gray-50">
                  <h3 class="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-1">
                    <Icon name="lucide:library" class="w-4 h-4 text-amber-500" />
                    Template Library
                  </h3>
                  <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Choose a base to start with</p>
               </div>
               <div class="flex-1 overflow-y-auto p-6 space-y-4 style-scrollbar">
                  <button 
                    v-for="sample in samples" 
                    :key="sample.id"
                    @click="loadSample(sample)"
                    class="w-full text-left p-4 rounded-3xl border-2 border-transparent hover:border-amber-200 hover:bg-amber-50/50 transition-all group active:scale-95"
                  >
                    <p class="text-xs font-black text-gray-800 group-hover:text-amber-700 transition-colors uppercase tracking-tight">{{ sample.label }}</p>
                    <p class="text-[10px] text-gray-400 font-medium mt-1 line-clamp-1 italic">{{ sample.subject }}</p>
                  </button>
               </div>
               <div class="p-8 bg-gray-50/50 border-t border-gray-100">
                  <div class="p-4 bg-white rounded-2xl border border-gray-100">
                     <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Editor Tip</p>
                     <p class="text-[10px] text-gray-500 leading-relaxed font-medium">Use <code>{&#123; name &#125;}</code> to personalize messages automatically.</p>
                  </div>
               </div>
            </div>

            <!-- Main Canvas -->
            <div class="flex-1 flex flex-col overflow-hidden relative">
              <div v-if="viewMode === 'edit'" class="h-full overflow-y-auto p-12 style-scrollbar">
                <div class="max-w-4xl mx-auto space-y-10 pb-20">
                   <!-- Form Cards -->
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div class="space-y-3">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Internal Identifier</label>
                        <input v-model="form.name" type="text" placeholder="e.g. WELCOME_OTP" class="w-full bg-white border-2 border-gray-50 rounded-[1.8rem] px-6 py-4.5 font-bold text-gray-900 focus:border-amber-200 focus:bg-white focus:ring-4 focus:ring-amber-500/5 outline-none transition-all shadow-sm" />
                     </div>
                     <div class="space-y-3">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email Subject</label>
                        <input v-model="form.subject" type="text" placeholder="Something catchy!" class="w-full bg-white border-2 border-gray-50 rounded-[1.8rem] px-6 py-4.5 font-bold text-gray-900 focus:border-amber-200 focus:bg-white focus:ring-4 focus:ring-amber-500/5 outline-none transition-all shadow-sm" />
                     </div>
                   </div>

                   <div class="space-y-4">
                      <div class="flex items-center justify-between px-2">
                        <label class="text-xs font-black text-[#033958] uppercase tracking-[0.2em]">Visual Message Builder</label>
                        <div class="flex items-center gap-3">
                          <button @click="form.isActive = !form.isActive" :class="form.isActive ? 'text-emerald-500 bg-emerald-50' : 'text-gray-400 bg-gray-100'" class="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-current transition-all">
                            {{ form.isActive ? 'Live' : 'Draft' }}
                          </button>
                        </div>
                      </div>
                      <div class="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100 min-h-[500px]">
                        <CoreRichTextEditor v-model="form.content" />
                      </div>
                   </div>

                   <!-- Variables Section -->
                   <div class="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-6">
                      <div class="flex items-center justify-between">
                         <h4 class="text-xs font-black uppercase tracking-widest text-gray-900 italic">Injectable Variables</h4>
                         <span class="text-[10px] text-gray-400 font-bold">Comma separated items</span>
                      </div>
                      <input v-model="variablesInput" type="text" placeholder="name, otpCode, invoiceNo" class="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-5 font-bold text-[#033958] focus:ring-2 focus:ring-[#033958]/5 outline-none transition-all shadow-inner" />
                   </div>
                </div>
              </div>

              <!-- Preview: Phone/Tablet Mockup -->
              <div v-show="viewMode === 'preview'" class="h-full bg-[#f8fafc] p-12 overflow-y-auto style-scrollbar flex justify-center">
                 <div class="w-full max-w-2xl">
                    <div class="bg-white rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden flex flex-col min-h-[700px]">
                        <div class="bg-gray-50 p-8 border-b border-gray-100 flex items-center justify-between">
                           <div class="flex items-center gap-4">
                              <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-black">WK</div>
                              <div>
                                 <p class="text-xs font-black text-gray-900 tracking-tight">{{ form.subject || 'Preview Subject' }}</p>
                                 <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest">To: customer@example.com</p>
                              </div>
                           </div>
                           <div class="flex gap-2">
                              <div class="w-3 h-3 rounded-full bg-gray-200"></div>
                              <div class="w-3 h-3 rounded-full bg-gray-200"></div>
                           </div>
                        </div>
                        <div class="flex-1 p-12 bg-white">
                           <div class="prose prose-sm max-w-none prose-amber" v-html="form.content || '<div class=\'py-32 text-center text-gray-300 italic\'>Write something magical to see it here...</div>'"></div>
                        </div>
                        <div class="bg-gray-50 p-8 text-center border-t border-gray-100">
                           <p class="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic">Delivered with love by WiseKings</p>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-12 py-8 bg-white border-t border-gray-100 flex items-center justify-between relative z-20 shrink-0">
            <button @click="$emit('close')" class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-red-500 transition-colors py-2 px-4 rounded-xl hover:bg-red-50">Cancel Changes</button>
            <button 
              @click="handleSave" 
              :disabled="saving"
              class="relative bg-[#033958] hover:bg-[#022f42] text-white px-16 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all disabled:opacity-50 shadow-2xl shadow-[#033958]/30 flex items-center gap-4 group active:scale-95 overflow-hidden"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>
              <Icon v-if="saving" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
              <span class="relative">{{ saving ? 'Syncing...' : (isEdit ? 'Save Changes' : 'Deploy Template') }}</span>
              <Icon v-if="!saving" name="lucide:arrow-right" class="w-5 h-5 group-hover:translate-x-1 duration-300 text-amber-300" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { email_templates_api } from '@/api_factory/modules/email-templates'
import { useCustomToast } from '@/composables/core/useCustomToast'

const props = defineProps<{
  show: boolean
  templateData?: any
}>()

const emit = defineEmits(['close', 'success'])
const { showToast } = useCustomToast()

const isEdit = computed(() => !!props.templateData?._id)
const saving = ref(false)
const viewMode = ref<'edit' | 'preview'>('edit')

const form = reactive({
  name: '',
  subject: '',
  content: '',
  variables: [] as string[],
  isActive: true
})

const variablesInput = ref('')

const samples = [
  {
    id: 'welcome_premium',
    label: '✨ Premium Welcome',
    name: 'WELCOME_PACK_PREMIUM',
    subject: 'Welcome to the WiseKings Inner Circle!',
    variables: ['name', 'dashboardUrl'],
    content: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 24px; overflow: hidden; border: 1px solid #f1f5f9; box-shadow: 0 20px 50px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #033958 0%, #055a8c 100%); padding: 60px 40px; text-align: center;">
          <h1 style="color: #fbbf24; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px;">The Journey Begins</h1>
          <p style="color: rgba(255,255,255,0.7); margin-top: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 2px; font-size: 11px;">Welcome, {{name}}</p>
        </div>
        <div style="padding: 40px 40px 60px;">
          <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 30px;">We are thrilled to have you join our community of elite snack connoisseurs. At WiseKings, we don't just deliver food; we curate moments of pure joy.</p>
          <div style="background: #f8fafc; border-radius: 20px; padding: 30px; border: 1px solid #f1f5f9; margin-bottom: 40px;">
            <p style="font-size: 14px; font-weight: 600; color: #033958; margin: 0 0 10px;">Membership Perks:</p>
            <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #64748b; line-height: 2;">
              <li>Early access to limited edition drops</li>
              <li>Exclusive global shipping rates</li>
              <li>Personalized snack recommendations</li>
            </ul>
          </div>
          <a href="{{dashboardUrl}}" style="display: block; background: #fbbf24; color: #033958; text-align: center; padding: 20px; border-radius: 16px; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; font-size: 14px; box-shadow: 0 10px 20px rgba(251,191,36,0.3);">Access My Dashboard</a>
        </div>
        <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">WiseKings HQ • Curating Excellence</p>
        </div>
      </div>
    `
  },
  {
    id: 'otp_creative',
    label: '🔐 Modern OTP',
    name: 'OTP_VERIFICATION_MODERN',
    subject: 'Your Access Code for WiseKings',
    variables: ['name', 'otpCode'],
    content: `
      <div style="max-width: 500px; margin: 0 auto; text-align: center; font-family: 'Inter', sans-serif; padding: 40px;">
        <div style="display: inline-block; width: 64px; height: 64px; background: #fffbeb; border-radius: 20px; border: 2px solid #fef3c7; margin-bottom: 30px; line-height: 64px; font-size: 32px;">🛡️</div>
        <h2 style="font-size: 28px; font-weight: 900; color: #1e293b; margin-bottom: 10px; letter-spacing: -0.5px;">Security Check</h2>
        <p style="color: #64748b; font-size: 15px; margin-bottom: 40px; line-height: 1.5;">Hi {{name}}, just a quick step to keep your account safe. Use this code to continue:</p>
        <div style="background: #f8fafc; border-radius: 24px; padding: 30px; border: 2px dashed #e2e8f0;">
          <span style="display: block; font-size: 40px; font-weight: 900; color: #033958; letter-spacing: 10px; text-shadow: 2px 2px 0 #fff;">{{otpCode}}</span>
          <p style="color: #94a3b8; font-size: 11px; margin-top: 15px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Expiring in 10 minutes</p>
        </div>
        <p style="color: #cbd5e1; font-size: 12px; margin-top: 40px;">Didn't request this? Please ignore this email or contact security.</p>
      </div>
    `
  },
  {
    id: 'order_celeb',
    label: '🎉 Order Celebration',
    name: 'ORDER_CONFIRMATION_CELEB',
    subject: 'Good news! We are preparing your order!',
    variables: ['name', 'orderNo', 'items'],
    content: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 40px;">
          <h2 style="font-size: 48px; margin: 0;">🎊</h2>
          <h1 style="font-weight: 900; color: #033958; margin: 20px 0 10px; letter-spacing: -1px;">Orders Up!</h1>
          <p style="color: #64748b; font-size: 18px; font-weight: 500;">Order: #{{orderNo}}</p>
        </div>
        <div style="background: #fff; border: 2px solid #f1f5f9; border-radius: 40px; padding: 40px; margin-bottom: 30px;">
          <p style="font-size: 16px; line-height: 1.6; color: #475569;">Hi {{name}}, your order has successfully entered the WiseKings kitchen! Our team is currently hand-picking your items to ensure peak freshness.</p>
          <div style="margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 30px;">
            <p style="font-size: 12px; font-weight: 900; color: #033958; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Order Summary</p>
            <div style="color: #64748b; font-size: 14px; line-height: 1.8;">{{items}}</div>
          </div>
        </div>
        <div style="text-align: center; padding: 20px;">
          <p style="color: #94a3b8; font-size: 12px;">Track your delivery in real-time from your account.</p>
        </div>
      </div>
    `
  }
]

function loadSample(sample: any) {
  if (confirm(`Load the "${sample.label}" sample? This will overwrite your current draft.`)) {
    form.name = sample.name
    form.subject = sample.subject
    form.content = sample.content
    form.variables = sample.variables
    variablesInput.value = sample.variables.join(', ')
    showToast({ title: 'Sample Loaded', message: 'You can now customize it.', toastType: 'success' })
  }
}

watch(() => props.templateData, (val) => {
  if (val) {
    form.name = val.name || ''
    form.subject = val.subject || ''
    form.content = val.content || ''
    form.variables = val.variables || []
    form.isActive = val.isActive ?? true
    variablesInput.value = (val.variables || []).join(', ')
  } else {
    // Reset to defaults or first sample?
    form.name = ''
    form.subject = ''
    form.content = ''
    form.variables = []
    form.isActive = true
    variablesInput.value = ''
  }
}, { immediate: true })

async function handleSave() {
  if (!form.name || !form.subject || !form.content) {
    showToast({ title: 'Wait', message: 'All fields are required.', toastType: 'error' })
    return
  }

  form.variables = variablesInput.value.split(',').map(v => v.trim()).filter(Boolean)
  
  saving.value = true
  try {
    if (isEdit.value) {
      await email_templates_api.update(props.templateData._id, form)
      showToast({ title: 'Updated', message: 'Email template synchronized.', toastType: 'success' })
    } else {
      await email_templates_api.create(form)
      showToast({ title: 'Success', message: 'New template deployed.', toastType: 'success' })
    }
    emit('success')
    emit('close')
  } catch (err: any) {
    showToast({ title: 'Error', message: err.message || 'Failed to save template', toastType: 'error' })
  } finally {
    saving.value = false
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
