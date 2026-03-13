<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Products</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Manage your product catalog and inventory</p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="handleExport" 
          class="btn-secondary !rounded-2xl !px-6 !py-3 flex items-center gap-2 border-gray-100 hover:bg-gray-50 transition-all font-bold"
        >
          <Icon name="lucide:download" class="w-5 h-5" />
          Export CSV
        </button>
        <NuxtLink 
          to="/products/new" 
          class="group btn-primary !rounded-2xl !px-6 !py-3 shadow-lg shadow-[#033958]/10 hover:shadow-[#033958]/20 transition-all duration-300"
        >
          <span class="flex items-center gap-2">
            <Icon name="lucide:plus" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 
            Add Product
          </span>
        </NuxtLink>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-center">
      <div class="relative flex-1 min-w-[300px]">
        <Icon name="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          v-model="search" 
          type="text" 
          placeholder="Search products by name, SKU or tags..." 
          class="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#033958]/10 transition-all font-medium" 
          @input="debouncedFetch" 
        />
      </div>
      <div class="flex gap-3">
        <select 
          v-model="categoryFilter" 
          class="bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#033958]/10 transition-all outline-none min-w-[180px]" 
          @change="handleFetch"
        >
          <option value="">All Categories</option>
          <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option>
        </select>
        <button @click="handleFetch" class="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#033958]/5 text-[#033958] hover:bg-[#033958] hover:text-white transition-all">
          <Icon name="lucide:rotate-cw" class="w-5 h-5" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <!-- Products Table -->
    <div class="table-container bg-white shadow-sm border-gray-100 overflow-hidden !rounded-3xl">
      <table class="data-table">
        <thead>
          <tr class="!bg-gray-50/50">
            <th class="!py-5 !pl-6">
              <input 
                type="checkbox" 
                :checked="selectedIds.length === products.length && products.length > 0" 
                @change="toggleAll"
                class="custom-checkbox"
              />
            </th>
            <th class="!py-5">Product</th>
            <th class="!py-5 text-center">Price</th>
            <th class="!py-5 text-center">Stock</th>
            <th class="!py-5">Category</th>
            <th class="!py-5 text-center">Sold</th>
            <th class="!py-5">Status</th>
            <th class="!py-5 !pr-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="7" class="!p-0">
              <CoreSkeletonLoader :rows="5" avatar />
            </td>
          </tr>
          <tr v-else-if="products.length === 0">
            <td colspan="7" class="!py-10">
              <CoreEmptyState 
                icon="lucide:package-open" 
                title="No products found" 
                description="Your product catalog is empty. Start by adding your first product to the store."
              />
            </td>
          </tr>
          <tr v-for="p in products" :key="p._id" v-else class="group" :class="{ 'bg-blue-50/30': selectedIds.includes(p._id) }">
            <td class="!py-4 !pl-6">
              <input 
                type="checkbox" 
                v-model="selectedIds" 
                :value="p._id"
                class="custom-checkbox"
              />
            </td>
            <td class="!py-4">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                  <img v-if="p.images?.[0]" :src="p.images[0]" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div v-else class="w-full h-full flex items-center justify-center"><Icon name="lucide:image" class="w-6 h-6 text-gray-200" /></div>
                </div>
                <div>
                  <p class="font-bold text-gray-900 text-sm leading-tight">{{ p.name }}</p>
                  <p class="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{{ p.sku || 'No SKU' }}</p>
                </div>
              </div>
            </td>
            <td class="!py-4 text-center">
              <p class="font-black text-gray-900">₦{{ p.price.toLocaleString() }}</p>
              <p v-if="p.compareAtPrice" class="text-[10px] text-gray-400 line-through font-bold mt-0.5">₦{{ p.compareAtPrice.toLocaleString() }}</p>
            </td>
            <td class="!py-4 text-center">
              <div class="flex flex-col items-center">
                <span :class="[
                  'text-sm font-black',
                  p.stock > 10 ? 'text-emerald-500' : p.stock > 0 ? 'text-amber-500' : 'text-red-500'
                ]">
                  {{ p.stock }}
                </span>
                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Units</span>
              </div>
            </td>
            <td class="!py-4">
              <span class="inline-flex px-3 py-1 rounded-xl bg-gray-100 text-[#033958] text-[11px] font-bold">
                {{ typeof p.category === 'object' ? (p.category as any)?.name : 'Uncategorized' }}
              </span>
            </td>
            <td class="!py-4 text-center font-bold text-gray-600">{{ p.totalSold }}</td>
            <td class="!py-4">
              <span :class="p.isActive ? 'badge-success' : 'badge-danger'">{{ p.isActive ? 'Active' : 'Inactive' }}</span>
            </td>
            <td class="!py-4 !pr-6 text-right">
              <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <NuxtLink 
                  :to="`/products/${p._id}/edit`" 
                  class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-[#033958] hover:text-white transition-all duration-300"
                  title="Edit Product"
                >
                  <Icon name="lucide:edit" class="w-4 h-4" />
                </NuxtLink>
                <button 
                  @click="handleDelete(p)" 
                  class="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                  title="Delete Product"
                >
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Bulk Actions Floating Bar -->
    <Transition name="slide-up">
      <div v-if="selectedIds.length > 0" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#033958] text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-8 border border-white/10 backdrop-blur-xl">
        <div class="flex items-center gap-3 pr-8 border-r border-white/20">
          <span class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">{{ selectedIds.length }}</span>
          <span class="font-bold text-sm tracking-wide">Selected</span>
        </div>
        
        <div class="flex items-center gap-4">
          <button @click="handleBulkStatus(true)" class="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-all text-sm font-bold">
            <Icon name="lucide:check-circle" size="18" />
            Activate
          </button>
          <button @click="handleBulkStatus(false)" class="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-all text-sm font-bold">
            <Icon name="lucide:minus-circle" size="18" />
            Deactivate
          </button>
          <button @click="handleBulkDelete" class="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl transition-all text-sm font-bold">
            <Icon name="lucide:trash-2" size="18" />
            Delete
          </button>
        </div>
        
        <button @click="selectedIds = []" class="ml-4 p-2 hover:bg-white/10 rounded-full transition-all">
          <Icon name="lucide:x" size="20" />
        </button>
      </div>
    </Transition>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-8 bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm">
      <p class="text-sm font-bold text-gray-500 ml-4">Showing page {{ page }} of {{ totalPages }}</p>
      <div class="flex gap-2">
        <button 
          @click="page--; handleFetch()" 
          :disabled="page <= 1" 
          class="btn-secondary !rounded-2xl !px-6 disabled:opacity-20 transition-all"
        >
          Previous
        </button>
        <button 
          @click="page++; handleFetch()" 
          :disabled="page >= totalPages" 
          class="btn-primary !rounded-2xl !px-6 disabled:opacity-20 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, Category } from '~/types'
import { useFetchProducts } from '@/composables/modules/products/useFetchProducts'
import { useDeleteProduct } from '@/composables/modules/products/useDeleteProduct'
import { products_api } from '@/api_factory/modules/products'
import { useConfirm } from '@/composables/core/useConfirm'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({ layout: 'dashboard' })

const { products, loading, total, fetchProducts } = useFetchProducts()
const { deleteProduct: deleteAction } = useDeleteProduct()
const { confirmDelete } = useConfirm()
const { showToast } = useCustomToast()

const categories = ref<Category[]>([])
const page = ref(1)
const limit = ref(10)
const search = ref('')
const categoryFilter = ref('')
const selectedIds = ref<string[]>([])

const totalPages = computed(() => Math.ceil(total.value / limit.value))

function toggleAll() {
  if (selectedIds.value.length === products.value.length) {
    selectedIds.value = []
  } else {
    selectedIds.value = products.value.map(p => p._id)
  }
}

async function handleBulkStatus(isActive: boolean) {
  loading.value = true
  try {
    await products_api.bulkUpdate({ ids: selectedIds.value, update: { isActive } })
    selectedIds.value = []
    handleFetch()
    showToast({ title: 'Success', message: 'Bulk updated successfully', toastType: 'success' })
  } catch (err) {
    showToast({ title: 'Error', message: 'Bulk update failed', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

async function handleBulkDelete() {
  if (await confirmDelete('Delete Selected', `Are you sure you want to delete ${selectedIds.value.length} products?`)) {
    loading.value = true
    try {
      await Promise.all(selectedIds.value.map(id => deleteAction(id)))
      selectedIds.value = []
      handleFetch()
    } catch (err) {
      showToast({ title: 'Error', message: 'Bulk delete failed', toastType: 'error' })
    } finally {
      loading.value = false
    }
  }
}

let debounceTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; handleFetch() }, 400)
}

function handleFetch() {
  fetchProducts({
    page: page.value,
    limit: limit.value,
    search: search.value || undefined,
    category: categoryFilter.value || undefined
  })
}

async function handleDelete(p: Product) {
  if (await confirmDelete('Delete Product', `Are you sure you want to delete "${p.name}"? This action cannot be undone.`)) {
    const success = await deleteAction(p._id)
    if (success) handleFetch()
  }
}

async function handleExport() {
  const config = useRuntimeConfig()
  const { accessToken } = useAuthState()
  try {
    const res = await fetch(`${config.public.apiBase}/products/export`, {
      headers: { Authorization: `Bearer ${accessToken.value}` }
    })
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `products_export_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    showToast({ title: 'Success', message: 'Export started', toastType: 'success' })
  } catch (err) {
    showToast({ title: 'Error', message: 'Export failed', toastType: 'error' })
  }
}

onMounted(async () => {
  try {
    const res = await products_api.getCategories()
    categories.value = (res as any)?.data || res || []
  } catch {}
  handleFetch()
})
</script>

<style scoped>
.badge-success {
  @apply inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100;
}

.badge-danger {
  @apply inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 border border-red-100;
}
</style>
