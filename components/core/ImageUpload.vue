<template>
  <div class="space-y-4">
    <label v-if="label" class="text-sm font-bold text-gray-700 ml-1">{{ label }}</label>
    
    <div 
      class="relative group"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <div 
        :class="[
          'border-2 border-dashed rounded-3xl p-8 transition-all duration-300 flex flex-col items-center justify-center min-h-[200px] cursor-pointer bg-gray-50/50 hover:bg-white hover:border-[#033958] hover:shadow-xl hover:shadow-[#033958]/5',
          isDragging ? 'border-[#033958] bg-white scale-[0.99]' : 'border-gray-200'
        ]"
        @click="triggerFileInput"
      >
        <div class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#033958]/10 transition-all duration-500">
          <Icon name="lucide:upload-cloud" class="w-8 h-8 text-gray-400 group-hover:text-[#033958]" />
        </div>
        
        <div class="text-center">
          <p class="text-sm font-bold text-gray-900 mb-1">
            {{ multiple ? 'Click to upload multiple images' : 'Click to upload an image' }}
          </p>
          <p class="text-xs text-gray-500 font-medium">PNG, JPG or WebP (Max. 5MB)</p>
        </div>

        <!-- Progress Overlay -->
        <div v-if="uploading" class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-3xl z-20">
          <div class="flex flex-col items-center">
            <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-[#033958] mb-2" />
            <span class="text-xs font-bold text-gray-900 tracking-wider">UPLOADING...</span>
          </div>
        </div>
      </div>
      
      <input 
        ref="fileInput"
        type="file" 
        class="hidden" 
        :multiple="multiple"
        accept="image/*"
        @change="handleFileSelect"
      />
    </div>

    <!-- Preview Grid -->
    <div v-if="previews.length" class="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div 
        v-for="(url, idx) in previews" 
        :key="idx"
        class="relative aspect-square rounded-2xl overflow-hidden group/preview border border-gray-100 shadow-sm"
      >
        <img :src="url" class="w-full h-full object-cover transition-transform duration-700 group-hover/preview:scale-110" />
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <button 
            type="button"
            @click.stop="removeImage(idx)"
            class="w-10 h-10 rounded-full bg-white/20 hover:bg-red-500 hover:text-white text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUpload } from '@/composables/core/useUpload'

const props = withDefaults(defineProps<{
  modelValue?: string | string[]
  label?: string
  multiple?: boolean
  folder?: string
}>(), {
  modelValue: '',
  multiple: false,
  folder: 'products'
})

const emit = defineEmits(['update:modelValue'])
const { uploadImage, uploading } = useUpload()
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInput.value?.click()
}

const previews = computed(() => {
  if (!props.modelValue) return []
  return Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
})

async function handleFileSelect(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  await processFiles(files)
}

async function handleDrop(e: DragEvent) {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (!files) return
  await processFiles(files)
}

async function processFiles(files: FileList) {
  const fileArray = Array.from(files)
  
  if (props.multiple) {
    const urls = [...previews.value]
    for (const file of fileArray) {
      const url = await uploadImage(file, props.folder)
      if (url) urls.push(url)
    }
    emit('update:modelValue', urls)
  } else {
    if (fileArray[0]) {
      const url = await uploadImage(fileArray[0], props.folder)
      if (url) emit('update:modelValue', url)
    }
  }
}

function removeImage(idx: number) {
  if (props.multiple) {
    const urls = [...previews.value]
    urls.splice(idx, 1)
    emit('update:modelValue', urls)
  } else {
    emit('update:modelValue', '')
  }
}
</script>
