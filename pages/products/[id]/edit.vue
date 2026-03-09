<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink to="/products" class="btn-ghost btn-sm"><Icon name="lucide:arrow-left" class="w-4 h-4" /></NuxtLink>
      <h1 class="text-2xl font-bold text-white">{{ isEdit ? 'Edit Product' : 'New Product' }}</h1>
    </div>
    <form @submit.prevent="handleSubmit" class="max-w-3xl space-y-6">
      <div class="card space-y-4">
        <h2 class="text-lg font-semibold text-white">Basic Info</h2>
        <div><label class="label">Name</label><input v-model="form.name" type="text" class="input" required /></div>
        <div><label class="label">Description</label><textarea v-model="form.description" class="input min-h-[100px]" required /></div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="label">Price (₦)</label><input v-model.number="form.price" type="number" min="0" class="input" required /></div>
          <div><label class="label">Compare At Price</label><input v-model.number="form.compareAtPrice" type="number" min="0" class="input" /></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div><label class="label">Stock</label><input v-model.number="form.stock" type="number" min="0" class="input" required /></div>
          <div><label class="label">SKU</label><input v-model="form.sku" type="text" class="input" /></div>
        </div>
        <div><label class="label">Category</label>
          <select v-model="form.category" class="input">
            <option value="">Select category</option>
            <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option>
          </select>
        </div>
        <div><label class="label">Slug</label><input v-model="form.slug" type="text" class="input" required /></div>
        <div><label class="label">Tags (comma-separated)</label><input v-model="tagsInput" type="text" class="input" placeholder="snack, healthy, popular" /></div>
        <div class="flex items-center gap-2">
          <input v-model="form.isActive" type="checkbox" id="isActive" class="rounded bg-dark-800 border-dark-600 text-primary-600" />
          <label for="isActive" class="text-sm text-dark-300">Active</label>
        </div>
      </div>
      <div class="flex gap-3">
        <button type="submit" class="btn-primary" :disabled="saving">
          <Icon v-if="saving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
          {{ saving ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product') }}
        </button>
        <NuxtLink to="/products" class="btn-secondary">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types'
definePageMeta({ layout: 'dashboard' })
const route = useRoute()
const api = useProductsApi()
const toast = useToast()
const isEdit = computed(() => route.params.id && route.params.id !== 'new')
const categories = ref<Category[]>([])
const saving = ref(false)
const tagsInput = ref('')
const form = ref({
  name: '', description: '', price: 0, compareAtPrice: 0, stock: 0, sku: '', slug: '', category: '', isActive: true, tags: [] as string[],
})

watch(() => form.value.name, (n) => {
  if (!isEdit.value) form.value.slug = n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
})

async function handleSubmit() {
  saving.value = true
  form.value.tags = tagsInput.value.split(',').map((t) => t.trim()).filter(Boolean)
  try {
    if (isEdit.value) { await api.update(route.params.id as string, form.value); toast.success('Product updated') }
    else { await api.create(form.value); toast.success('Product created') }
    navigateTo('/products')
  } catch (e: any) { toast.error(e?.data?.message || 'Failed to save product') }
  finally { saving.value = false }
}

onMounted(async () => {
  try { categories.value = (await api.getCategories() as any) || [] } catch {}
  if (isEdit.value) {
    try {
      const p = await api.findById(route.params.id as string) as any
      Object.assign(form.value, { ...p, category: p.category?._id || p.category || '' })
      tagsInput.value = (p.tags || []).join(', ')
    } catch { toast.error('Product not found'); navigateTo('/products') }
  }
})
</script>
