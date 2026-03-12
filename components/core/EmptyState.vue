<template>
  <div class="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-700">
    <div class="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6 text-gray-200">
      <Icon :name="icon" class="w-12 h-12" />
    </div>
    <h3 class="text-xl font-bold text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-gray-500 max-w-sm mx-auto mb-8 font-medium">{{ description }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'lucide:box',
  title: 'No data found',
  description: 'Try adjusting your filters or search criteria to find what you are looking for.'
})
</script>
