<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Raw Materials</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Manage ingredients and input costs for production</p>
      </div>
      <button @click="openAddModal" class="btn-primary flex items-center gap-2 !rounded-2xl !py-3 !px-6 shadow-lg shadow-[#033958]/20">
        <Icon name="lucide:plus" class="w-5 h-5" />
        <span class="font-bold">Add New Material</span>
      </button>
    </div>

    <!-- Materials Table -->
    <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50/50">
            <th class="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Material</th>
            <th class="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Cost / Unit</th>
            <th class="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Current Stock</th>
            <th class="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-if="loading">
            <td colspan="4" class="px-6 py-10 text-center">
              <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin mx-auto text-gray-300" />
            </td>
          </tr>
          <tr v-else-if="materials.length === 0">
            <td colspan="4" class="px-6 py-16 text-center">
              <div class="flex flex-col items-center">
                <Icon name="lucide:package-2" class="w-12 h-12 text-gray-200 mb-4" />
                <p class="text-gray-500 font-bold">No raw materials found</p>
                <p class="text-gray-400 text-xs mt-1">Start by adding plantain, oil, or sugar.</p>
              </div>
            </td>
          </tr>
          <tr v-for="m in materials" :key="m._id" class="hover:bg-gray-50/50 transition-colors group">
            <td class="px-6 py-4">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Icon name="lucide:test-tube" class="w-5 h-5" />
                </div>
                <div>
                  <p class="font-black text-gray-900 text-sm uppercase tracking-tight">{{ m.name }}</p>
                  <p class="text-xs font-bold text-gray-400">Unit: {{ m.unit }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <p class="text-sm font-black text-emerald-600">₦{{ m.costPerUnit.toLocaleString() }} <span class="text-[10px] text-gray-400 ml-1">/ {{ m.unit }}</span></p>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <div :class="['w-2 h-2 rounded-full', m.currentStock > 10 ? 'bg-emerald-500' : 'bg-amber-500']"></div>
                <p class="text-sm font-bold text-gray-700">{{ m.currentStock.toLocaleString() }} {{ m.unit }}</p>
              </div>
            </td>
            <td class="px-6 py-4 text-right">
              <button @click="openEditModal(m)" class="w-9 h-9 rounded-xl bg-[#033958]/5 text-[#033958] hover:bg-[#033958] hover:text-white transition-all">
                <Icon name="lucide:edit-3" class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modals -->
    <ProductionMaterialModal 
      :show="showModal" 
      :material="selectedMaterial" 
      @close="showModal = false" 
      @success="fetchMaterials" 
    />
  </div>
</template>

<script setup lang="ts">
import { useFetchMaterials } from '@/composables/modules/production/useFetchMaterials'

definePageMeta({ layout: 'dashboard' })

const { materials, loading, fetchMaterials } = useFetchMaterials()
const showModal = ref(false)
const selectedMaterial = ref<any>(null)

function openAddModal() {
  selectedMaterial.value = null
  showModal.value = true
}

function openEditModal(m: any) {
  selectedMaterial.value = { ...m }
  showModal.value = true
}

onMounted(fetchMaterials)
</script>
