<template>
  <CoreModal :show="show" @close="$emit('close')" :title="isEditing ? 'Edit Raw Material' : 'Add Raw Material'">
    <form @submit.prevent="handleSubmit" class="space-y-6 px-2">
      <div class="space-y-4">
        <CoreInput v-model="form.name" label="Material Name" placeholder="e.g. Plantain, Vegetable Oil" required />
        
        <div class="grid grid-cols-2 gap-4">
          <CoreInput v-model="form.unit" label="Unit" placeholder="e.g. kg, liters, pcs" required />
          <CoreInput v-model="form.costPerUnit" type="number" step="0.01" label="Cost per Unit" placeholder="0.00" required />
        </div>

        <CoreInput v-model="form.currentStock" type="number" step="0.01" label="Current Stock" placeholder="0.00" />
        
        <CoreTextarea v-model="form.description" label="Description (Optional)" placeholder="Add any additional details..." />
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t">
        <button type="button" @click="$emit('close')" class="btn-secondary">Cancel</button>
        <button type="submit" class="btn-primary" :disabled="loading">
          <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 animate-spin mr-2" />
          {{ isEditing ? 'Update Material' : 'Create Material' }}
        </button>
      </div>
    </form>
  </CoreModal>
</template>

<script setup lang="ts">
import { production_api } from '@/api_factory/modules/production'
import { useCustomToast } from '@/composables/core/useCustomToast'

const props = defineProps<{
  show: boolean
  material?: any
}>()

const emit = defineEmits(['close', 'success'])
const { showToast } = useCustomToast()
const loading = ref(false)

const isEditing = computed(() => !!props.material)

const form = reactive({
  name: '',
  unit: '',
  costPerUnit: 0,
  currentStock: 0,
  description: ''
})

watch(() => props.material, (val) => {
  if (val) {
    form.name = val.name
    form.unit = val.unit
    form.costPerUnit = val.costPerUnit
    form.currentStock = val.currentStock
    form.description = val.description || ''
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.name = ''
  form.unit = ''
  form.costPerUnit = 0
  form.currentStock = 0
  form.description = ''
}

async function handleSubmit() {
  loading.value = true
  try {
    if (isEditing.value) {
      await production_api.updateMaterial(props.material._id, form)
      showToast({ title: 'Success', message: 'Material updated successfully', toastType: 'success' })
    } else {
      await production_api.createMaterial(form)
      showToast({ title: 'Success', message: 'Material created successfully', toastType: 'success' })
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
