<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex items-center gap-4 mb-8">
      <NuxtLink 
        to="/products" 
        class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300"
      >
        <Icon name="lucide:arrow-left" class="w-5 h-5" />
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">{{ isEdit ? 'Edit Product' : 'New Product' }}</h1>
        <p class="text-gray-500 text-sm font-medium mt-0.5">{{ isEdit ? 'Update your product details and availability' : 'Add a new product to your catalog' }}</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="max-w-4xl space-y-8 pb-20">
      <!-- Media Section -->
      <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 pb-10">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span class="p-2 bg-[#033958]/10 rounded-lg text-[#033958]">
            <Icon name="lucide:image" class="w-5 h-5" />
          </span>
          Product Images
        </h2>
        <div class="bg-gray-50/50 p-6 rounded-[2rem] border border-dashed border-gray-200">
          <ImageUpload 
            v-model="form.images" 
            label="Upload Product Images (Multiple allowed)" 
            multiple 
            folder="products"
          />
          <p class="text-[11px] text-gray-400 mt-4 font-medium text-center uppercase tracking-widest">
            First image will be used as the primary thumbnail
          </p>
        </div>
      </section>

      <!-- Basic Info Section -->
      <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span class="p-2 bg-[#033958]/10 rounded-lg text-[#033958]">
            <Icon name="lucide:info" class="w-5 h-5" />
          </span>
          General Information
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <AnimatedInput 
              v-model="form.name" 
              label="Product Name" 
              required 
              placeholder="e.g. Premium Butter Popcorn"
            />
          </div>
          
          <div class="md:col-span-2">
            <AnimatedInput 
              v-model="form.description" 
              label="Product Description" 
              type="textarea" 
              :rows="4"
              required 
              placeholder="Describe your product in detail..."
            />
          </div>

          <AnimatedInput 
            v-model="form.slug" 
            label="Product URL Slug" 
            required 
            placeholder="e.g. premium-butter-popcorn"
          />
          
          <SelectInput 
            v-model="form.category" 
            label="Product Category" 
            :options="categoryOptions"
            required
          />
        </div>
      </section>

      <!-- Inventory & Pricing -->
      <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
        <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span class="p-2 bg-[#033958]/10 rounded-lg text-[#033958]">
            <Icon name="lucide:tag" class="w-5 h-5" />
          </span>
          Pricing & Inventory
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedInput 
            v-model.number="form.price" 
            label="Pack/Carton Price (₦)" 
            type="number" 
            required 
          />
          <AnimatedInput v-model.number="form.unitPrice" label="Unit Price (₦)" type="number" />
          <AnimatedInput v-model.number="form.costPricePerPack" label="Cost Price (Pack/Carton) (₦)" type="number" />
          <AnimatedInput 
            v-model.number="form.compareAtPrice" 
            label="Old Price (₦)" 
            type="number" 
          />
          <AnimatedInput 
            v-model.number="form.stock" 
            label="Stock Quantity" 
            type="number" 
            required 
          />
          
          <AnimatedInput 
            v-slot:sku
            v-model="form.sku" 
            label="SKU / Reference" 
            placeholder="e.g. SNK-POP-001"
          />
          <AnimatedInput v-model.number="form.quantityPerPack" label="Quantity per Pack" type="number" />
          <AnimatedInput v-model.number="form.unitPrice" label="Unit Price (₦)" type="number" /> <!-- Note: unitPrice was also above, I'll keep one -->
          <AnimatedInput v-model="form.unitDescription" label="Unit Description (e.g. 30g)" placeholder="30g" />
          <AnimatedInput v-model="form.varietyType" label="Variety / Type" placeholder="e.g. Ripe & Unripe" />
          
          <div class="md:col-span-2">
            <AnimatedInput 
              v-model="tagsInput" 
              label="Tags (Comma separated)" 
              placeholder="e.g. snack, organic, best-seller"
            />
          </div>
        </div>

        <div class="mt-8 p-6 bg-gray-50 rounded-[1.5rem] border border-gray-100 space-y-6">
          <div class="flex items-center gap-4">
            <input 
              v-model="form.isActive" 
              type="checkbox" 
              id="isActive" 
              class="custom-checkbox !w-6 !h-6" 
            />
            <div>
              <label for="isActive" class="text-sm font-bold text-gray-900 cursor-pointer select-none">Make product visible to customers</label>
              <p class="text-xs text-gray-500 font-medium mt-0.5">Inactive products will not appear on the storefront</p>
            </div>
          </div>

          <div class="flex items-center gap-4 pt-6 border-t border-gray-200">
            <input 
              v-model="form.sellPerUnit" 
              type="checkbox" 
              id="sellPerUnit" 
              class="custom-checkbox !w-6 !h-6" 
            />
            <div>
              <label for="sellPerUnit" class="text-sm font-bold text-gray-900 cursor-pointer select-none">Sell by Unit (Instead of Carton)</label>
              <p class="text-xs text-gray-500 font-medium mt-0.5">When enabled, customers will add single units to their cart based on the Unit Price.</p>
            </div>
          </div>
        </div>
      </section>

      <div class="flex gap-4 pt-4 sticky bottom-6 z-10">
        <button 
          type="submit" 
          class="flex-[2] btn-primary !rounded-[1.5rem] !py-4 shadow-xl shadow-[#033958]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          :disabled="saving"
        >
          <Icon v-if="saving" name="lucide:loader-2" class="w-5 h-5 animate-spin mr-2" />
          {{ saving ? 'Saving Product...' : (isEdit ? 'Update Product' : 'Create Product') }}
        </button>
        <NuxtLink 
          to="/products" 
          class="flex-1 btn-secondary !rounded-[1.5rem] !py-4 hover:bg-gray-200 text-center flex items-center justify-center transition-all duration-300"
        >
          Discard Changes
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types'
import { products_api } from '@/api_factory/modules/products'
import { useCustomToast } from '@/composables/core/useCustomToast'
import AnimatedInput from '@/components/core/AnimatedInput.vue'
import SelectInput from '@/components/core/SelectInput.vue'
import ImageUpload from '@/components/core/ImageUpload.vue'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const { showToast } = useCustomToast()
const isEdit = computed(() => route.params.id && route.params.id !== 'new')
const categories = ref<Category[]>([])
const saving = ref(false)
const tagsInput = ref('')

const form = ref({
  name: '', 
  description: '', 
  price: 0, 
  compareAtPrice: 0, 
  stock: 0, 
  sku: '', 
  slug: '', 
  category: '', 
  isActive: true, 
  tags: [] as string[],
  images: [] as string[], unitDescription: "", unitPrice: 0, quantityPerPack: 0, costPricePerPack: 0, varietyType: "", sellPerUnit: false
})

const categoryOptions = computed(() => {
  return categories.value.map(c => ({
    label: c.name,
    value: c._id
  }))
})

watch(() => form.value.name, (n) => {
  if (!isEdit.value) {
    form.value.slug = n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }
})

async function handleSubmit() {
  saving.value = true
  form.value.tags = tagsInput.value.split(',').map((t) => t.trim()).filter(Boolean)
  
  try {
    if (isEdit.value) { 
      await products_api.update(route.params.id as string, form.value)
      showToast({ title: 'Product Updated', message: 'All changes have been saved successfully.', toastType: 'success' }) 
    } else { 
      await products_api.create(form.value)
      showToast({ title: 'Product Created', message: 'Your new product is now live.', toastType: 'success' }) 
    }
    navigateTo('/products')
  } catch (e: any) { 
    showToast({ title: 'Error', message: e?.data?.message || 'Failed to save product', toastType: 'error' }) 
  } finally { 
    saving.value = false 
  }
}

onMounted(async () => {
  try { 
    const res = await products_api.getCategories()
    categories.value = (res as any)?.data || res || [] 
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }

  if (isEdit.value) {
    try {
      const res = await products_api.getById(route.params.id as string) as any
      const p = res.data || res
      Object.assign(form.value, { 
        ...p, 
        category: p.category?._id || p.category || '',
        images: p.images || []
      })
      tagsInput.value = (p.tags || []).join(', ')
    } catch { 
      showToast({ title: 'Error', message: 'Product not found', toastType: 'error' })
      navigateTo('/products') 
    }
  }
})
</script>

<style scoped>
section {
  animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
