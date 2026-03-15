<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Categories</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Manage and organize your product catalog</p>
      </div>
      <button 
        @click="openAddModal" 
        class="group btn-primary !rounded-2xl !px-6 !py-3 shadow-lg shadow-[#033958]/10 hover:shadow-[#033958]/20 transition-all duration-300"
      >
        <span class="flex items-center gap-2">
          <Icon name="lucide:plus" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 
          Add Category
        </span>
      </button>
    </div>

    <!-- Categories Table -->
    <div class="table-container bg-white shadow-sm border-gray-100 overflow-hidden !rounded-3xl">
      <table class="data-table">
        <thead>
          <tr class="!bg-gray-50/50">
            <th class="!py-5 !pl-6">Image</th>
            <th class="!py-5">Category Name</th>
            <th class="!py-5">Slug</th>
            <th class="!py-5">Description</th>
            <th class="!py-5">Sort Order</th>
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
          <tr v-else-if="categories.length === 0">
            <td colspan="7" class="!py-10">
              <CoreEmptyState 
                icon="lucide:layers" 
                title="No categories found" 
                description="Organize your products by creating categories for better discoverability."
              />
            </td>
          </tr>
          <tr v-for="c in categories" :key="c._id" class="group">
            <td class="!py-4 !pl-6">
              <div class="w-12 h-12 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                <img v-if="c.image" :src="c.image" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <Icon name="lucide:image" class="w-5 h-5 text-gray-300" />
                </div>
              </div>
            </td>
            <td class="!py-4 font-bold text-gray-900">{{ c.name }}</td>
            <td class="!py-4">
              <span class="inline-flex px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                {{ c.slug }}
              </span>
            </td>
            <td class="!py-4 max-w-xs truncate text-gray-500 font-medium">{{ c.description || '—' }}</td>
            <td class="!py-4 text-center font-mono font-bold">{{ c.sortOrder }}</td>
            <td class="!py-4">
              <span :class="c.isActive ? 'badge-success !bg-emerald-50 !text-emerald-700 !border-emerald-100' : 'badge-danger !bg-red-50 !text-red-700 !border-red-100'">
                {{ c.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="!py-4 !pr-6 text-right">
              <div class="flex items-center justify-end gap-3 transition-opacity">
                <button 
                  @click="editCategory(c)" 
                  class="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-900 text-white shadow-xl shadow-black/10 hover:scale-110 active:scale-95 transition-all"
                  title="Edit Category"
                >
                  <Icon name="lucide:settings-2" class="w-5 h-5" />
                </button>
                <button 
                  @click="handleDelete(c)" 
                  class="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-red-500 hover:bg-red-50 hover:border-red-200 shadow-sm hover:scale-110 active:scale-95 transition-all"
                  title="Delete Category"
                >
                  <Icon name="lucide:trash-2" class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Category Form Modal (Premium White Design) -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showForm" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/20 backdrop-blur-sm" @click="showForm = false"></div>
          
          <!-- Modal Content -->
          <div class="relative bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl animate-modal-in overflow-hidden border border-white">
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-8">
                <div>
                  <h2 class="text-2xl font-black text-gray-900 tracking-tight">{{ editingId ? 'Update' : 'Create' }} Category</h2>
                  <p class="text-gray-500 text-sm font-medium mt-1">Fill in the details for your product category</p>
                </div>
                <button 
                  @click="showForm = false" 
                  class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300"
                >
                  <Icon name="lucide:x" class="w-6 h-6" />
                </button>
              </div>

              <form @submit.prevent="handleSave" class="space-y-6">
                <!-- Image Upload Section -->
                <div class="mb-8">
                  <ImageUpload 
                    v-model="form.image" 
                    label="Category Image" 
                    folder="categories"
                    class="!rounded-[2rem]"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatedInput 
                    v-model="form.name" 
                    label="Category Name" 
                    required 
                    placeholder="e.g. Snacks"
                  />
                  <AnimatedInput 
                    v-model="form.slug" 
                    label="Slug" 
                    required 
                    placeholder="e.g. snacks"
                  />
                </div>

                <AnimatedInput 
                  v-model="form.description" 
                  label="Description" 
                  type="textarea" 
                  :rows="3"
                  placeholder="Tell us a bit about this category..."
                />

                <div class="flex flex-col md:flex-row md:items-center gap-6">
                  <div class="flex-1">
                    <AnimatedInput 
                      v-model.number="form.sortOrder" 
                      label="Sort Order" 
                      type="number" 
                    />
                  </div>
                  <div class="flex items-center gap-3 px-4 py-4 bg-gray-50 rounded-2xl border border-gray-100 min-w-[200px]">
                    <div class="relative">
                      <input 
                        v-model="form.isActive" 
                        type="checkbox" 
                        id="catActive" 
                        class="custom-checkbox !w-6 !h-6" 
                      />
                    </div>
                    <label for="catActive" class="text-sm font-bold text-gray-700 cursor-pointer select-none">Mark as Active</label>
                  </div>
                </div>

                <div class="flex gap-4 pt-4">
                  <button 
                    type="submit" 
                    class="flex-[2] btn-primary !rounded-[1.5rem] !py-4 shadow-xl shadow-[#033958]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    :disabled="saving"
                  >
                    <Icon v-if="saving" name="lucide:loader-2" class="w-5 h-5 animate-spin mr-2" />
                    {{ saving ? 'Processing...' : (editingId ? 'Save Changes' : 'Create Category') }}
                  </button>
                  <button 
                    type="button" 
                    @click="showForm = false" 
                    class="flex-1 btn-secondary !rounded-[1.5rem] !py-4 hover:bg-gray-200 transition-all duration-300"
                  >
                    Discard
                  </button>
                </div>
              </form>
            </div>

            <!-- Absolute decorative element -->
            <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-gray-50/50 rounded-full blur-3xl -z-0"></div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types'
import { useFetchCategories } from '@/composables/modules/products/useFetchCategories'
import { useSaveCategory } from '@/composables/modules/products/useSaveCategory'
import { useDeleteCategory } from '@/composables/modules/products/useDeleteCategory'
import { useConfirm } from '@/composables/core/useConfirm'
import AnimatedInput from '@/components/core/AnimatedInput.vue'
import ImageUpload from '@/components/core/ImageUpload.vue'

definePageMeta({ layout: 'dashboard' })

const { categories, loading, fetchCategories } = useFetchCategories()
const { saveCategory: saveAction, loading: saving } = useSaveCategory()
const { deleteCategory: deleteAction } = useDeleteCategory()
const { confirmDelete } = useConfirm()

const showForm = ref(false)
const editingId = ref('')
const form = ref({ name: '', slug: '', description: '', image: '', sortOrder: 0, isActive: true })

watch(() => form.value.name, (n) => {
  if (!editingId.value) {
    form.value.slug = n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }
})

function openAddModal() {
  editingId.value = ''
  form.value = { name: '', slug: '', description: '', image: '', sortOrder: 0, isActive: true }
  showForm.value = true
}

function editCategory(c: Category) {
  editingId.value = c._id
  Object.assign(form.value, {
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    image: c.image || '',
    sortOrder: c.sortOrder,
    isActive: c.isActive
  })
  showForm.value = true
}

async function handleSave() {
  const success = await saveAction(form.value, editingId.value)
  if (success) {
    showForm.value = false
    fetchCategories()
  }
}

async function handleDelete(c: Category) {
  if (await confirmDelete('Delete Category', `Are you sure you want to delete "${c.name}"? This action cannot be undone.`)) {
    const success = await deleteAction(c._id)
    if (success) fetchCategories()
  }
}

onMounted(() => fetchCategories())
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.4s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.animate-modal-in {
  animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.badge-success {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-width: 1px;
}

.badge-danger {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-width: 1px;
}
</style>
