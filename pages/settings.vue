<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="mb-6"><h1 class="text-2xl font-bold text-white">Settings</h1><p class="text-dark-400 text-sm mt-1">Platform configuration</p></div>
    <div class="max-w-2xl space-y-6">
      <div class="card">
        <h2 class="text-lg font-semibold text-white mb-4">Commission Rates</h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between py-2 border-b border-dark-700/50">
            <div><p class="text-sm font-medium text-white">Standard</p><p class="text-xs text-dark-400">Default merchant category</p></div>
            <span class="text-sm text-primary-400 font-semibold">3%</span>
          </div>
          <div class="flex items-center justify-between py-2 border-b border-dark-700/50">
            <div><p class="text-sm font-medium text-white">Gold</p><p class="text-xs text-dark-400">₦1M+ total sales</p></div>
            <span class="text-sm text-amber-400 font-semibold">5%</span>
          </div>
          <div class="flex items-center justify-between py-2">
            <div><p class="text-sm font-medium text-white">Premium</p><p class="text-xs text-dark-400">₦5M+ total sales</p></div>
            <span class="text-sm text-purple-400 font-semibold">7.5%</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-semibold text-white mb-4">Rank Thresholds (Monthly Sales)</h2>
        <div class="space-y-2">
          <div v-for="(rank, i) in ranks" :key="i" class="flex items-center justify-between py-2 border-b border-dark-700/50 last:border-0">
            <span class="text-sm font-medium text-white capitalize">{{ rank.name }}</span>
            <span class="text-xs text-dark-400">{{ rank.range }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 class="text-lg font-semibold text-white mb-4">Platform</h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-dark-400">Min Withdrawal</span>
            <span class="text-dark-200">₦10,000</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-dark-400">Referral Cookie Duration</span>
            <span class="text-dark-200">30 days</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const ranks = [
  { name: 'Starter', range: '₦0 – ₦99,999' },
  { name: 'Builder', range: '₦100,000 – ₦499,999' },
  { name: 'Silver', range: '₦500,000 – ₦999,999' },
  { name: 'Gold', range: '₦1,000,000 – ₦2,999,999' },
  { name: 'Platinum', range: '₦3,000,000 – ₦4,999,999' },
  { name: 'Diamond', range: '₦5,000,000+' },
]
</script>
