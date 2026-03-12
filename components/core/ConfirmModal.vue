<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/60 backdrop-blur-sm">
      <Transition name="scale">
        <div v-if="isOpen" class="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div class="p-8 text-center">
            <div class="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-6">
              <Icon :name="icon || 'lucide:alert-triangle'" class="w-8 h-8 text-amber-500" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-8">{{ message }}</p>
            
            <div class="flex flex-col gap-3">
              <button 
                @click="onConfirm" 
                :class="['w-full py-4 rounded-2xl font-bold transition-all shadow-lg', confirmClass || 'bg-gray-900 text-white hover:bg-black shadow-gray-900/10']"
              >
                {{ confirmText || 'Confirm' }}
              </button>
              <button 
                @click="onCancel" 
                class="w-full py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
              >
                {{ cancelText || 'Cancel' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmClass?: string
  icon?: string
  resolve: (value: boolean) => void
}>()

const isOpen = ref(false)

const onConfirm = () => {
  isOpen.value = false
  setTimeout(() => props.resolve(true), 300)
}

const onCancel = () => {
  isOpen.value = false
  setTimeout(() => props.resolve(false), 300)
}

// Open modal on mount
onMounted(() => {
  setTimeout(() => {
    isOpen.value = true
  }, 10)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.scale-enter-active, .scale-leave-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}
.scale-enter-from, .scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>
