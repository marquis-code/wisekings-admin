<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div><h1 class="text-2xl font-bold text-white">Products</h1><p class="text-dark-400 text-sm mt-1">Manage product catalog</p></div>
      <NuxtLink to="/products/new" class="btn-primary"><Icon name="lucide:plus" class="w-4 h-4" /> Add Product</NuxtLink>
    </div>
    <div class="card mb-6"><div class="flex flex-wrap gap-3">
      <input v-model="search" type="text" placeholder="Search products..." class="input max-w-xs" @input="debouncedFetch" />
      <select v-model="categoryFilter" class="input max-w-[180px]" @change="handleFetch">
        <option value="">All Categories</option>
        <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option>
      </select>
    </div></div>
    <div class="table-container">
      <table class="data-table">
        <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Category</th><th>Sold</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-if="loading"><td colspan="7" class="text-center py-12 text-dark-400"><Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto" /></td></tr>
          <tr v-else-if="products.length === 0"><td colspan="7" class="text-center py-12 text-dark-400">No products found</td></tr>
          <tr v-for="p in products" :key="p._id" v-else>
            <td><div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-dark-800 overflow-hidden flex-shrink-0">
                <img v-if="p.images?.[0]" :src="p.images[0]" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center"><Icon name="lucide:image" class="w-5 h-5 text-dark-500" /></div>
              </div>
              <div><p class="font-medium text-white text-sm">{{ p.name }}</p><p class="text-xs text-dark-400">{{ p.slug }}</p></div>
            </div></td>
            <td>₦{{ p.price.toLocaleString() }}</td>
            <td><span :class="p.stock > 10 ? 'text-emerald-400' : p.stock > 0 ? 'text-amber-400' : 'text-red-400'">{{ p.stock }}</span></td>
            <td class="text-dark-300">{{ typeof p.category === 'object' ? (p.category as any)?.name : '—' }}</td>
            <td>{{ p.totalSold }}</td>
            <td><span :class="p.isActive ? 'badge-success' : 'badge-danger'">{{ p.isActive ? 'Active' : 'Inactive' }}</span></td>
            <td><div class="flex items-center gap-2">
              <NuxtLink :to="`/products/${p._id}/edit`" class="btn-ghost btn-sm"><Icon name="lucide:edit" class="w-3.5 h-3.5" /></NuxtLink>
              <button @click="handleDelete(p)" class="btn-ghost btn-sm text-red-400"><Icon name="lucide:trash-2" class="w-3.5 h-3.5" /></button>
            </div></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-4">
      <p class="text-sm text-dark-400">Page {{ page }} of {{ totalPages }}</p>
      <div class="flex gap-2">
        <button @click="page--; handleFetch()" :disabled="page <= 1" class="btn-secondary btn-sm">Previous</button>
        <button @click="page++; handleFetch()" :disabled="page >= totalPages" class="btn-secondary btn-sm">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, Category } from '~/types'
import { useFetchProducts } from '@/composables/modules/products/useFetchProducts'
import { useDeleteProduct } from '@/composables/modules/products/useDeleteProduct'
import { products_api } from '@/api_factory/modules/admin-modules'

definePageMeta({ layout: 'dashboard' })

const { products, loading, total, fetchProducts } = useFetchProducts()
const { deleteProduct: deleteAction } = useDeleteProduct()

const categories = ref<Category[]>([])
const page = ref(1)
const limit = ref(10)
const search = ref('')
const categoryFilter = ref('')

const totalPages = computed(() => Math.ceil(total.value / limit.value))

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
  if (confirm(`Delete "${p.name}"?`)) {
    const success = await deleteAction(p._id)
    if (success) handleFetch()
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
