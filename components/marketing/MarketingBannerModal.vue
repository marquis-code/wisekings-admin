<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#033958]/10 backdrop-blur-md">
        <div class="absolute inset-0 bg-black/5" @click="$emit('close')"></div>
        <div class="relative bg-white rounded-[3rem] w-full max-w-2xl max-h-[85vh] shadow-[0_40px_100px_-20px_rgba(3,57,88,0.2)] animate-modal-in border border-white overflow-hidden flex flex-col">
          <!-- Decoration -->
          <div class="absolute top-0 right-0 w-48 h-48 bg-amber-100/30 rounded-full blur-3xl -mr-24 -mt-24"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-[#033958]/5 rounded-full blur-3xl -ml-24 -mb-24"></div>

          <!-- Header -->
          <div class="px-8 py-6 flex items-center justify-between bg-white/80 backdrop-blur-md shrink-0 border-b border-gray-50 relative z-10">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100/50 shadow-inner">
                <Icon name="lucide:image" class="w-6 h-6" />
              </div>
              <div>
                <h2 class="text-xl font-black text-gray-900 tracking-tight">{{ isEdit ? 'Update' : 'Creative' }} Banner</h2>
                <p class="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-0.5">Define your storefront visuals</p>
              </div>
            </div>
            <button @click="$emit('close')" class="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-white hover:text-red-500 hover:shadow-2xl transition-all border border-gray-100 hover:rotate-90">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-10 bg-gray-50/20 style-scrollbar scroll-smooth">
            <form @submit.prevent="handleSubmit" class="space-y-8">
              <!-- Visual -->
              <div class="space-y-4">
                <div class="flex items-center justify-between px-2">
                    <label class="text-[10px] font-black text-[#033958] uppercase tracking-[0.2em]">Visual Asset</label>
                    <span class="text-[9px] font-bold text-gray-400">1200x600 recommended</span>
                </div>
                <div class="aspect-[21/9] rounded-[2.5rem] overflow-hidden bg-white border-4 border-white shadow-2xl relative group">
                  <CoreImageUploader v-model="form.image" folder="banners" />
                  <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>

              <!-- Content -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Internal Title</label>
                  <input v-model="form.title" required placeholder="e.g. Summer Blitz" class="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:border-amber-200 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all shadow-sm" />
                </div>

                <div class="space-y-2">
                  <SelectInput 
                    v-model="form.position"
                    label="Slot Position"
                    :options="[
                      { label: 'Home Hero', value: 'home' },
                      { label: 'Category Hub', value: 'category' },
                      { label: 'Hot Offers', value: 'offers' },
                      { label: 'Site Global', value: 'global' }
                    ]"
                  />
                </div>
              </div>

              <div class="space-y-2">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Click Destination</label>
                  <div class="relative">
                    <Icon name="lucide:arrow-up-right" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                    <input v-model="form.link" placeholder="/products/category-name" class="w-full bg-white border border-gray-100 rounded-2xl pl-11 pr-5 py-4 text-sm font-bold text-gray-900 focus:border-amber-200 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all shadow-sm" />
                  </div>
              </div>

              <!-- Toggle -->
              <div class="flex items-center justify-between p-6 bg-amber-50/50 rounded-[2rem] border border-amber-100/50 shadow-sm transition-all">
                 <div class="flex items-center gap-4">
                    <div :class="form.isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-200 text-gray-400'" class="w-10 h-10 rounded-xl flex items-center justify-center transition-all">
                      <Icon :name="form.isActive ? 'lucide:zap' : 'lucide:zap-off'" class="w-5 h-5" />
                    </div>
                    <div>
                      <p class="text-[10px] font-black text-gray-900 uppercase tracking-widest">Visibility state</p>
                      <p class="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{{ form.isActive ? 'Active & Visible' : 'Saved Hidden' }}</p>
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
          <div class="px-8 py-6 border-t border-gray-50 bg-white flex items-center justify-between shrink-0 relative z-10">
            <button @click="$emit('close')" class="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors">Discard</button>
            <button 
              @click="handleSubmit" 
              :disabled="saving"
              class="relative bg-[#033958] hover:bg-[#022f42] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all disabled:opacity-50 shadow-2xl shadow-[#033958]/20 flex items-center gap-3 group active:scale-95 overflow-hidden"
            >
              <Icon v-if="saving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <span class="relative">{{ saving ? 'Syncing...' : (isEdit ? 'Update Asset' : 'Deploy Banner') }}</span>
              <Icon v-if="!saving" name="lucide:arrow-right" class="w-4 h-4 group-hover:translate-x-1 duration-300 text-amber-300" />
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
  bannerData?: any
  saving?: boolean
}>()

const emit = defineEmits(['close', 'save'])

const isEdit = computed(() => !!props.bannerData?._id)

const form = reactive({
  title: '',
  image: '',
  link: '',
  position: 'home',
  isActive: true
})

watch(() => props.bannerData, (val) => {
  if (val) {
    form.title = val.title || ''
    form.image = val.image || ''
    form.link = val.link || ''
    form.position = val.position || 'home'
    form.isActive = val.isActive ?? true
  } else {
    form.title = ''
    form.image = ''
    form.link = ''
    form.position = 'home'
    form.isActive = true
  }
}, { immediate: true })

function handleSubmit() {
  emit('save', { ...form })
}
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.4s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.animate-modal-in { animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes modalIn { from { opacity: 0; transform: scale(0.96) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }

.style-scrollbar::-webkit-scrollbar { width: 4px; }
.style-scrollbar::-webkit-scrollbar-track { background: transparent; }
.style-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.style-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
