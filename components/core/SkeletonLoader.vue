<template>
  <div class="animate-pulse space-y-4">
    <div v-for="i in rows" :key="i" class="flex items-center gap-4 py-4 px-6 border-b border-gray-100 last:border-0">
      <div v-if="avatar" class="w-10 h-10 rounded-full bg-gray-200"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-3 bg-gray-100 rounded w-1/2"></div>
      </div>
      <div class="w-24 h-4 bg-gray-100 rounded"></div>
      <div class="w-12 h-8 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  rows?: number
  avatar?: boolean
}>(), {
  rows: 5,
  avatar: false
})
</script>
