<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Automated Investment Records</h1>
      <NuxtLink 
        to="/investments/proposals" 
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Manage Proposals
      </NuxtLink>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <p class="text-sm text-gray-500 mb-1">{{ stat.label }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Investment Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice No.</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Investor / Customer</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Value (₦)</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Returns (₦)</th>
              <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in investments" :key="item._id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 font-mono text-sm">{{ item.invoiceNo }}</td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ item.partnerId?.companyName || 'N/A' }}</div>
                <div class="text-xs text-gray-500">{{ item.customer }}</div>
              </td>
              <td class="px-6 py-4 text-sm">{{ formatCurrency(item.invoiceValue) }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(item.dueDate) }}</td>
              <td class="px-6 py-4">
                <span 
                  :class="[
                    'px-2.5 py-1 rounded-full text-xs font-medium',
                    item.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  ]"
                >
                  {{ item.paymentStatus }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm font-semibold text-blue-600">
                {{ formatCurrency(item.investorReturn) }}
              </td>
              <td class="px-6 py-4">
                <button 
                  v-if="item.paymentStatus !== 'paid'"
                  @click="markAsPaid(item._id)"
                  class="text-sm text-blue-600 hover:underline font-medium"
                >
                  Mark Paid
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const investments = ref([]);
const stats = computed(() => {
  const total = investments.value.reduce((acc, curr) => acc + curr.invoiceValue, 0);
  const returns = investments.value.reduce((acc, curr) => acc + curr.investorReturn, 0);
  const paid = investments.value.filter(i => i.paymentStatus === 'paid').length;
  
  return [
    { label: 'Total Portfolio', value: `₦${formatCurrency(total)}` },
    { label: 'Expected Returns', value: `₦${formatCurrency(returns)}` },
    { label: 'Active Records', value: investments.value.length },
    { label: 'Settled', value: paid }
  ];
});

const fetchInvestments = async () => {
  try {
    const { data } = await axios.get('/api/investments/all');
    investments.value = data;
  } catch (err) {
    console.error('Failed to fetch investments:', err);
  }
};

const markAsPaid = async (id) => {
  if (!confirm('Mark this investment as paid? This will notify the partner.')) return;
  try {
    await axios.put(`/api/investments/${id}/status`, { paymentStatus: 'paid' });
    await fetchInvestments();
  } catch (err) {
    alert('Failed to update status');
  }
};

const formatCurrency = (val) => new Intl.NumberFormat('en-NG').format(val || 0);
const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A';

onMounted(fetchInvestments);
</script>
