<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#033958]/10 backdrop-blur-md">
        <div class="absolute inset-0 bg-black/5" @click="$emit('close')"></div>
        <div class="relative bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] shadow-[0_40px_100px_-20px_rgba(3,57,88,0.2)] animate-modal-in border border-white overflow-hidden flex flex-col">
          <!-- Decoration -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-amber-100/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-[#033958]/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <!-- Header -->
          <div class="px-10 py-8 flex items-center justify-between bg-white/80 backdrop-blur-md shrink-0 border-b border-gray-50 relative z-10">
            <div class="flex items-center gap-5">
              <div class="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100/50 shadow-inner">
                <Icon name="lucide:sparkles" class="w-7 h-7" />
              </div>
              <div>
                <h2 class="text-2xl font-black text-gray-900 tracking-tight">{{ isEdit ? 'Refine' : 'New' }} Promotion</h2>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-0.5">Craft high-impact storefront offers</p>
              </div>
            </div>
            <button @click="$emit('close')" class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-white hover:text-red-500 hover:shadow-2xl transition-all border border-gray-100 hover:rotate-90">
              <Icon name="lucide:x" class="w-6 h-6" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-10 bg-gray-50/20 style-scrollbar scroll-smooth">
            <form @submit.prevent="handleSubmit" class="max-w-4xl mx-auto space-y-10">
              
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <!-- Visuals -->
                <div class="lg:col-span-5 space-y-8">
                  <div class="space-y-4">
                    <label class="text-[10px] font-black text-[#033958] uppercase tracking-[0.2em] ml-2">Promo Visual</label>
                    <div class="aspect-square rounded-[2.5rem] overflow-hidden bg-white border-4 border-white shadow-2xl relative group">
                      <CoreImageUploader v-model="form.image" folder="promotions" />
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                  </div>

                  <div class="bg-white rounded-[2rem] p-6 border border-gray-100/50 shadow-sm space-y-6">
                    <div class="space-y-2">
                        <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Magnitude (%)</label>
                        <div class="relative">
                            <input v-model.number="form.discountPercentage" type="number" placeholder="0" class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-amber-500/5 transition-all" />
                            <Icon name="lucide:percent" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 w-3.5 h-3.5" />
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Badge Tag</label>
                        <input v-model="form.badgeText" placeholder="e.g. LIMITED" class="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:ring-4 focus:ring-amber-500/5 transition-all" />
                    </div>
                  </div>
                </div>

                <!-- Fields -->
                <div class="lg:col-span-7 space-y-8">
                  <div class="space-y-3">
                    <label class="text-[10px] font-black text-[#033958] uppercase tracking-[0.2em] ml-2">Headline</label>
                    <input v-model="form.title" required placeholder="Catchy title..." class="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 text-lg font-black text-gray-900 focus:border-amber-200 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all shadow-sm" />
                  </div>

                  <div class="space-y-3">
                    <SelectInput 
                      v-model="form.type"
                      label="Promotion Category"
                      :options="[
                        { label: 'Flash Sale', value: 'sale' },
                        { label: 'Gifting Hub', value: 'gifting' },
                        { label: 'Holiday Special', value: 'holiday' },
                        { label: 'Limited Edition', value: 'special' },
                        { label: 'New Arrival', value: 'new_arrival' }
                      ]"
                    />
                  </div>

                  <div class="space-y-3">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Story Details</label>
                    <div class="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white min-h-[300px]">
                      <CoreRichTextEditor v-model="form.description" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between p-8 bg-amber-50/50 rounded-[2.5rem] border border-amber-100/50">
                 <div class="flex items-center gap-4">
                    <div :class="form.isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-200 text-gray-400'" class="w-10 h-10 rounded-xl flex items-center justify-center transition-all">
                      <Icon :name="form.isActive ? 'lucide:zap' : 'lucide:zap-off'" class="w-5 h-5" />
                    </div>
                    <div>
                      <p class="text-[10px] font-black text-gray-900 uppercase tracking-widest">Visibility</p>
                      <p class="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{{ form.isActive ? 'Visible to customers' : 'Hidden from shop' }}</p>
                    </div>
                 </div>
                 <button 
                  type="button"
                  @click="form.isActive = !form.isActive"
                  :class="form.isActive ? 'bg-emerald-500' : 'bg-gray-300'"
                  class="w-14 h-8 rounded-full relative transition-all duration-300 shadow-inner"
                >
                  <div :class="form.isActive ? 'translate-x-[26px]' : 'translate-x-1'" class="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center">
                    <Icon :name="form.isActive ? 'lucide:check' : 'lucide:x'" size="10" :class="form.isActive ? 'text-emerald-500' : 'text-gray-300'" />
                  </div>
                </button>
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div class="px-10 py-8 border-t border-gray-50 bg-white flex items-center justify-between shrink-0 relative z-10">
            <button @click="$emit('close')" class="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors">Discard</button>
            <button 
              @click="handleSubmit" 
              :disabled="saving"
              class="relative bg-[#033958] hover:bg-[#022f42] text-white px-12 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all disabled:opacity-50 shadow-2xl shadow-[#033958]/20 flex items-center gap-3 group active:scale-95 overflow-hidden"
            >
              <Icon v-if="saving" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
              <span class="relative">{{ saving ? 'Syncing...' : (isEdit ? 'Update Promo' : 'Launch Promo') }}</span>
              <Icon v-if="!saving" name="lucide:arrow-right" class="w-5 h-5 group-hover:translate-x-1 duration-300 text-amber-300" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'

const props = defineProps<{
  show: boolean
  promoData?: any
  saving?: boolean
}>()

const emit = defineEmits(['close', 'save'])

const isEdit = computed(() => !!props.promoData?._id)

const form = reactive({
  title: '',
  description: '',
  image: '',
  type: 'sale',
  discountPercentage: 0,
  badgeText: '',
  isActive: true
})

watch(() => props.promoData, (val) => {
  if (val) {
    form.title = val.title || ''
    form.description = val.description || ''
    form.image = val.image || ''
    form.type = val.type || 'sale'
    form.discountPercentage = val.discountPercentage || 0
    form.badgeText = val.badgeText || ''
    form.isActive = val.isActive ?? true
  } else {
    form.title = ''
    form.description = ''
    form.image = ''
    form.type = 'sale'
    form.discountPercentage = 0
    form.badgeText = ''
    form.isActive = true
  }
}, { immediate: true })

function handleSubmit() {
  emit('save', { ...form })
}
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.5s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.animate-modal-in { animation: modalZoom 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes modalZoom { from { opacity: 0; transform: scale(0.98) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }

.style-scrollbar::-webkit-scrollbar { width: 4px; }
.style-scrollbar::-webkit-scrollbar-track { background: transparent; }
.style-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.style-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
