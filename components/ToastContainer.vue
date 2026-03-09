<template>
  <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="[
          'flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm animate-slide-in',
          typeClasses[t.type],
        ]"
      >
        <Icon :name="typeIcons[t.type]" class="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium">{{ t.title }}</p>
          <p v-if="t.message" class="text-xs opacity-70 mt-0.5">{{ t.message }}</p>
        </div>
        <button @click="remove(t.id)" class="opacity-60 hover:opacity-100 transition-opacity">
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const { toasts, remove } = useToast()

const typeClasses: Record<string, string> = {
  success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  error: 'bg-red-500/10 border-red-500/20 text-red-400',
  warning: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
}

const typeIcons: Record<string, string> = {
  success: 'lucide:check-circle',
  error: 'lucide:alert-circle',
  warning: 'lucide:alert-triangle',
  info: 'lucide:info',
}
</script>

<style scoped>
.toast-enter-active { transition: all 0.3s ease; }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateX(40px); }
.toast-leave-to { opacity: 0; transform: translateX(40px); }
</style>
