<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Configure global platform parameters and rules</p>
      </div>
      <div class="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all',
            activeTab === tab.id ? 'bg-white text-[#033958] shadow-sm' : 'text-gray-400 hover:text-gray-600'
          ]"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- General Settings Tab -->
    <div v-if="activeTab === 'general'" class="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Commission Rates -->
      <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Icon name="lucide:percent" class="w-5 h-5" />
          </div>
          <h2 class="text-lg font-black text-gray-900 tracking-tight">Commission Rates</h2>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
            <div>
              <p class="text-sm font-bold text-gray-900">Standard</p>
              <p class="text-[10px] text-gray-400 font-medium uppercase mt-0.5 tracking-tight">Default merchant category</p>
            </div>
            <span class="text-lg font-black text-[#033958]">3%</span>
          </div>
          
          <div class="flex items-center justify-between p-4 rounded-2xl bg-amber-50/30 border border-transparent hover:border-amber-100 transition-all">
            <div>
              <p class="text-sm font-bold text-gray-900">Gold</p>
              <p class="text-[10px] text-amber-600/60 font-medium uppercase mt-0.5 tracking-tight">₦1M+ total sales</p>
            </div>
            <span class="text-lg font-black text-amber-600">5%</span>
          </div>
          
          <div class="flex items-center justify-between p-4 rounded-2xl bg-purple-50/30 border border-transparent hover:border-purple-100 transition-all">
            <div>
              <p class="text-sm font-bold text-gray-900">Premium</p>
              <p class="text-[10px] text-purple-600/60 font-medium uppercase mt-0.5 tracking-tight">₦5M+ total sales</p>
            </div>
            <span class="text-lg font-black text-purple-600">7.5%</span>
          </div>
        </div>
        
        <button class="mt-8 w-full py-4 bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all">
          Request Changes
        </button>
      </div>

      <!-- Rank Thresholds -->
      <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Icon name="lucide:trending-up" class="w-5 h-5" />
          </div>
          <h2 class="text-lg font-black text-gray-900 tracking-tight">Rank Thresholds</h2>
        </div>
        
        <div class="space-y-2 flex-1">
          <div v-for="(rank, i) in ranks" :key="i" class="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
            <span class="text-sm font-bold text-gray-700 capitalize">{{ rank.name }}</span>
            <span class="text-[11px] font-mono font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{{ rank.range }}</span>
          </div>
        </div>

        <div class="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <div class="flex items-center gap-3">
            <Icon name="lucide:info" class="w-4 h-4 text-blue-600" />
            <p class="text-[10px] text-blue-700 font-bold leading-tight uppercase tracking-tight">Monthly sales volume required for auto-promotion.</p>
          </div>
        </div>
      </div>

      <!-- Platform Settings -->
      <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 md:col-span-2">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Icon name="lucide:shield-check" class="w-5 h-5" />
          </div>
          <h2 class="text-lg font-black text-gray-900 tracking-tight">Platform Controls</h2>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Minimum Withdrawal</p>
            <p class="text-2xl font-black text-gray-900">₦10,000</p>
          </div>
          <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Referral Cookie Life</p>
            <p class="text-2xl font-black text-gray-900">30 <span class="text-sm text-gray-400 uppercase">Days</span></p>
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
                <div>
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Target Account Type</label>
                  <select 
                    v-model="doc.target"
                    class="w-full px-4 py-3 text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-[1.25rem] focus:ring-1 focus:ring-[#033958] focus:border-[#033958] outline-none transition-all shadow-sm appearance-none"
                  >
                    <option value="merchant">Merchants Only</option>
                    <option value="partner">Partners Only</option>
                    <option value="both">Both Merchants & Partners</option>
                  </select>
                </div>
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
                  <input 
                    v-model="countryInputs[i]"
                    @keydown.enter="addCountry(i)"
                    placeholder="Enter country then press enter" 
                    class="w-full px-4 py-3 text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-[1.25rem] focus:ring-1 focus:ring-[#033958] focus:border-[#033958] outline-none transition-all shadow-sm"
                  />
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
                class="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow-lg hover:bg-red-600 hover:text-white transition-all scale-0 group-hover:scale-100"
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
    <div v-if="activeTab === 'shipping'" class="max-w-5xl space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Delivery Rates -->
        <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                <Icon name="lucide:truck" class="w-6 h-6" />
              </div>
              <h2 class="text-xl font-black text-gray-900 tracking-tight">Delivery Logistics</h2>
            </div>
            <button 
              @click="saveShippingConfig" 
              :disabled="savingShipping"
              class="px-6 py-2 bg-[#033958] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:opacity-90 disabled:opacity-50"
            >
              {{ savingShipping ? 'Saving...' : 'Save Logistics' }}
            </button>
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Base Dispatch Fee (₦)</label>
                <input v-model.number="shippingConfig.baseFee" type="number" class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#033958] transition-all" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price Per Km (₦)</label>
                <input v-model.number="shippingConfig.pricePerKm" type="number" class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#033958] transition-all" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Waybill Fee (Outside Lagos) (₦)</label>
              <input v-model.number="shippingConfig.waybillFee" type="number" class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#033958] transition-all" />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pickup Store Address</label>
              <textarea v-model="shippingConfig.pickupAddress" rows="2" class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#033958] transition-all resize-none"></textarea>
            </div>

            <!-- Pricing Tiers -->
            <div class="pt-6 border-t border-gray-100 space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-black uppercase tracking-widest text-[#033958]">Distance Pricing Tiers</h3>
                <button @click="addPricingTier" class="text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-amber-700 flex items-center gap-1">
                  <Icon name="lucide:plus" size="14" />
                  Add Tier
                </button>
              </div>
              
              <div v-if="shippingConfig.pricingTiers?.length" class="space-y-3">
                <div v-for="(tier, idx) in shippingConfig.pricingTiers" :key="idx" class="p-4 bg-gray-50 rounded-2xl border border-gray-100 grid grid-cols-12 gap-3 items-center group relative">
                  <div class="col-span-4 space-y-1">
                    <label class="text-[8px] font-black uppercase text-gray-400 tracking-tighter">From (Meters)</label>
                    <input v-model.number="tier.from" type="number" class="w-full px-3 py-2 text-xs font-bold bg-white border border-gray-200 rounded-xl outline-none" />
                  </div>
                  <div class="col-span-4 space-y-1">
                    <label class="text-[8px] font-black uppercase text-gray-400 tracking-tighter">To (Meters)</label>
                    <input v-model.number="tier.to" type="number" class="w-full px-3 py-2 text-xs font-bold bg-white border border-gray-200 rounded-xl outline-none" />
                  </div>
                  <div class="col-span-4 space-y-1">
                    <label class="text-[8px] font-black uppercase text-gray-400 tracking-tighter">Price (₦)</label>
                    <input v-model.number="tier.price" type="number" class="w-full px-3 py-2 text-xs font-bold bg-white border border-gray-200 rounded-xl outline-none" />
                  </div>
                  <button @click="shippingConfig.pricingTiers.splice(idx, 1)" class="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-sm transition-all">
                    <Icon name="lucide:x" size="12" />
                  </button>
                </div>
              </div>
              <p v-else class="text-[10px] text-gray-400 italic text-center py-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">No custom tiers defined. Using base/km rates.</p>
            </div>
          </div>
        </div>

        <!-- Business Comms -->
        <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
           <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Icon name="lucide:message-circle" class="w-6 h-6" />
              </div>
              <h2 class="text-xl font-black text-gray-900 tracking-tight">Business Comms</h2>
            </div>
            <button 
              @click="saveGlobalSettings" 
              :disabled="savingGlobalSettings"
              class="px-6 py-2 bg-[#033958] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:opacity-90 disabled:opacity-50"
            >
              {{ savingGlobalSettings ? 'Saving...' : 'Save Comms' }}
            </button>
          </div>

          <div class="space-y-6">
             <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Order Notifications WhatsApp</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                  <Icon name="lucide:phone" size="18" />
                </div>
                <input v-model="globalSettings.whatsappNumber" placeholder="234..." class="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-emerald-500 transition-all" />
              </div>
              <p class="text-[9px] text-gray-400 font-medium italic mt-1 ml-1">Format: CountryCode + Number (e.g., 234814...)</p>
            </div>
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
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Name</label>
              <input v-model="globalSettings.customerBankDetails.accountName" class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#033958] transition-all" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Number</label>
              <input v-model="globalSettings.customerBankDetails.accountNumber" class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#033958] transition-all" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank Name</label>
              <input v-model="globalSettings.customerBankDetails.bankName" class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#033958] transition-all" />
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
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Name</label>
              <input v-model="globalSettings.merchantBankDetails.accountName" class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#033958] transition-all" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Number</label>
              <input v-model="globalSettings.merchantBankDetails.accountNumber" class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#033958] transition-all" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank Name</label>
              <input v-model="globalSettings.merchantBankDetails.bankName" class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#033958] transition-all" />
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
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Name</label>
              <input v-model="globalSettings.partnerBankDetails.accountName" class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#033958] transition-all" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Number</label>
              <input v-model="globalSettings.partnerBankDetails.accountNumber" class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#033958] transition-all" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank Name</label>
              <input v-model="globalSettings.partnerBankDetails.bankName" class="w-full px-4 py-3 text-sm font-bold bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#033958] transition-all" />
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
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({ layout: 'dashboard' })
const { showToast } = useCustomToast()

const tabs = [
  { id: 'general', name: 'General Platform' },
  { id: 'currencies', name: 'Currency Rates' },
  { id: 'kyc', name: 'KYC Configuration' },
  { id: 'shipping', name: 'Shipping & Comms' },
  { id: 'bank', name: 'Bank Accounts' }
]
const activeTab = ref('general')

// Shipping Config
const shippingConfig = ref({
  baseFee: 0,
  pricePerKm: 0,
  waybillFee: 0,
  warehouseAddress: '',
  warehouseLat: 0,
  warehouseLng: 0,
  pickupAddress: '',
  pricingTiers: [] as { from: number; to: number; price: number }[]
})
const savingShipping = ref(false)
const loadingShipping = ref(false)

// System Settings
const globalSettings = ref({
    whatsappNumber: '',
    customerBankDetails: { accountName: '', accountNumber: '', bankName: '' },
    merchantBankDetails: { accountName: '', accountNumber: '', bankName: '' },
    partnerBankDetails: { accountName: '', accountNumber: '', bankName: '' }
})
const savingGlobalSettings = ref(false)

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

async function fetchGlobalSettings() {
    try {
        const res = await settings_api.getSettings()
        const data = res.data || res.data?.data || {}
        globalSettings.value = {
            whatsappNumber: data.whatsappNumber || '',
            customerBankDetails: data.customerBankDetails || { accountName: '', accountNumber: '', bankName: '' },
            merchantBankDetails: data.merchantBankDetails || { accountName: '', accountNumber: '', bankName: '' },
            partnerBankDetails: data.partnerBankDetails || { accountName: '', accountNumber: '', bankName: '' }
        }
    } catch (e) {
        console.error('Failed to load global settings', e)
    }
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
    kycDocumentTypes.value = res.data?.data?.kycDocumentTypes || res.data?.kycDocumentTypes || []
    countryInputs.value = kycDocumentTypes.value.map(() => '')
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

function addCountry(index: number) {
  const val = countryInputs.value[index].trim();
  if (val && !kycDocumentTypes.value[index].countries.includes(val)) {
    kycDocumentTypes.value[index].countries.push(val);
  }
  countryInputs.value[index] = '';
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
})
</script>
