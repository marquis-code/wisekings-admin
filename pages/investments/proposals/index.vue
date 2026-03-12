<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Investment Proposals</h1>
      <button 
        @click="showModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Create New Proposal
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="proposal in proposals" :key="proposal._id" class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <span 
            :class="[
              'px-2 py-1 rounded text-xs font-bold uppercase tracking-wider',
              proposal.category === 'diamond' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
            ]"
          >
            {{ proposal.category }}
          </span>
          <span class="text-xs text-gray-400">{{ proposal.status }}</span>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ proposal.title }}</h3>
        <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ proposal.description }}</p>
        
        <div class="space-y-2 mb-6">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Target</span>
            <span class="font-semibold text-gray-900">₦{{ formatCurrency(proposal.targetAmount) }}</span>
          </div>
          <div v-if="proposal.category === 'gold'" class="flex justify-between text-sm">
            <span class="text-gray-500">Interest</span>
            <span class="font-semibold text-blue-600">{{ proposal.interestRate }}% Flat</span>
          </div>
        </div>

        <button class="w-full py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
          View Details
        </button>
      </div>
    </div>

    <!-- Simple Create Modal (Simplified for demo/logic) -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h2 class="text-xl font-bold mb-4">New Investment Proposal</h2>
        <form @submit.prevent="createProposal" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input v-model="form.title" type="text" class="w-full px-4 py-2 border rounded-lg" required>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select v-model="form.category" class="w-full px-4 py-2 border rounded-lg">
                <option value="gold">Gold (Credit)</option>
                <option value="diamond">Diamond (Equity)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Target (₦)</label>
              <input v-model="form.targetAmount" type="number" class="w-full px-4 py-2 border rounded-lg" required>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="form.description" class="w-full px-4 py-2 border rounded-lg" rows="3"></textarea>
          </div>
          <div class="flex gap-4 pt-4">
            <button @click="showModal = false" type="button" class="flex-1 py-2 text-gray-500 font-medium">Cancel</button>
            <button type="submit" class="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium">Publish</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const proposals = ref([]);
const showModal = ref(false);
const form = ref({
  title: '',
  description: '',
  category: 'gold',
  targetAmount: 0,
  minInvestment: 50000,
  status: 'open'
});

const fetchProposals = async () => {
  try {
    const { data } = await axios.get('/api/investments/proposals');
    proposals.value = data;
  } catch (err) {
    console.error('Failed to fetch proposals:', err);
  }
};

const createProposal = async () => {
  try {
    await axios.post('/api/investments/proposals', form.value);
    showModal.value = false;
    await fetchProposals();
  } catch (err) {
    alert('Error creating proposal');
  }
};

const formatCurrency = (val) => new Intl.NumberFormat('en-NG').format(val || 0);

onMounted(fetchProposals);
</script>
