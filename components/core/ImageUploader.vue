<template>
  <div class="space-y-2">
    <div 
      class="group relative w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 hover:bg-white hover:border-[#033958] hover:shadow-2xl hover:shadow-[#033958]/10 transition-all overflow-hidden cursor-pointer"
      :class="{ '!border-emerald-400 !bg-emerald-50': uploading, '!border-[#033958] !bg-white': modelValue }"
      @click="fileInput?.click()"
      @dragover.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @drop.prevent="handleDrop"
    >
      <!-- Preview Image -->
      <img v-if="modelValue && !uploading" :src="modelValue" class="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
      <div v-if="modelValue && !uploading" class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col items-center gap-4 text-center">
        <div v-if="uploading" class="w-16 h-16 rounded-3xl bg-emerald-100 flex items-center justify-center animate-pulse">
          <Icon name="lucide:loader-2" class="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
        <div v-else :class="['w-16 h-16 rounded-3xl flex items-center justify-center transition-all', modelValue ? 'bg-white/20 text-white backdrop-blur-md' : 'bg-white text-gray-400 shadow-xl group-hover:scale-110']">
          <Icon :name="modelValue ? 'lucide:refresh-cw' : 'lucide:image-plus'" class="w-8 h-8" />
        </div>
        
        <div v-if="!uploading">
          <p :class="['font-black uppercase tracking-widest text-xs', modelValue ? 'text-white' : 'text-gray-900']">
            {{ modelValue ? 'Tap to change image' : 'Upload Featured Image' }}
          </p>
          <p :class="['text-[10px] font-bold mt-1', modelValue ? 'text-white/70' : 'text-gray-400']">
            DRAG & DROP OR TAP TO BROWSE (JPG, PNG, WEBP)
          </p>
        </div>
        <p v-else class="text-emerald-700 font-black uppercase tracking-[0.2em] text-[10px]">Uploading to server...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="absolute bottom-4 left-4 right-4 bg-red-500 text-white py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center animate-shake">
        {{ error }}
      </div>
    </div>
    <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileSelect" />
  </div>
</template>

<script setup lang="ts">
import { upload_api } from '@/api_factory/modules/upload'
import { useCustomToast } from '@/composables/core/useCustomToast'

const props = defineProps<{
  modelValue: string
  folder?: string
}>()

const emit = defineEmits(['update:modelValue'])
const { showToast } = useCustomToast()

const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const dragOver = ref(false)
const error = ref('')

async function uploadFile(file: File) {
  if (!file.type.startsWith('image/')) {
    error.value = 'PLEASE UPLOAD AN IMAGE FILE'
    return
  }

  error.value = ''
  uploading.value = true
  try {
    const { data } = await upload_api.uploadImage(file, props.folder || 'marketing')
    const url = data?.data?.url || data?.url
    if (url) {
      emit('update:modelValue', url)
      showToast({ title: 'Upload Success', message: 'Image synchronized successfully.', toastType: 'success' })
    }
  } catch (err: any) {
    showToast({ title: 'Upload Failed', message: err.message || 'Error uploading file', toastType: 'error' })
  } finally {
    uploading.value = false
  }
}

function handleFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) uploadFile(file)
}

function handleDrop(e: DragEvent) {
  dragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) uploadFile(file)
}
</script>

<style scoped>
.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
