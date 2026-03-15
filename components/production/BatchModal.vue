<template>
  <CoreModal :show="show" @close="$emit('close')" title="Record Production Batch" size="lg">
    <div class="space-y-8 px-2 max-h-[80vh] overflow-y-auto pr-4 custom-scrollbar">
      <!-- Step 1: Basic Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1">
          <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Select Product</label>
          <select v-model="form.productId" class="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#033958]/10 font-bold">
            <option value="" disabled>Choose Product...</option>
            <option v-for="p in products" :key="p._id" :value="p._id">{{ p.name }}</option>
          </select>
        </div>
        <CoreInput v-model="form.batchNumber" label="Batch ID / Number" placeholder="e.g. BATCH-001" required />
      </div>

      <!-- Step 2: Financial Inputs -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#033958]/5 rounded-[2rem] border border-[#033958]/10">
        <CoreInput v-model="form.quantityProduced" type="number" label="Quantity Produced (SKUs)" placeholder="Number of packs" required />
        <CoreInput v-model="form.sellingPricePerUnit" type="number" label="Selling Price per Unit (₦)" placeholder="Price per pack" required />
      </div>

      <!-- Step 3: Raw Materials Consumption -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-[#033958] uppercase tracking-widest">Consumed Raw Materials</h3>
          <button @click="addMaterialRow" type="button" class="text-[10px] font-black uppercase tracking-widest text-[#033958] flex items-center gap-1 hover:text-amber-600 transition-colors">
            <Icon name="lucide:plus-circle" size="14" /> Add Material
          </button>
        </div>

        <div v-for="(item, index) in form.materials" :key="index" class="grid grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div class="col-span-6 space-y-1">
            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Material</label>
            <select v-model="item.materialId" class="w-full px-4 py-2 bg-white border-none rounded-xl text-xs focus:ring-2 focus:ring-[#033958]/10 font-bold">
              <option value="" disabled>Select...</option>
              <option v-for="m in materials" :key="m._id" :value="m._id">{{ m.name }} (₦{{ m.costPerUnit }}/{{ m.unit }})</option>
            </select>
          </div>
          <div class="col-span-4">
            <CoreInput v-model="item.weight" type="number" :label="`Weight used`" placeholder="Quantity" />
          </div>
          <div class="col-span-2 pb-1.5 flex justify-end">
            <button @click="removeMaterialRow(index)" type="button" class="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
              <Icon name="lucide:trash-2" size="14" />
            </button>
          </div>
        </div>
      </div>

      <!-- Financial Preview (Spreadsheet Automation Logic) -->
      <div class="p-8 bg-gray-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-[60px]"></div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p class="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Cost</p>
            <p class="text-xl font-black text-white">₦ {{ totalCost.toLocaleString() }}</p>
          </div>
          <div>
            <p class="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Revenue</p>
            <p class="text-xl font-black text-white">₦ {{ revenue.toLocaleString() }}</p>
          </div>
          <div>
            <p class="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Profit</p>
            <p :class="['text-xl font-black', profit >= 0 ? 'text-emerald-400' : 'text-red-400']">₦ {{ profit.toLocaleString() }}</p>
          </div>
          <div>
            <p class="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Margin</p>
            <p :class="['text-xl font-black', margin >= 20 ? 'text-emerald-400' : 'text-amber-400']">{{ margin.toFixed(1) }}%</p>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-6 border-t">
        <button type="button" @click="$emit('close')" class="btn-secondary">Cancel</button>
        <button @click="handleSubmit" class="btn-primary" :disabled="loading || !canSave">
          <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 animate-spin mr-2" />
          Record Batch
        </button>
      </div>
    </div>
  </CoreModal>
</template>

<script setup lang="ts">
import { useFetchProducts } from '@/composables/modules/products/useFetchProducts'
import { useFetchMaterials } from '@/composables/modules/production/useFetchMaterials'
import { useCreateBatch } from '@/composables/modules/production/useCreateBatch'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close', 'success'])

const { products, fetchProducts } = useFetchProducts()
const { materials, fetchMaterials } = useFetchMaterials()
const { createBatch, loading } = useCreateBatch()

const form = reactive({
  productId: '',
  batchNumber: '',
  quantityProduced: 0,
  sellingPricePerUnit: 0,
  materials: [] as { materialId: string; weight: number }[],
  notes: ''
})

// Auto-generate batch number
onMounted(async () => {
  await Promise.all([fetchProducts(), fetchMaterials()])
  if (!form.batchNumber) {
    form.batchNumber = `BATCH-${new Date().getTime().toString().slice(-6)}`
  }
})

// Financial Logic
const totalCost = computed(() => {
  return form.materials.reduce((sum, item) => {
    const mat = materials.value.find(m => m._id === item.materialId)
    return sum + (item.weight * (mat?.costPerUnit || 0))
  }, 0)
})

const revenue = computed(() => form.quantityProduced * form.sellingPricePerUnit)
const profit = computed(() => revenue.value - totalCost.value)
const margin = computed(() => revenue.value > 0 ? (profit.value / revenue.value) * 100 : 0)

const canSave = computed(() => {
  return form.productId && form.batchNumber && form.quantityProduced > 0 && form.materials.length > 0 && form.materials.every(m => m.materialId && m.weight > 0)
})

function addMaterialRow() {
  form.materials.push({ materialId: '', weight: 0 })
}

function removeMaterialRow(index: number) {
  form.materials.splice(index, 1)
}

async function handleSubmit() {
  const success = await createBatch(form)
  if (success) {
    emit('success')
    emit('close')
    resetForm()
  }
}

function resetForm() {
  form.productId = ''
  form.batchNumber = ''
  form.quantityProduced = 0
  form.sellingPricePerUnit = 0
  form.materials = []
  form.notes = ''
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(3, 57, 88, 0.1);
  border-radius: 10px;
}
</style>
