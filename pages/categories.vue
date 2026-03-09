<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex items-center justify-between mb-6">
      <div><h1 class="text-2xl font-bold text-white">Categories</h1><p class="text-dark-400 text-sm mt-1">Manage product categories and settings</p></div>
      <button @click="showForm = true; editingId = ''" class="btn-primary"><Icon name="lucide:plus" class="w-4 h-4" /> Add Category</button>
    </div>

    <!-- Category Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-dark-850 border border-dark-700 rounded-2xl p-6 w-full max-w-md animate-slide-up">
        <h2 class="text-lg font-semibold text-white mb-4">{{ editingId ? 'Edit' : 'New' }} Category</h2>
        <form @submit.prevent="handleSave" class="space-y-4">
          <div><label class="label">Name</label><input v-model="form.name" class="input" required /></div>
          <div><label class="label">Slug</label><input v-model="form.slug" class="input" required /></div>
          <div><label class="label">Description</label><textarea v-model="form.description" class="input min-h-[80px]" /></div>
          <div><label class="label">Sort Order</label><input v-model.number="form.sortOrder" type="number" class="input" /></div>
          <div class="flex items-center gap-2">
            <input v-model="form.isActive" type="checkbox" id="catActive" class="rounded bg-dark-800 border-dark-600 text-primary-600" />
            <label for="catActive" class="text-sm text-dark-300">Active</label>
          </div>
          <div class="flex gap-3">
            <button type="submit" class="btn-primary flex-1" :disabled="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
            <button type="button" @click="showForm = false" class="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Categories List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="c in categories" :key="c._id" class="card-hover">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold text-white">{{ c.name }}</h3>
          <span :class="c.isActive ? 'badge-success' : 'badge-danger'">{{ c.isActive ? 'Active' : 'Inactive' }}</span>
        </div>
        <p class="text-dark-400 text-sm mb-3">{{ c.description || 'No description' }}</p>
        <code class="text-xs bg-dark-800 px-2 py-0.5 rounded text-dark-300">{{ c.slug }}</code>
        <div class="flex gap-2 mt-4">
          <button @click="editCategory(c)" class="btn-ghost btn-sm"><Icon name="lucide:edit" class="w-3.5 h-3.5" /> Edit</button>
          <button @click="handleDelete(c)" class="btn-ghost btn-sm text-red-400"><Icon name="lucide:trash-2" class="w-3.5 h-3.5" /> Delete</button>
        </div>
      </div>
      <div v-if="categories.length === 0" class="col-span-full text-center py-12 text-dark-400">No categories yet</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types'
import { useFetchCategories } from '@/composables/modules/products/useFetchCategories'
import { useSaveCategory } from '@/composables/modules/products/useSaveCategory'
import { useDeleteCategory } from '@/composables/modules/products/useDeleteCategory'

definePageMeta({ layout: 'dashboard' })

const { categories, loading, fetchCategories } = useFetchCategories()
const { saveCategory: saveAction, loading: saving } = useSaveCategory()
const { deleteCategory: deleteAction } = useDeleteCategory()

const showForm = ref(false)
const editingId = ref('')
const form = ref({ name: '', slug: '', description: '', sortOrder: 0, isActive: true })

watch(() => form.value.name, (n) => {
  if (!editingId.value) form.value.slug = n.toLowerCase().replace(/[^a-z0-9]+/g, '-')
})

function editCategory(c: Category) {
  editingId.value = c._id
  Object.assign(form.value, {
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    sortOrder: c.sortOrder,
    isActive: c.isActive
  })
  showForm.value = true
}

async function handleSave() {
  const success = await saveAction(form.value, editingId.value)
  if (success) {
    showForm.value = false
    form.value = { name: '', slug: '', description: '', sortOrder: 0, isActive: true }
    fetchCategories()
  }
}

async function handleDelete(c: Category) {
  if (confirm(`Delete "${c.name}"?`)) {
    const success = await deleteAction(c._id)
    if (success) fetchCategories()
  }
}

onMounted(() => fetchCategories())
</script>
