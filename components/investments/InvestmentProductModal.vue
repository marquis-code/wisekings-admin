<template>
  <CoreModal :show="show" @close="$emit('close')" :title="isEditing ? 'Edit Investment Product' : 'Create New Investment Product'" size="lg">
    <form @submit.prevent="handleSubmit" class="space-y-6 px-2">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CoreInput v-model="form.title" label="Product Title" placeholder="e.g. Plantain Expansion Fund" required />
        <CoreInput v-model="form.category" label="Category" placeholder="e.g. Agriculture" required />
      </div>

      <CoreTextarea v-model="form.description" label="Detailed Description" placeholder="Explain the investment opportunity..." required />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-[#033958]/5 rounded-[2rem] border border-[#033958]/10">
        <CoreInput v-model="form.roiPercentage" type="number" label="ROI Percentage (%)" placeholder="e.g. 15" required />
        <CoreInput v-model="form.durationInMonths" type="number" label="Duration (Months)" placeholder="e.g. 6" required />
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Risk Level</label>
          <select v-model="form.riskLevel" class="w-full px-4 py-3 bg-white border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#033958]/10 font-bold">
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CoreInput v-model="form.pricePerSlot" type="number" label="Price per Slot (₦)" placeholder="0.00" required />
        <CoreInput v-model="form.totalSlots" type="number" label="Total Slots Available" placeholder="e.g. 100" required />
      </div>

      <CoreInput v-model="form.image" label="Image URL (Optional)" placeholder="https://..." />

      <div class="flex justify-end gap-3 pt-4 border-t">
        <button type="button" @click="$emit('close')" class="btn-secondary">Cancel</button>
        <button type="submit" class="btn-primary" :disabled="loading">
          <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 animate-spin mr-2" />
          {{ isEditing ? 'Update Product' : 'Create Product' }}
        </button>
      </div>
    </form>
  </CoreModal>
</template>

<script setup lang="ts">
import { investments_api } from '@/api_factory/modules/investments'
import { useCustomToast } from '@/composables/core/useCustomToast'

const props = defineProps<{
  show: boolean
  product?: any
}>()

const emit = defineEmits(['close', 'success'])
const { showToast } = useCustomToast()
const loading = ref(false)

const isEditing = computed(() => !!props.product)

const form = reactive({
  title: '',
  description: '',
  roiPercentage: 0,
  durationInMonths: 0,
  pricePerSlot: 0,
  totalSlots: 0,
  riskLevel: 'medium',
  category: '',
  image: ''
})

watch(() => props.product, (val) => {
  if (val) {
    Object.assign(form, val)
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.title = ''
  form.description = ''
  form.roiPercentage = 0
  form.durationInMonths = 0
  form.pricePerSlot = 0
  form.totalSlots = 0
  form.riskLevel = 'medium'
  form.category = ''
  form.image = ''
}

async function handleSubmit() {
  loading.value = true
  try {
    if (isEditing.value) {
      await investments_api.updateProduct(props.product._id, form)
      showToast({ title: 'Success', message: 'Investment product updated', toastType: 'success' })
    } else {
      await investments_api.createProduct(form)
      showToast({ title: 'Success', message: 'Investment product created', toastType: 'success' })
    }
    emit('success')
    emit('close')
    resetForm()
  } catch (err: any) {
    showToast({ title: 'Error', message: err.message || 'Operation failed', toastType: 'error' })
  } finally {
    loading.value = false
  }
}
</script>
