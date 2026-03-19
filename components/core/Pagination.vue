<template>
  <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between mt-8 bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm gap-4">
    <div class="flex items-center gap-4 ml-4">
      <p class="text-sm font-bold text-gray-400">
        Page <span class="text-gray-900">{{ modelValue }}</span> of <span class="text-gray-900">{{ totalPages }}</span>
      </p>
      <div class="h-4 w-px bg-gray-100"></div>
      <p class="text-[10px] font-black uppercase tracking-widest text-[#033958]/40">{{ limit }} Items Per Page</p>
    </div>
    
    <div class="flex gap-2">
      <button 
        @click="$emit('update:modelValue', modelValue - 1)" 
        :disabled="modelValue <= 1" 
        class="group btn-secondary !rounded-2xl !px-6 disabled:opacity-20 transition-all font-bold flex items-center gap-2"
      >
        <Icon name="lucide:chevron-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Previous
      </button>
      
      <div class="hidden sm:flex items-center gap-1 mx-2">
        <button 
          v-for="p in visiblePages" :key="p"
          @click="$emit('update:modelValue', p)"
          class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all"
          :class="modelValue === p ? 'bg-[#033958] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'"
        >
          {{ p }}
        </button>
      </div>

      <button 
        @click="$emit('update:modelValue', modelValue + 1)" 
        :disabled="modelValue >= totalPages" 
        class="group btn-primary !rounded-2xl !px-6 disabled:opacity-20 transition-all font-bold flex items-center gap-2"
      >
        Next
        <Icon name="lucide:chevron-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  total: number
  limit: number
}>()

defineEmits(['update:modelValue'])

const totalPages = computed(() => Math.ceil(props.total / props.limit))

const visiblePages = computed(() => {
  const current = props.modelValue
  const last = totalPages.value
  const delta = 2
  const left = current - delta
  const right = current + delta + 1
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= left && i < right)) {
      range.push(i)
    }
  }

  return range
})
</script>
