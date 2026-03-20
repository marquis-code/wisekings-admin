<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Configure global platform parameters and rules</p>
      </div>
      <div class="flex gap-2 p-1 bg-gray-100 rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar shrink-0">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id as any"
          :class="[
            'px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap',
            activeTab === tab.id ? 'bg-white text-[#033958] shadow-sm' : 'text-gray-400 hover:text-gray-600'
          ]"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- General Settings Tab -->
    <div v-if="activeTab === 'general'" class="max-w-4xl space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Commission Rates -->
        <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Icon name="lucide:percent" class="w-5 h-5" />
              </div>
              <h2 class="text-lg font-black text-gray-900 tracking-tight">Commissions</h2>
            </div>
            <button @click="addCommissionRate" class="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-amber-600 transition-all">
              <Icon name="lucide:plus" class="w-5 h-5" />
            </button>
          </div>
          
          <div class="space-y-4 flex-1">
            <div v-for="(rate, i) in globalSettings.commissionRates" :key="i" class="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all relative group">
              <div class="grid grid-cols-4 gap-3">
                <div class="col-span-3 space-y-2">
                  <input v-model="rate.name" placeholder="Name" class="w-full bg-transparent text-sm font-bold border-none p-0 focus:ring-0" />
                  <input v-model="rate.description" placeholder="Short description" class="w-full bg-transparent text-[10px] text-gray-400 font-medium uppercase p-0 focus:ring-0" />
                </div>
                <div class="flex items-center justify-end">
                   <div class="flex items-center">
                    <input v-model.number="rate.percentage" type="number" class="w-12 bg-white px-2 py-1 rounded-lg text-sm font-black text-[#033958] border border-gray-100 focus:ring-0" />
                    <span class="ml-1 text-sm font-black text-gray-400">%</span>
                   </div>
                </div>
              </div>
              <button @click="globalSettings.commissionRates.splice(i, 1)" class="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow-sm transition-all hover:bg-red-200">
                <Icon name="lucide:x" size="14" />
              </button>
            </div>
          </div>
        </div>

        <!-- Rank Thresholds -->
        <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Icon name="lucide:trending-up" class="w-5 h-5" />
              </div>
              <h2 class="text-lg font-black text-gray-900 tracking-tight">Ranks</h2>
            </div>
            <button @click="addRankThreshold" class="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-600 transition-all">
              <Icon name="lucide:plus" class="w-5 h-5" />
            </button>
          </div>
          
          <div class="space-y-3 flex-1">
            <div v-for="(rank, i) in globalSettings.rankThresholds" :key="i" class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 group relative">
              <input v-model="rank.name" class="text-sm font-bold text-gray-700 w-24 bg-transparent border-none p-0 focus:ring-0" />
              <div class="flex items-center gap-2">
                <input v-model.number="rank.minSales" type="number" class="w-20 text-[10px] font-mono font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded border border-transparent focus:bg-white focus:border-blue-100" />
                <span class="text-[10px] text-gray-300">→</span>
                <input v-model.number="rank.maxSales" type="number" class="w-20 text-[10px] font-mono font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded border border-transparent focus:bg-white focus:border-blue-100" placeholder="Max" />
              </div>
              <button @click="globalSettings.rankThresholds.splice(i, 1)" class="absolute -right-0 text-red-400 hover:text-red-600 transition-all">
                <Icon name="lucide:trash-2" size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Platform Settings -->
      <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Icon name="lucide:shield-check" class="w-5 h-5" />
            </div>
            <h2 class="text-lg font-black text-gray-900 tracking-tight">Platform Controls</h2>
          </div>
          <button 
            @click="saveGlobalSettings" 
            :disabled="savingGlobalSettings"
            class="px-10 py-3 bg-[#033958] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-[#033958]/20"
          >
            {{ savingGlobalSettings ? 'Saving...' : 'Apply Controls' }}
          </button>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Minimum Withdrawal</p>
            <div class="flex items-center gap-2">
              <span class="text-gray-400 font-bold">₦</span>
              <input v-model.number="globalSettings.minWithdrawal" type="number" class="w-full bg-transparent text-2xl font-black text-gray-900 border-none p-0 focus:ring-0" />
            </div>
          </div>
          <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Referral Cookie Life</p>
            <div class="flex items-center gap-2">
              <input v-model.number="globalSettings.referralCookieLife" type="number" class="w-16 bg-transparent text-2xl font-black text-gray-900 border-none p-0 focus:ring-0 text-right" />
              <span class="text-sm text-gray-400 uppercase font-black">Days</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pickup Locations Configuration -->
      <div class="bg-white rounded-[2.5rem] p-8 mt-8 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Icon name="lucide:map-pin" class="w-5 h-5" />
            </div>
            <h2 class="text-lg font-black text-gray-900 tracking-tight">Pickup Locations</h2>
          </div>
          <button @click="addPickupLocation" class="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-600 transition-all">
            <Icon name="lucide:plus" class="w-5 h-5" />
          </button>
        </div>
        
        <div class="space-y-6">
          <div v-for="(loc, i) in globalSettings.pickupLocations" :key="i" class="p-6 rounded-3xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all relative group">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div class="md:col-span-3">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Location Name</label>
                <input v-model="loc.name" class="w-full bg-white px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 focus:ring-0" />
              </div>
              <div class="md:col-span-4">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Full Address</label>
                <input v-model="loc.address" class="w-full bg-white px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 focus:ring-0" />
              </div>
              <div class="md:col-span-3">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Contact Phone</label>
                <input v-model="loc.phone" class="w-full bg-white px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 focus:ring-0" />
              </div>
              <div class="md:col-span-2 flex items-center justify-between">
                <div class="flex flex-col items-center">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Visible</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="loc.isActive" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#033958]"></div>
                  </label>
                </div>
                <button @click="globalSettings.pickupLocations.splice(i, 1)" class="p-2 rounded-xl text-red-100 group-hover:text-red-400 hover:bg-red-50 hover:text-red-600 transition-all">
                  <Icon name="lucide:trash-2" size="18" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Currency Rates Tab -->
    <div v-if="activeTab === 'currencies'" class="max-w-5xl space-y-8">
      <div class="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-10">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Icon name="lucide:refresh-cw" class="w-6 h-6" />
            </div>
            <div>
              <h2 class="text-xl font-black text-gray-900 tracking-tight">Exchange Rates</h2>
              <p class="text-sm text-gray-400 font-medium">Real-time currency rates relative to NGN (System Base)</p>
            </div>
          </div>
          <button 
            @click="fetchRates" 
            :disabled="loadingRates"
            class="px-8 py-3 bg-[#033958] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-[#033958]/20 flex items-center gap-2"
          >
            <Icon name="lucide:refresh-cw" :class="['w-4 h-4', loadingRates ? 'animate-spin' : '']" />
            {{ loadingRates ? 'Fetching...' : 'Refresh Rates' }}
          </button>
        </div>

        <div v-if="loadingRates" class="flex flex-col items-center justify-center py-20">
          <div class="w-10 h-10 border-4 border-gray-100 border-t-emerald-500 rounded-full animate-spin"></div>
          <p class="mt-4 text-xs font-black text-gray-400 uppercase tracking-widest">Updating from ExchangeRate API...</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(rate, code) in exchangeRates" :key="code" class="p-6 rounded-3xl bg-gray-50 border border-gray-100 group hover:border-[#033958] transition-all">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-black text-gray-400 uppercase tracking-widest">{{ code }}</span>
              <span class="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-lg shadow-sm">{{ getCurrencySymbol(code) }}</span>
            </div>
            <p class="text-2xl font-black text-gray-900">{{ formatSignificant(rate) }}</p>
            <p class="text-[9px] text-gray-400 font-bold uppercase tracking-tight mt-1">1 NGN = {{ formatSignificant(rate) }} {{ code }}</p>
          </div>
        </div>

        <div class="mt-10 p-8 bg-[#033958] rounded-[2.5rem] border border-[#033958]/10 relative overflow-hidden group">
          <!-- Background Accent -->
          <div class="absolute -right-20 -bottom-20 p-20 opacity-5 group-hover:scale-110 transition-transform duration-1000 text-white">
            <Icon name="lucide:dollar-sign" size="300" />
          </div>

          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 rounded-[2rem] bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10 shadow-xl">
                <Icon name="lucide:calculator" class="w-8 h-8" />
              </div>
              <div class="space-y-1">
                <h3 class="text-xl font-black text-white tracking-tight">Shipping Exchange Rate</h3>
                <p class="text-xs text-white/60 font-medium max-w-md">This USD rate is used globally for calculating international surcharges (e.g., Canada Home Delivery).</p>
              </div>
            </div>

            <div class="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl min-w-[240px]">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] font-black text-white/40 uppercase tracking-widest">Base Rate (1 USD)</span>
                <span class="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-widest">Live</span>
              </div>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-black text-white">₦ {{ formatSignificant(1 / (exchangeRates['USD'] || 0.00065)) }}</span>
              </div>
              <p class="text-[9px] text-white/40 font-medium uppercase mt-2 tracking-widest">Calculated: 1 / {{ formatSignificant(exchangeRates['USD']) }}</p>
            </div>
          </div>
        </div>

        <div class="mt-10 p-6 bg-blue-50 rounded-3xl border border-blue-100">
          <div class="flex gap-4">
            <Icon name="lucide:info" class="w-5 h-5 text-blue-600 shrink-0" />
            <div class="space-y-1">
              <p class="text-xs font-black text-blue-900 uppercase tracking-widest">Technical Note</p>
              <p class="text-xs text-blue-700 font-medium leading-relaxed">Exchange rates are fetched from the ExchangeRate API and cached in Redis for 24 hours to stay within API limits. Values shown are used globally for front-end price conversions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- KYC Configuration Tab -->
    <div v-if="activeTab === 'kyc'" class="max-w-5xl space-y-8">
      <div class="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-10">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Icon name="lucide:file-check" class="w-6 h-6" />
            </div>
            <div>
              <h2 class="text-xl font-black text-gray-900 tracking-tight">KYC Document Requirements</h2>
              <p class="text-sm text-gray-400 font-medium">Fine-tune verification documents by user type and location</p>
            </div>
          </div>
          <button 
            @click="saveKycDocuments" 
            :disabled="savingKyc"
            class="px-8 py-3 bg-[#033958] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-[#033958]/20"
          >
            {{ savingKyc ? 'Saving...' : 'Publish Configuration' }}
          </button>
        </div>
        
        <div v-if="loadingKyc" class="flex flex-col items-center justify-center py-20">
          <div class="w-10 h-10 border-4 border-gray-100 border-t-[#033958] rounded-full animate-spin"></div>
          <p class="mt-4 text-xs font-black text-gray-400 uppercase tracking-widest">Fetching Configuration...</p>
        </div>

        <div v-else class="space-y-6">
          <div 
            v-for="(doc, i) in kycDocumentTypes" 
            :key="i"
            class="p-6 rounded-[2rem] bg-gray-50 border border-gray-100 relative group"
          >
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <!-- Name & Internal Value -->
              <div class="lg:col-span-4 space-y-4">
                <div>
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Document Name</label>
                  <input 
                    v-model="doc.label" 
                    placeholder="e.g. National ID Card" 
                    class="w-full px-4 py-3 text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-[1.25rem] focus:ring-1 focus:ring-[#033958] focus:border-[#033958] outline-none transition-all shadow-sm"
                  />
                </div>
                <!-- Read-only auto-generated value -->
                <div class="px-4 py-2 bg-gray-100/50 rounded-xl border border-gray-200">
                  <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Internal Reference</p>
                  <code class="text-[10px] font-mono font-bold text-[#033958]">{{ doc.value || '(Auto-generated)' }}</code>
                </div>
              </div>

              <!-- Content Filtering -->
              <div class="lg:col-span-4 space-y-4">
                  <SelectInput 
                    v-model="doc.target"
                    label="Target Account Type"
                    :options="[
                      { label: 'Merchants Only', value: 'merchant' },
                      { label: 'Partners Only', value: 'partner' },
                      { label: 'Both Merchants & Partners', value: 'both' }
                    ]"
                  />
                <div class="space-y-3">
                  <div class="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-[1.25rem] shadow-sm transition-all hover:border-indigo-100">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest flex-1">Is this mandatory?</label>
                    <div 
                      @click="doc.isRequired = !doc.isRequired"
                      :class="[
                        'w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-300',
                        doc.isRequired ? 'bg-indigo-600' : 'bg-gray-200'
                      ]"
                    >
                      <div :class="['w-3 h-3 rounded-full bg-white transition-transform duration-300', doc.isRequired ? 'translate-x-5' : 'translate-x-0']"></div>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-[1.25rem] shadow-sm transition-all hover:border-amber-100">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest flex-1">Requires ID Number?</label>
                    <div 
                      @click="doc.requiresIdNumber = !doc.requiresIdNumber"
                      :class="[
                        'w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-300',
                        doc.requiresIdNumber ? 'bg-amber-500' : 'bg-gray-200'
                      ]"
                    >
                      <div :class="['w-3 h-3 rounded-full bg-white transition-transform duration-300', doc.requiresIdNumber ? 'translate-x-5' : 'translate-x-0']"></div>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-[1.25rem] shadow-sm transition-all hover:border-emerald-100">
                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest flex-1">Requires Upload?</label>
                    <div 
                      @click="doc.requiresFileUpload = !doc.requiresFileUpload"
                      :class="[
                        'w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-300',
                        doc.requiresFileUpload ? 'bg-emerald-500' : 'bg-gray-200'
                      ]"
                    >
                      <div :class="['w-3 h-3 rounded-full bg-white transition-transform duration-300', doc.requiresFileUpload ? 'translate-x-5' : 'translate-x-0']"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Location Filtering -->
              <div class="lg:col-span-4 space-y-4">
                <div>
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Specific Countries (Optional)</label>
                  <div class="relative group/country">
                    <input 
                      v-model="countryInputs[i]"
                      @input="showCountryDropdown[i] = true"
                      @focus="showCountryDropdown[i] = true"
                      placeholder="Search and select country..." 
                      class="w-full px-4 py-3 text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-[1.25rem] focus:ring-1 focus:ring-[#033958] focus:border-[#033958] outline-none transition-all shadow-sm"
                    />
                    <!-- Searchable Dropdown -->
                    <div 
                      v-if="showCountryDropdown[i] && filteredCountries(countryInputs[i]).length"
                      class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-48 overflow-y-auto style-scrollbar border-t-0"
                    >
                      <button
                        v-for="country in filteredCountries(countryInputs[i])"
                        :key="country.code"
                        @click="addCountry(i, country.name); showCountryDropdown[i] = false"
                        class="w-full px-4 py-3 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0"
                      >
                        {{ country.name }}
                      </button>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-1.5 mt-2">
                    <span 
                      v-for="(c, ci) in doc.countries" 
                      :key="ci"
                      class="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg flex items-center gap-1 border border-indigo-100"
                    >
                      {{ c }}
                      <button @click="doc.countries.splice(ci, 1)" class="hover:text-red-500">
                        <Icon name="lucide:x" class="w-3 h-3" />
                      </button>
                    </span>
                    <span v-if="!doc.countries.length" class="text-[10px] text-gray-400 font-medium italic ml-1">Available for all regions</span>
                  </div>
                </div>
              </div>

              <!-- Delete Button -->
              <button 
                @click="kycDocumentTypes.splice(i, 1); countryInputs.splice(i, 1)" 
                class="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow-lg hover:bg-red-600 hover:text-white transition-all"
              >
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <button 
            @click="addDocumentType"
            class="w-full py-6 bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-widest rounded-3xl hover:bg-gray-100 transition-all flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200"
          >
            <div class="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-gray-400 shadow-sm">
              <Icon name="lucide:plus" class="w-5 h-5" />
            </div>
            Define New Requirement
          </button>
        </div>
      </div>
    </div>

    <!-- Shipping & Communications Tab -->
    <div v-if="activeTab === 'shipping'" class="max-w-7xl space-y-10 animate-fade-in">
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <!-- Delivery Rates (Left Side - Wider) -->
        <div class="xl:col-span-8 bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col">
          <div class="flex items-center justify-between mb-10 overflow-hidden">
            <div class="flex items-center gap-5">
              <div class="w-14 h-14 rounded-[2rem] bg-orange-50 flex items-center justify-center text-orange-600 border-2 border-orange-100 shadow-inner">
                <Icon name="lucide:truck" class="w-7 h-7" />
              </div>
              <div>
                <h2 class="text-2xl font-black text-gray-900 tracking-tight">Logistics Engine</h2>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Configure automated pricing algorithms</p>
              </div>
            </div>
            <button 
              @click="saveShippingConfig" 
              :disabled="savingShipping"
              class="group relative bg-[#033958] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#022f42] transition-all disabled:opacity-50 shadow-2xl shadow-[#033958]/20 flex items-center gap-3 active:scale-95"
            >
              <Icon v-if="savingShipping" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <Icon v-else name="lucide:save" class="w-4 h-4 group-hover:scale-110 transition-transform" />
              {{ savingShipping ? 'Synchronizing...' : 'Save Logistics' }}
            </button>
          </div>

          <div class="space-y-10 flex-1">
            <!-- Warehouse Origin -->
            <div class="p-8 bg-[#033958]/5 rounded-[2.5rem] border border-[#033958]/10 space-y-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#033958] shadow-sm border border-gray-100">
                  <Icon name="lucide:warehouse" size="24" />
                </div>
                <div>
                  <h3 class="text-sm font-black uppercase tracking-[0.2em] text-[#033958]">Warehouse Origin</h3>
                  <p class="text-[10px] text-gray-400 font-medium mt-1 italic">This address is the center of all local delivery calculations</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-[#033958]/40 ml-1 mb-2 block">Warehouse Street Address</label>
                  <CoreAddressAutocomplete 
                    v-model="shippingConfig.warehouseAddress" 
                    label="Warehouse Street Address" 
                    placeholder="Search for the warehouse location..." 
                    @place-changed="(data: any) => {
                      shippingConfig.warehouseAddress = data.address;
                      shippingConfig.warehouseLat = data.lat;
                      shippingConfig.warehouseLng = data.lng;
                    }"
                  />
                </div>
                <div class="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block">Latitude</label>
                  <input v-model.number="shippingConfig.warehouseLat" type="number" step="any" readonly class="w-full bg-transparent text-sm font-bold text-gray-900 border-none p-0 focus:ring-0" />
                </div>
                <div class="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block">Longitude</label>
                  <input v-model.number="shippingConfig.warehouseLng" type="number" step="any" readonly class="w-full bg-transparent text-sm font-bold text-gray-900 border-none p-0 focus:ring-0" />
                </div>
              </div>
            </div>

            <!-- Base Rates -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Base Delivery Fee (₦)</p>
                <input v-model.number="shippingConfig.baseFee" type="number" class="w-full bg-transparent text-2xl font-black text-[#033958] border-none p-0 focus:ring-0" />
              </div>
              <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Price Per KM (₦)</p>
                <input v-model.number="shippingConfig.pricePerKm" type="number" class="w-full bg-transparent text-2xl font-black text-[#033958] border-none p-0 focus:ring-0" />
              </div>
              <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Waybill Fee (₦)</p>
                <input v-model.number="shippingConfig.waybillFee" type="number" class="w-full bg-transparent text-2xl font-black text-[#033958] border-none p-0 focus:ring-0" />
              </div>
            </div>

            <!-- Pricing Tiers -->
            <div class="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-black uppercase tracking-[0.2em] text-[#033958]">Local Delivery Tiers</h3>
                  <p class="text-[10px] text-gray-400 font-medium mt-1 italic">Based on Google Maps distance (Meters)</p>
                </div>
                <button @click="addPricingTier" class="bg-white px-6 py-2.5 rounded-xl border border-gray-100 text-[10px] font-black uppercase tracking-widest text-[#033958] hover:bg-[#033958] hover:text-white hover:shadow-lg transition-all flex items-center gap-2">
                  <Icon name="lucide:plus" size="14" />
                  Add Tier
                </button>
              </div>
              
              <div v-if="shippingConfig.pricingTiers?.length" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div v-for="(tier, idx) in shippingConfig.pricingTiers" :key="idx" class="p-6 bg-white rounded-3xl border border-gray-100 grid grid-cols-3 gap-4 items-end group relative shadow-md hover:shadow-xl transition-all">
                  <div class="space-y-2">
                    <label class="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">From (m)</label>
                    <input v-model.number="tier.from" type="number" class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all font-mono" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">To (m)</label>
                    <input v-model.number="tier.to" type="number" class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all font-mono" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Price (₦)</label>
                    <input v-model.number="tier.price" type="number" class="w-full px-4 py-3 text-sm font-black text-[#033958] bg-orange-50/30 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-mono" />
                  </div>
                  <button @click="shippingConfig.pricingTiers.splice(idx, 1)" class="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-white text-red-500 flex items-center justify-center shadow-xl border border-red-50 hover:bg-red-500 hover:text-white transition-all scale-0 group-hover:scale-100">
                    <Icon name="lucide:trash-2" size="16" />
                  </button>
                </div>
              </div>
              <p v-else class="text-[10px] text-gray-400 italic text-center py-10 bg-white rounded-3xl border-2 border-dashed border-gray-100">No local tiers defined.</p>
            </div>

            <!-- International Zones -->
            <div class="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-black uppercase tracking-[0.2em] text-[#033958]">Global Shipping Zones</h3>
                  <p class="text-[10px] text-gray-400 font-medium mt-1 italic">Weight-based international rates</p>
                </div>
                <button @click="addInternationalZone" class="bg-white px-6 py-2.5 rounded-xl border border-gray-100 text-[10px] font-black uppercase tracking-widest text-[#033958] hover:bg-[#033958] hover:text-white hover:shadow-lg transition-all flex items-center gap-2">
                  <Icon name="lucide:plus" size="14" />
                  Add Zone
                </button>
              </div>

              <div v-if="shippingConfig.internationalZones?.length" class="space-y-6">
                <div v-for="(zone, idx) in shippingConfig.internationalZones" :key="idx" class="p-8 bg-white rounded-[2.5rem] border border-gray-100 space-y-8 relative group shadow-md hover:shadow-2xl transition-all">
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="space-y-2">
                      <label class="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Target Country</label>
                      <SelectInput 
                         v-model="zone.country" 
                         :options="countries.map(c => ({ label: c.name, value: c.name }))"
                         class="!mb-0"
                      />
                    </div>
                    <div class="space-y-2">
                      <label class="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Min Weight (KG)</label>
                      <input v-model.number="zone.minWeight" type="number" class="w-full px-5 py-3.5 text-sm font-bold bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                    </div>
                    <div class="space-y-2">
                      <label class="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Rate / KG (₦)</label>
                      <input v-model.number="zone.baseRatePerKg" type="number" class="w-full px-5 py-3.5 text-sm font-black text-emerald-600 bg-emerald-50/30 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono" />
                    </div>
                    <div class="space-y-2">
                      <label class="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">ETA Details</label>
                      <input v-model="zone.deliveryTime" class="w-full px-5 py-3.5 text-sm font-bold bg-orange-50/30 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all" placeholder="e.g. 7-14 Days" />
                    </div>
                  </div>
                  
                  <div v-if="zone.country === 'Canada'" class="flex items-center gap-6 p-6 bg-amber-50 rounded-[2rem] border-2 border-dashed border-amber-200">
                    <div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
                      <Icon name="lucide:home" size="28" />
                    </div>
                    <div class="flex-1">
                      <p class="text-[11px] font-black text-amber-900 uppercase tracking-[0.1em]">Doorstep Surcharge (Canada Special)</p>
                      <p class="text-[9px] text-amber-800/60 font-medium mb-2 uppercase italic leading-none">Added to base rate if user selects Home Delivery</p>
                      <div class="flex items-center gap-3">
                        <div class="h-12 w-32 bg-white rounded-xl flex items-center px-4 border border-amber-100">
                          <span class="text-amber-400 font-bold mr-2">USD $</span>
                          <input v-model.number="zone.surchargePerKg" type="number" class="bg-transparent text-xl font-black text-amber-950 border-none p-0 focus:ring-0 w-full" />
                        </div>
                        <span class="text-[10px] text-amber-500 font-black uppercase tracking-widest">per KG applied globally</span>
                      </div>
                    </div>
                  </div>

                  <button @click="shippingConfig.internationalZones.splice(idx, 1)" class="absolute -right-3 -top-3 w-10 h-10 rounded-full bg-white text-red-500 flex items-center justify-center shadow-xl border border-red-50 hover:bg-red-500 hover:text-white transition-all scale-0 group-hover:scale-100">
                    <Icon name="lucide:trash-2" size="20" />
                  </button>
                </div>
              </div>
              <p v-else class="text-[10px] text-gray-400 italic text-center py-10 bg-white rounded-3xl border-2 border-dashed border-gray-100">No international zones defined.</p>
            </div>
          </div>
        </div>

        <!-- Comms (Right Side - More Narrow) -->
        <div class="xl:col-span-4 space-y-10">
          <!-- System Comms -->
          <div class="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 space-y-8">
             <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                  <Icon name="lucide:mail" class="w-6 h-6" />
                </div>
                <div>
                  <h2 class="text-xl font-black text-gray-900 tracking-tight">Email Triggers</h2>
                  <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1">Map automation logic</p>
                </div>
              </div>

              <div class="space-y-6">
                <div v-for="trigger in emailTriggers" :key="trigger.id" class="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 space-y-4">
                  <div>
                    <p class="text-sm font-black text-gray-900 tracking-tight">{{ trigger.label }}</p>
                    <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wide mt-1 leading-relaxed">{{ trigger.description }}</p>
                  </div>
                  <SelectInput 
                    v-model="globalSettings.emailMappings[trigger.id]"
                    :label="`${trigger.label} Template`"
                    :options="[{ label: 'System Default', value: '' }, ...emailTemplates.map(t => ({ label: t.name, value: t._id }))]"
                    class="!mb-0"
                  />
                </div>
              </div>

              <button 
                @click="saveGlobalSettings" 
                :disabled="savingGlobalSettings"
                class="w-full py-5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
              >
                <Icon name="lucide:workflow" size="16" />
                Update Mappings
              </button>
          </div>

          <!-- WhatsApp alerts -->
          <div class="bg-white rounded-[3rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 space-y-8">
             <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <Icon name="lucide:message-circle" class="w-6 h-6" />
                </div>
                <div>
                  <h2 class="text-xl font-black text-gray-900 tracking-tight">WhatsApp HQ</h2>
                  <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-1">Core notification hub</p>
                </div>
              </div>

              <div class="space-y-6">
                 <div class="space-y-3">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Main Support/Order Phone</label>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-emerald-500 transition-colors">
                      <Icon name="lucide:phone" size="20" />
                    </div>
                    <input v-model="globalSettings.whatsappNumber" placeholder="234..." class="w-full pl-14 pr-6 py-4.5 bg-gray-50 border-none rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono" />
                  </div>
                  <p class="text-[9px] text-gray-400 font-medium italic mt-2 ml-1">Include country code without + (e.g., 23490...)</p>
                </div>
              </div>

              <button 
                @click="saveGlobalSettings" 
                :disabled="savingGlobalSettings"
                class="w-full py-5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-xl shadow-emerald-100 flex items-center justify-center gap-3"
              >
                <Icon name="lucide:zap" size="16" />
                Update WhatsApp
              </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bank Accounts Tab -->
    <div v-if="activeTab === 'bank'" class="max-w-5xl space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Customer Bank Details -->
        <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Icon name="lucide:user" class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-black text-gray-900 tracking-tight">Storefront</h2>
          </div>
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Number</label>
              <div class="relative">
                <input 
                  v-model="globalSettings.customerBankDetails.accountNumber" 
                  @input="resolveBank(globalSettings.customerBankDetails, 'customer')"
                  maxlength="10"
                  class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#033958] transition-all" 
                />
                <div v-if="resolvingBank === 'customer'" class="absolute right-4 top-3.5">
                  <Icon name="lucide:refresh-cw" class="w-4 h-4 text-[#033958] animate-spin" />
                </div>
              </div>
            </div>
            <div class="space-y-2">
              <SelectInput 
                v-model="globalSettings.customerBankDetails.bankName" 
                label="Bank Name"
                :options="banks.map(b => ({ label: b.name, value: b.name }))"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Name</label>
              <input v-model="globalSettings.customerBankDetails.accountName" readonly class="w-full px-4 py-3 text-sm font-bold bg-gray-100/50 border border-gray-100 rounded-2xl outline-none" placeholder="Verified account name..." />
            </div>
          </div>
        </div>

        <!-- Merchant Bank Details -->
        <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Icon name="lucide:shopping-bag" class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-black text-gray-900 tracking-tight">Merchants</h2>
          </div>
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Number</label>
              <div class="relative">
                <input 
                  v-model="globalSettings.merchantBankDetails.accountNumber" 
                  @input="resolveBank(globalSettings.merchantBankDetails, 'merchant')"
                  maxlength="10"
                  class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#033958] transition-all" 
                />
                <div v-if="resolvingBank === 'merchant'" class="absolute right-4 top-3.5">
                  <Icon name="lucide:refresh-cw" class="w-4 h-4 text-[#033958] animate-spin" />
                </div>
              </div>
            </div>
            <div class="space-y-2">
              <SelectInput 
                v-model="globalSettings.merchantBankDetails.bankName" 
                label="Bank Name"
                :options="banks.map(b => ({ label: b.name, value: b.name }))"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Name</label>
              <input v-model="globalSettings.merchantBankDetails.accountName" readonly class="w-full px-4 py-3 text-sm font-bold bg-gray-100/50 border border-gray-100 rounded-2xl outline-none" placeholder="Verified account name..." />
            </div>
          </div>
        </div>

        <!-- Partner Bank Details -->
        <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Icon name="lucide:briefcase" class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-black text-gray-900 tracking-tight">Partners</h2>
          </div>
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Number</label>
              <div class="relative">
                <input 
                  v-model="globalSettings.partnerBankDetails.accountNumber" 
                  @input="resolveBank(globalSettings.partnerBankDetails, 'partner')"
                  maxlength="10"
                  class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#033958] transition-all" 
                />
                <div v-if="resolvingBank === 'partner'" class="absolute right-4 top-3.5">
                  <Icon name="lucide:refresh-cw" class="w-4 h-4 text-[#033958] animate-spin" />
                </div>
              </div>
            </div>
            <div class="space-y-2">
              <SelectInput 
                v-model="globalSettings.partnerBankDetails.bankName" 
                label="Bank Name"
                :options="banks.map(b => ({ label: b.name, value: b.name }))"
              />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Name</label>
              <input v-model="globalSettings.partnerBankDetails.accountName" readonly class="w-full px-4 py-3 text-sm font-bold bg-gray-100/50 border border-gray-100 rounded-2xl outline-none" placeholder="Verified account name..." />
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="bg-white rounded-3xl p-6 border border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Icon name="lucide:info" class="w-5 h-5 text-gray-400" />
          <p class="text-xs text-gray-500 font-medium">Configure account details for direct bank transfers across all applications.</p>
        </div>
        <button 
          @click="saveGlobalSettings" 
          :disabled="savingGlobalSettings"
          class="px-10 py-3 bg-[#033958] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-[#033958]/20"
        >
          {{ savingGlobalSettings ? 'Saving...' : 'Apply Bank Settings' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { settings_api } from '@/api_factory/modules/settings'
import { shipping_api } from '@/api_factory/modules/shipping'
import { currencies_api } from '@/api_factory/modules/currencies'
import { email_templates_api } from '@/api_factory/modules/email-templates'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({ layout: 'dashboard' })
const { showToast } = useCustomToast()

const tabs = [
  { id: 'shipping', name: 'Shipping & Comms' },
  { id: 'general', name: 'General Platform' },
  { id: 'currencies', name: 'Currency Rates' },
  { id: 'kyc', name: 'KYC Configuration' },
  { id: 'bank', name: 'Bank Accounts' }
]
const activeTab = ref<'general' | 'kyc' | 'currencies' | 'shipping' | 'bank'>('shipping')

// Shipping Config
const shippingConfig = ref({
  baseFee: 1000,
  pricePerKm: 200,
  waybillFee: 3500,
  warehouseAddress: '',
  warehouseLat: 0,
  warehouseLng: 0,
  pricingTiers: [] as { from: number; to: number; price: number }[],
  internationalZones: [] as { country: string; minWeight: number; baseRatePerKg: number; deliveryTime: string; surchargePerKg: number }[]
})
const savingShipping = ref(false)
const loadingShipping = ref(false)

const globalSettings = ref({
    whatsappNumber: '',
    customerBankDetails: { accountName: '', accountNumber: '', bankName: '' },
    merchantBankDetails: { accountName: '', accountNumber: '', bankName: '' },
    partnerBankDetails: { accountName: '', accountNumber: '', bankName: '' },
    commissionRates: [] as { name: string, percentage: number, description: string }[],
    rankThresholds: [] as { name: string, minSales: number, maxSales?: number }[],
    emailMappings: {} as Record<string, string>,
    minWithdrawal: 10000,
    referralCookieLife: 30,
    pickupLocations: [
      { name: 'Company Depot', address: '20, Olorunfunmi street behind philips factory ojota', phone: '', isActive: false },
      { name: 'Factory Address', address: '13, Sonubi street, off Bakare street ketu, Lagos', phone: '', isActive: true }
    ]
})
const savingGlobalSettings = ref(false)


function addCommissionRate() {
  globalSettings.value.commissionRates.push({ name: 'New Tier', percentage: 1, description: '' })
}

function addRankThreshold() {
  globalSettings.value.rankThresholds.push({ name: 'New Rank', minSales: 0 })
}

async function fetchShippingConfig() {
  loadingShipping.value = true
  try {
    const res = await shipping_api.getShippingConfig()
    shippingConfig.value = res.data || res.data?.data || {}
  } catch (e) {
    console.error('Failed to load shipping config', e)
  } finally {
    loadingShipping.value = false
  }
}

async function saveShippingConfig() {
  savingShipping.value = true
  try {
    await shipping_api.updateShippingConfig(shippingConfig.value)
    showToast({ title: 'Success', message: 'Shipping configuration updated.', toastType: 'success' })
  } catch (e: any) {
    showToast({ title: 'Error', message: e.message || 'Failed to update.', toastType: 'error' })
  } finally {
    savingShipping.value = false
  }
}

function addPricingTier() {
  if (!shippingConfig.value.pricingTiers) shippingConfig.value.pricingTiers = []
  shippingConfig.value.pricingTiers.push({ from: 0, to: 1000, price: 0 })
}

function addInternationalZone() {
  if (!shippingConfig.value.internationalZones) shippingConfig.value.internationalZones = []
  shippingConfig.value.internationalZones.push({ country: '', minWeight: 11, baseRatePerKg: 0, deliveryTime: '2-3 Weeks', surchargePerKg: 0 })
}

async function fetchGlobalSettings() {
    try {
        const res = await settings_api.getSettings()
        const data = res.data || res.data?.data || {}
        globalSettings.value = {
            whatsappNumber: data.whatsappNumber || '',
            customerBankDetails: data.customerBankDetails || { accountName: '', accountNumber: '', bankName: '' },
            merchantBankDetails: data.merchantBankDetails || { accountName: '', accountNumber: '', bankName: '' },
            partnerBankDetails: data.partnerBankDetails || { accountName: '', accountNumber: '', bankName: '' },
            commissionRates: data.commissionRates || [],
            rankThresholds: data.rankThresholds || [],
            emailMappings: data.emailMappings || {},
            minWithdrawal: data.minWithdrawal || 10000,
            referralCookieLife: data.referralCookieLife || 30,
            pickupLocations: data.pickupLocations || [
              { name: 'Company Depot', address: '20, Olorunfunmi street behind philips factory ojota', phone: '', isActive: false },
              { name: 'Factory Address', address: '13, Sonubi street, off Bakare street ketu, Lagos', phone: '', isActive: true }
            ]
        }
    } catch (e) {
        console.error('Failed to load global settings', e)
    }
}

function addPickupLocation() {
    globalSettings.value.pickupLocations.push({ name: '', address: '', phone: '', isActive: true })
}

async function saveGlobalSettings() {
    savingGlobalSettings.value = true
    try {
        await settings_api.updateSettings(globalSettings.value)
        showToast({ title: 'Success', message: 'Global settings updated.', toastType: 'success' })
    } catch (e: any) {
        showToast({ title: 'Error', message: e.message || 'Failed to update.', toastType: 'error' })
    } finally {
        savingGlobalSettings.value = false
    }
}

const ranks = [
  { name: 'Starter', range: '₦0 – ₦99,999' },
  { name: 'Builder', range: '₦100,000 – ₦499,999' },
  { name: 'Silver', range: '₦500,000 – ₦999,999' },
  { name: 'Gold', range: '₦1,000,000 – ₦2,999,999' },
  { name: 'Platinum', range: '₦3,000,000 – ₦4,999,999' },
  { name: 'Diamond', range: '₦5,000,000+' },
]

// KYC Document Config
interface KycDoc {
  value: string;
  label: string;
  target: 'merchant' | 'partner' | 'both';
  isRequired: boolean;
  requiresIdNumber: boolean;
  requiresFileUpload: boolean;
  countries: string[];
}

const kycDocumentTypes = ref<KycDoc[]>([])
const countryInputs = ref<string[]>([])
const loadingKyc = ref(true)
const savingKyc = ref(false)

async function fetchKycDocuments() {
  loadingKyc.value = true
  try {
    const res = await settings_api.getKycDocuments()
    kycDocumentTypes.value = Array.isArray(res.data?.data) ? res.data.data : (res.data?.kycDocumentTypes || [])
    countryInputs.value = kycDocumentTypes.value.map(() => '')
    showCountryDropdown.value = kycDocumentTypes.value.map(() => false)
  } catch (e) {
    console.error('Failed to load KYC config', e)
  } finally {
    loadingKyc.value = false
  }
}

function addDocumentType() {
  kycDocumentTypes.value.push({
    value: '',
    label: '',
    target: 'both',
    isRequired: true,
    requiresIdNumber: true,
    requiresFileUpload: true,
    countries: []
  })
  countryInputs.value.push('')
}

const countries = [
  { name: 'Nigeria', code: 'NG' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Kenya', code: 'KE' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'United States', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'China', code: 'CN' },
  { name: 'United Arab Emirates', code: 'AE' }
]

const banks = [
  { name: 'Access Bank', code: '044' },
  { name: 'Citibank', code: '023' },
  { name: 'Ecobank Nigeria', code: '050' },
  { name: 'Fidelity Bank Nigeria', code: '070' },
  { name: 'First Bank of Nigeria', code: '011' },
  { name: 'First City Monument Bank', code: '214' },
  { name: 'Guaranty Trust Bank', code: '058' },
  { name: 'Heritage Bank PLC', code: '030' },
  { name: 'Keystone Bank Limited', code: '082' },
  { name: 'Moniepoint MFB', code: '50515' },
  { name: 'OPay Digital Services', code: '999992' },
  { name: 'PalmPay', code: '999991' },
  { name: 'Polaris Bank', code: '076' },
  { name: 'Providus Bank Limited', code: '101' },
  { name: 'Stanbic IBTC Bank Nigeria Limited', code: '221' },
  { name: 'Standard Chartered Bank', code: '068' },
  { name: 'Sterling Bank', code: '232' },
  { name: 'Suntrust Bank Nigeria Limited', code: '100' },
  { name: 'Union Bank of Nigeria', code: '032' },
  { name: 'United Bank for Africa', code: '033' },
  { name: 'Unity Bank plc', code: '215' },
  { name: 'Wema Bank', code: '035' },
  { name: 'Zenith Bank', code: '057' }
]

const showCountryDropdown = ref<boolean[]>([])
const resolvingBank = ref<string | null>(null)

function filteredCountries(search: string) {
  if (!search) return countries
  return countries.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
}

async function resolveBank(details: any, type: string) {
  if (details.accountNumber?.length === 10 && details.bankName) {
    resolvingBank.value = type
    try {
      // Mock resolution for now, or use a real API if available
      setTimeout(() => {
        details.accountName = 'VERIFIED NAME (' + details.accountNumber + ')'
        resolvingBank.value = null
      }, 1500)
    } catch (e) {
      resolvingBank.value = null
    }
  }
}

function addCountry(index: number, countryName: string) {
  if (countryName && !kycDocumentTypes.value[index].countries.includes(countryName)) {
    kycDocumentTypes.value[index].countries.push(countryName);
  }
  countryInputs.value[index] = '';
}

// Email Templates
const emailTemplates = ref<any[]>([])
const emailTriggers = [
  { id: 'welcome_email', label: 'Welcome Email', description: 'Sent to new users upon registration' },
  { id: 'order_confirmation', label: 'Order Confirmation', description: 'Sent after successful payment' },
  { id: 'order_shipped', label: 'Order Shipped', description: 'Sent when order status changes to shipped' },
  { id: 'order_delivered', label: 'Order Delivered', description: 'Sent when order is marked as delivered' },
  { id: 'kyc_approved', label: 'KYC Approved', description: 'Sent when merchant/partner KYC is verified' },
  { id: 'kyc_rejected', label: 'KYC Rejected', description: 'Sent when KYC documents are declined' },
  { id: 'withdrawal_processed', label: 'Withdrawal Success', description: 'Sent after payout is completed' }
]

async function fetchEmailTemplates() {
  try {
    const res = await email_templates_api.findAll()
    emailTemplates.value = res.data?.data || res.data || []
  } catch (e) {
    console.error('Failed to load email templates', e)
  }
}

async function saveKycDocuments() {
  const valid = kycDocumentTypes.value.filter(d => d.label)
  if (valid.length === 0) {
    return showToast({ title: 'Error', message: 'At least one document type is required.', toastType: 'error' })
  }
  
  savingKyc.value = true
  try {
    // The backend will handle slugification of 'value' if it's empty
    await settings_api.updateKycDocuments(valid)
    showToast({ title: 'Success', message: 'KYC configuration updated and published.', toastType: 'success' })
    fetchKycDocuments() // Refresh to see generated values
  } catch (e: any) {
    showToast({ title: 'Error', message: e.message || 'Failed to update.', toastType: 'error' })
  } finally {
    savingKyc.value = false
  }
}

// Currency Rates
const exchangeRates = ref<Record<string, number>>({})
const loadingRates = ref(false)

async function fetchRates() {
  loadingRates.value = true
  try {
    const res = await currencies_api.getRates()
    exchangeRates.value = res.data || res.data?.data || {}
  } catch (e) {
    console.error('Failed to load exchange rates', e)
  } finally {
    loadingRates.value = false
  }
}

function getCurrencySymbol(code: string | any) {
  const symbols: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    EUR: '€',
    GBP: '£'
  }
  return symbols[code] || '¤'
}

function formatSignificant(num: number) {
  if (!num) return '0.00'
  return num < 0.01 ? num.toFixed(6) : num.toFixed(4)
}

onMounted(() => {
  fetchKycDocuments()
  fetchShippingConfig()
  fetchGlobalSettings()
  fetchRates()
  fetchEmailTemplates()
  loadGoogleMaps()
})

function loadGoogleMaps() {
  if ((window as any).google) {
    initAutocomplete()
    return
  }

  const script = document.createElement('script')
  const apiKey = 'AIzaSyCa0Rx0TJ9BGkQ9NC23BZc51zCql_Xrhs0'
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
  script.async = true
  script.defer = true
  script.onload = () => {
    initAutocomplete()
  }
  document.head.appendChild(script)
}

function initAutocomplete() {
  const input = document.getElementById('pickupAddressInput') as HTMLInputElement
  const google = (window as any).google
  if (!input || !google) return

  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['address'],
    componentRestrictions: { country: ['NG'] }
  })

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    if (place.formatted_address) {
      shippingConfig.value.warehouseAddress = place.formatted_address
      if (place.geometry?.location) {
        shippingConfig.value.warehouseLat = place.geometry.location.lat()
        shippingConfig.value.warehouseLng = place.geometry.location.lng()
      }
    }
  })
}
</script>
