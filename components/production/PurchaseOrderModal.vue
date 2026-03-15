<template>
  <CoreModal :show="show" @close="$emit('close')" title="Generate Purchase Order" size="xl">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 p-2">
      <!-- Form Side -->
      <div class="space-y-8 h-[70vh] overflow-y-auto pr-6 custom-scrollbar">
        <div class="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-6">
          <h3 class="text-xs font-black text-[#033958] uppercase tracking-widest flex items-center gap-2">
            <Icon name="lucide:user" size="14" /> Vendor Information
          </h3>
          <CoreInput v-model="form.vendorName" label="Vendor Name" placeholder="e.g. Salami Plantain Farms" required />
          <div class="grid grid-cols-2 gap-4">
             <CoreInput v-model="form.vendorEmail" label="Email" placeholder="vendor@example.com" />
             <CoreInput v-model="form.vendorPhone" label="Phone" placeholder="+234..." />
          </div>
        </div>

        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-black text-[#033958] uppercase tracking-widest flex items-center gap-2">
              <Icon name="lucide:list-ordered" size="14" /> Order Items
            </h3>
            <button @click="addItem" type="button" class="text-[10px] font-black uppercase text-[#033958] bg-[#033958]/5 px-4 py-2 rounded-xl hover:bg-[#033958] hover:text-white transition-all">
              + Add Item
            </button>
          </div>

          <div v-for="(item, index) in form.items" :key="index" class="grid grid-cols-12 gap-4 items-end bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative group">
             <div class="col-span-12 md:col-span-5">
                <CoreInput v-model="item.description" label="Description" placeholder="e.g. Ripe Plantain" />
             </div>
             <div class="col-span-5 md:col-span-3">
                <CoreInput v-model="item.quantity" type="number" label="Qty" placeholder="1" />
             </div>
             <div class="col-span-5 md:col-span-3">
                <CoreInput v-model="item.unitPrice" type="number" label="Price" placeholder="0.00" />
             </div>
             <div class="col-span-2 md:col-span-1 pb-1.5 flex justify-end">
                <button @click="removeItem(index)" type="button" class="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                  <Icon name="lucide:x" size="14" />
                </button>
             </div>
          </div>
        </div>

        <CoreTextarea v-model="form.notes" label="Notes / Terms" placeholder="Add any specific instructions..." />
      </div>

      <!-- Live Preview (Invoice) -->
      <div class="hidden lg:block">
        <div class="bg-gray-100 rounded-[3rem] p-4 h-full relative overflow-hidden group">
           <div class="absolute inset-0 bg-gradient-to-br from-[#033958]/5 to-transparent"></div>
           
           <div class="relative bg-white h-full rounded-[2.5rem] shadow-2xl p-10 flex flex-col transform group-hover:scale-[1.01] transition-transform duration-700">
              <div class="flex justify-between items-start mb-12">
                 <div>
                    <img src="@/assets/images/logo.jpg" class="w-16 h-16 rounded-2xl mb-4 grayscale" alt="Logo" />
                    <p class="text-[10px] font-black uppercase tracking-[0.3em] text-[#033958]">WiseKings HQ</p>
                    <p class="text-[8px] font-bold text-gray-400 mt-1 uppercase">Lagos, Nigeria</p>
                 </div>
                 <div class="text-right">
                    <h2 class="text-2xl font-black text-gray-900 uppercase tracking-tighter">Purchase Order</h2>
                    <p class="text-xs font-black text-amber-600 mt-1 uppercase">{{ form.poNumber }}</p>
                    <p class="text-[10px] text-gray-400 mt-4">{{ new Date().toLocaleDateString() }}</p>
                 </div>
              </div>

              <div class="grid grid-cols-2 gap-10 mb-12">
                 <div>
                    <p class="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2">Order To:</p>
                    <p class="text-sm font-black text-gray-900 uppercase">{{ form.vendorName || 'Vandor Name' }}</p>
                    <p class="text-[10px] font-bold text-gray-400 mt-1 truncate">{{ form.vendorEmail || 'Email' }}</p>
                 </div>
              </div>

              <div class="flex-1 overflow-hidden">
                 <table class="w-full text-left">
                    <thead>
                       <tr class="border-b-2 border-gray-950">
                          <th class="py-4 text-[9px] font-black uppercase tracking-widest">Item Description</th>
                          <th class="py-4 text-center text-[9px] font-black uppercase tracking-widest">Qty</th>
                          <th class="py-4 text-right text-[9px] font-black uppercase tracking-widest">Total</th>
                       </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                       <tr v-for="(item, i) in form.items" :key="i">
                          <td class="py-4">
                             <p class="text-xs font-black text-gray-800 uppercase">{{ item.description || 'Description' }}</p>
                             <p class="text-[9px] text-gray-400">@ ₦{{ item.unitPrice.toLocaleString() }} / unit</p>
                          </td>
                          <td class="py-4 text-center text-xs font-bold text-gray-500">{{ item.quantity }}</td>
                          <td class="py-4 text-right text-xs font-black text-gray-950">₦{{ (item.quantity * item.unitPrice).toLocaleString() }}</td>
                       </tr>
                    </tbody>
                 </table>
              </div>

              <div class="pt-8 mt-auto border-t-2 border-gray-950 flex justify-between items-end">
                 <div class="max-w-[150px]">
                    <p class="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2">Terms:</p>
                    <p class="text-[9px] font-medium text-gray-400 line-clamp-3">{{ form.notes || 'No specific terms.' }}</p>
                 </div>
                 <div class="text-right">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Payable</p>
                    <p class="text-3xl font-black text-gray-900 tracking-tighter">₦ {{ totalAmount.toLocaleString() }}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-8 border-t px-2">
      <button type="button" @click="$emit('close')" class="btn-secondary">Dismiss</button>
      <button @click="handleSubmit" class="btn-primary" :disabled="loading || !canSave">
        <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 animate-spin mr-2" />
        <Icon name="lucide:check-circle-2" class="w-4 h-4 mr-2" v-else />
        Approve & Save Order
      </button>
    </div>
  </CoreModal>
</template>

<script setup lang="ts">
import { usePurchaseOrders } from '@/composables/modules/production/usePurchaseOrders'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close', 'success'])

const { createOrder, loading } = usePurchaseOrders()

const form = reactive({
  poNumber: `PO-${new Date().getTime().toString().slice(-6)}`,
  vendorName: '',
  vendorEmail: '',
  vendorPhone: '',
  items: [{ description: '', quantity: 1, unitPrice: 0 }],
  notes: '',
  status: 'pending'
})

const totalAmount = computed(() => {
  return form.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
})

const canSave = computed(() => {
  return form.vendorName && form.items.length > 0 && form.items.every(i => i.description && i.quantity > 0 && i.unitPrice > 0)
})

function addItem() {
  form.items.push({ description: '', quantity: 1, unitPrice: 0 })
}

function removeItem(index: number) {
  form.items.splice(index, 1)
}

async function handleSubmit() {
  const success = await createOrder(form)
  if (success) {
    emit('success')
    emit('close')
    resetForm()
  }
}

function resetForm() {
  form.poNumber = `PO-${new Date().getTime().toString().slice(-6)}`
  form.vendorName = ''
  form.vendorEmail = ''
  form.vendorPhone = ''
  form.items = [{ description: '', quantity: 1, unitPrice: 0 }]
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
