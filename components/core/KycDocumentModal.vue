<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm" @click.self="$emit('close')">
        <Transition name="scale">
          <div v-if="show" class="bg-white w-full max-w-5xl h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100 animate-modal-in">
            <!-- Header -->
            <div class="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#033958]">
                  <Icon :name="getDocIcon(document?.documentType)" class="w-6 h-6" />
                </div>
                <div>
                  <h2 class="text-xl font-black text-gray-900 tracking-tight">{{ document?.documentLabel }}</h2>
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                    {{ document?.idNumber ? `ID: ${document.idNumber}` : 'Document Preview' }}
                  </p>
                </div>
              </div>
              <button @click="$emit('close')" class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-900 transition-all">
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>

            <!-- Preview Body -->
            <div class="flex-1 overflow-auto p-1 bg-gray-50 flex items-center justify-center relative">
              <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <Icon name="lucide:loader-2" class="w-10 h-10 animate-spin text-[#033958]/20" />
              </div>

              <!-- PDF Preview -->
              <iframe 
                v-if="isPdf" 
                :src="document?.documentUrl" 
                class="w-full h-full rounded-b-2xl"
                @load="loading = false"
              ></iframe>

              <!-- Image Preview -->
              <img 
                v-else
                :src="document?.documentUrl" 
                class="max-w-full max-h-full object-contain p-4 transition-all duration-700"
                :class="{ 'opacity-0 scale-95': loading, 'opacity-100 scale-100': !loading }"
                @load="loading = false"
              />
            </div>

            <!-- Footer / Actions -->
            <div class="px-8 py-6 border-t border-gray-100 bg-white shrink-0 flex items-center justify-between gap-6">
              <div class="flex items-center gap-3">
                <span :class="[
                  'px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border',
                  getBadgeClasses(document?.status)
                ]">
                  {{ document?.status }}
                </span>
                <span v-if="document?.submittedAt" class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Submitted {{ formatDate(document.submittedAt) }}
                </span>
              </div>

              <div class="flex items-center gap-3">
                <template v-if="document?.status === 'pending'">
                  <button 
                    @click="$emit('reject', document)"
                    class="h-11 px-6 flex items-center justify-center gap-2 rounded-xl bg-rose-50 text-rose-600 font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                  >
                    <Icon name="lucide:x-circle" class="w-4 h-4" /> Reject
                  </button>
                  <button 
                    @click="$emit('approve', document)"
                    class="h-11 px-6 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                  >
                    <Icon name="lucide:check-circle" class="w-4 h-4" /> Approve Document
                  </button>
                </template>
                <button 
                  v-else
                  @click="$emit('close')"
                  class="h-11 px-6 flex items-center justify-center gap-2 rounded-xl bg-gray-50 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-white hover:border-gray-200 border border-transparent transition-all"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  show: boolean
  document: any
}>()

const emit = defineEmits(['close', 'approve', 'reject'])

const loading = ref(true)

const isPdf = computed(() => {
  return props.document?.documentUrl?.toLowerCase().endsWith('.pdf')
})

watch(() => props.show, (val) => {
  if (val) loading.value = true
})

function getDocIcon(type: string) {
  if (!type) return 'lucide:file-text'
  if (type.includes('id') || type.includes('passport') || type.includes('license') || type.includes('pvc')) return 'lucide:id-card'
  if (type.includes('cac') || type.includes('cert') || type.includes('tin')) return 'lucide:building-2'
  if (type.includes('address') || type.includes('bill')) return 'lucide:home'
  return 'lucide:file-text'
}

function getBadgeClasses(status: string) {
  if (status === 'approved') return 'bg-emerald-50 text-emerald-600 border-emerald-100'
  if (status === 'pending') return 'bg-amber-50 text-amber-600 border-amber-100'
  if (status === 'rejected') return 'bg-rose-50 text-rose-600 border-rose-100'
  return 'bg-gray-50 text-gray-400 border-gray-100'
}

function formatDate(date: any) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.scale-enter-active, .scale-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}
.scale-enter-from, .scale-leave-to {
  transform: scale(0.95);
  opacity: 0;
}

.animate-modal-in {
  animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalIn {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
