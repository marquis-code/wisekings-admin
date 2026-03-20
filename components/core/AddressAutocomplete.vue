<template>
  <div class="space-y-2 relative">
    <div class="relative group">
      <Icon name="lucide:map-pin" size="18" class="absolute left-5 top-1/2 -translate-y-1/2 text-[#033958]/80 group-focus-within:text-[#033958] transition-colors z-10" />
      <div class="relative">
        <label 
          v-if="label"
          :class="[
            'absolute transition-all duration-300 ease-in-out pointer-events-none z-10 text-xs text-gray-500 left-12 top-2',
            modelValue ? 'opacity-100' : 'opacity-0'
          ]"
        >
          {{ label }}
        </label>
        <input 
          ref="autocompleteInput"
          :value="modelValue"
          @input="handleInput"
          :placeholder="modelValue ? '' : placeholder" 
          :required="required"
          :class="[
            'w-full pl-12 pr-5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:ring-1 focus:ring-[#033958] focus:border-[#033958] outline-none transition-all',
            label ? 'py-4 pt-6' : 'py-4'
          ]" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

declare const google: any

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Enter address...'
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'place-changed'])
const autocompleteInput = ref<HTMLInputElement | null>(null)

let debounceTimer: any = null

const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('update:modelValue', value)
  }, 800) // Debounce update to modelValue
}

onMounted(() => {
  if (typeof google === 'undefined') {
    console.warn('Google Maps API not loaded')
    return
  }
  
  if (autocompleteInput.value) {
    const autocomplete = new google.maps.places.Autocomplete(autocompleteInput.value, {
      componentRestrictions: { country: 'NG' },
      fields: ['address_components', 'geometry', 'formatted_address'],
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.geometry || !place.geometry.location) return

      const addressData = {
        address: place.formatted_address || '',
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        city: '',
        state: ''
      }

      // Parse city/state
      place.address_components?.forEach((comp: any) => {
        if (comp.types.includes('locality')) addressData.city = comp.long_name
        if (comp.types.includes('administrative_area_level_1')) addressData.state = comp.long_name
      })

      emit('update:modelValue', addressData.address)
      emit('place-changed', addressData)
    })
  }
})
</script>
