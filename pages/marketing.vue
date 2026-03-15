<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Marketing</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Manage banners, promotions, and holiday specials</p>
      </div>
      <div class="flex gap-3">
        <button @click="openBannerModal()" class="group flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-3 rounded-2xl font-bold text-sm hover:border-gray-300 hover:shadow-md transition-all">
          <Icon name="lucide:image" class="w-4 h-4" /> Add Banner
        </button>
        <button @click="openPromoModal()" class="group btn-primary !rounded-2xl !px-6 !py-3 shadow-lg shadow-[#033958]/10 flex items-center gap-2">
          <Icon name="lucide:plus" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 
          Add Promotion
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-8 w-fit">
      <button 
        @click="activeTab = 'banners'" 
        :class="['px-6 py-2.5 rounded-xl text-sm font-bold transition-all', activeTab === 'banners' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
      >Banners</button>
      <button 
        @click="activeTab = 'promotions'" 
        :class="['px-6 py-2.5 rounded-xl text-sm font-bold transition-all', activeTab === 'promotions' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
      >Promotions</button>
      <button 
        @click="activeTab = 'templates'" 
        :class="['px-6 py-2.5 rounded-xl text-sm font-bold transition-all', activeTab === 'templates' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
      >Email Templates</button>
      <button 
        @click="activeTab = 'campaigns'" 
        :class="['px-6 py-2.5 rounded-xl text-sm font-bold transition-all', activeTab === 'campaigns' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
      >Campaigns</button>
    </div>

    <!-- Banners Table -->
    <div v-if="activeTab === 'banners'" class="table-container bg-white shadow-sm border-gray-100 overflow-hidden !rounded-3xl">
      <table class="data-table">
        <thead>
          <tr class="!bg-gray-50/50">
            <th class="!py-5 !pl-6">Image</th>
            <th class="!py-5">Title</th>
            <th class="!py-5">Position</th>
            <th class="!py-5">Status</th>
            <th class="!py-5 !pr-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loadingBanners"><td colspan="5" class="!py-10 text-center text-gray-400">Loading banners...</td></tr>
          <tr v-else-if="banners.length === 0"><td colspan="5" class="!py-10 text-center text-gray-400">No banners yet. Create one to get started.</td></tr>
          <tr v-for="b in banners" :key="b._id" class="group">
            <td class="!py-4 !pl-6">
              <div class="w-20 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                <img v-if="b.image" :src="b.image" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center"><Icon name="lucide:image" class="w-5 h-5 text-gray-300" /></div>
              </div>
            </td>
            <td class="!py-4 font-bold text-gray-900">{{ b.title }}</td>
            <td class="!py-4"><span class="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">{{ b.position }}</span></td>
            <td class="!py-4">
              <span :class="b.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'" class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border">
                {{ b.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="!py-4 !pr-6 text-right">
              <div class="flex items-center justify-end gap-3 transition-opacity">
                <button @click="openBannerModal(b)" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-900 text-white shadow-xl shadow-black/10 hover:scale-110 active:scale-95 transition-all"><Icon name="lucide:edit" class="w-5 h-5" /></button>
                <button @click="handleDeleteBanner(b)" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-red-500 hover:bg-red-50 shadow-sm hover:scale-110 active:scale-95 transition-all"><Icon name="lucide:trash-2" class="w-5 h-5" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Promotions Table -->
    <div v-if="activeTab === 'promotions'" class="table-container bg-white shadow-sm border-gray-100 overflow-hidden !rounded-3xl">
      <table class="data-table">
        <thead>
          <tr class="!bg-gray-50/50">
            <th class="!py-5 !pl-6">Image</th>
            <th class="!py-5">Title</th>
            <th class="!py-5">Type & Discount</th>
            <th class="!py-5">Status</th>
            <th class="!py-5 !pr-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loadingPromos"><td colspan="5" class="!py-10 text-center text-gray-400">Loading promotions...</td></tr>
          <tr v-else-if="promos.length === 0"><td colspan="5" class="!py-16 text-center">
            <div class="flex flex-col items-center justify-center">
               <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                 <Icon name="lucide:tag" class="w-8 h-8 text-gray-300" />
               </div>
               <h3 class="text-lg font-bold text-gray-900 mb-1">No Promotions Yet</h3>
               <p class="text-sm text-gray-500 mb-6">Create your first promotion or holiday special to engage customers.</p>
               <button @click="openPromoModal()" class="btn-primary !rounded-xl !px-6 !py-2.5 text-sm flex items-center gap-2">
                 <Icon name="lucide:plus" class="w-4 h-4" /> Add Promotion
               </button>
            </div>
          </td></tr>
          <tr v-for="p in promos" :key="p._id" class="group">
            <td class="!py-4 !pl-6">
              <div class="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                <img v-if="p.image" :src="p.image" class="w-full h-full object-cover" />
                <Icon v-else name="lucide:image" class="w-5 h-5 text-gray-300" />
              </div>
            </td>
            <td class="!py-4 font-bold text-gray-900">{{ p.title }}</td>
            <td class="!py-4">
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">{{ p.type }}</span>
                <span v-if="p.discountPercentage" class="text-xs font-bold text-gray-500">{{ p.discountPercentage }}% OFF</span>
              </div>
            </td>
            <td class="!py-4">
              <span :class="p.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'" class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border">
                {{ p.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="!py-4 !pr-6 text-right">
              <div class="flex items-center justify-end gap-3 transition-opacity">
                <button @click="openPromoModal(p)" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-900 text-white shadow-xl shadow-black/10 hover:scale-110 active:scale-95 transition-all"><Icon name="lucide:edit" class="w-5 h-5" /></button>
                <button @click="handleDeletePromo(p)" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-red-500 hover:bg-red-50 shadow-sm hover:scale-110 active:scale-95 transition-all"><Icon name="lucide:trash-2" class="w-5 h-5" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Email Templates Table -->
    <div v-if="activeTab === 'templates'" class="table-container bg-white shadow-sm border-gray-100 overflow-hidden !rounded-3xl">
      <table class="data-table">
        <thead>
          <tr class="!bg-gray-50/50">
            <th class="!py-5 !pl-6">Name</th>
            <th class="!py-5">Subject</th>
            <th class="!py-5">Variables</th>
            <th class="!py-5">Status</th>
            <th class="!py-5 !pr-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loadingTemplates"><td colspan="5" class="!py-10 text-center text-gray-400">Loading templates...</td></tr>
          <tr v-else-if="templates.length === 0"><td colspan="5" class="!py-10 text-center text-gray-400">No email templates yet.</td></tr>
          <tr v-for="t in templates" :key="t._id" class="group">
            <td class="!py-4 !pl-6">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                        <Icon name="lucide:mail" class="w-4 h-4 text-gray-400" />
                    </div>
                    <span class="font-bold text-gray-900">{{ t.name }}</span>
                </div>
            </td>
            <td class="!py-4 font-medium text-gray-500 max-w-xs truncate">{{ t.subject }}</td>
            <td class="!py-4">
                <div class="flex flex-wrap gap-1">
                    <span v-for="v in t.variables" :key="v" class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                        {{ v }}
                    </span>
                    <span v-if="!t.variables?.length" class="text-gray-300 text-xs italic">none</span>
                </div>
            </td>
            <td class="!py-4">
              <span :class="t.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'" class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border">
                {{ t.isActive ? 'Active' : 'Deactivated' }}
              </span>
            </td>
            <td class="!py-4 !pr-6 text-right">
              <div class="flex items-center justify-end gap-3 transition-opacity">
                <button @click="openTemplateModal(t)" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-900 text-white shadow-xl shadow-black/10 hover:scale-110 active:scale-95 transition-all"><Icon name="lucide:edit-3" class="w-5 h-5" /></button>
                <button @click="handleDeleteTemplate(t)" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-red-500 hover:bg-red-50 shadow-sm hover:scale-110 active:scale-95 transition-all"><Icon name="lucide:trash-2" class="w-5 h-5" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-center">
          <button @click="openTemplateModal()" class="flex items-center gap-2 text-[#033958] font-bold text-sm hover:underline">
              <Icon name="lucide:plus-circle" class="w-4 h-4" />
              Create New Template
          </button>
      </div>
    </div>

    <!-- Campaigns Table -->
    <div v-if="activeTab === 'campaigns'" class="table-container bg-white shadow-sm border-gray-100 overflow-hidden !rounded-3xl">
      <div class="flex justify-end p-4 border-b border-gray-100">
         <button @click="openCampaignModal(null, 'create')" class="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-gray-800 transition-all flex items-center gap-2">
            <Icon name="lucide:mail-plus" class="w-4 h-4" /> Create Campaign
         </button>
      </div>
      <table class="data-table">
        <thead>
          <tr class="!bg-gray-50/50">
            <th class="!py-5 !pl-6">Campaign Name</th>
            <th class="!py-5">Target Audience</th>
            <th class="!py-5">Subject</th>
            <th class="!py-5">Date Created</th>
            <th class="!py-5 !pr-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loadingCampaigns"><td colspan="4" class="!py-10 text-center text-gray-400">Loading campaigns...</td></tr>
          <tr v-else-if="campaigns.length === 0"><td colspan="4" class="!py-16 text-center">
             <div class="flex flex-col items-center justify-center">
               <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                 <Icon name="lucide:megaphone" class="w-8 h-8 text-gray-300" />
               </div>
               <h3 class="text-lg font-bold text-gray-900 mb-1">No Campaigns Sent</h3>
               <p class="text-sm text-gray-500 mb-6">Launch a marketing campaign to reach your network.</p>
            </div>
          </td></tr>
          <tr v-for="c in campaigns" :key="c._id" class="group">
             <td class="!py-4 !pl-6 font-bold text-gray-900">{{ c.title }}</td>
             <td class="!py-4"><span class="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">{{ c.targetAudience }}</span></td>
             <td class="!py-4 font-medium text-gray-500">{{ c.subject }}</td>
             <td class="!py-4 text-xs font-bold text-gray-500">{{ new Date(c.createdAt).toLocaleDateString() }}</td>
             <td class="!py-4 !pr-6 text-right">
               <div class="flex items-center justify-end gap-3 transition-opacity">
                 <button @click="$router.push('/campaigns/' + c._id)" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all border border-gray-200" title="View"><Icon name="lucide:eye" class="w-5 h-5" /></button>
                 <button @click="openCampaignModal(c, 'edit')" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-900 text-white shadow-xl shadow-black/10 hover:scale-110 active:scale-95 transition-all" title="Edit / Resend"><Icon name="lucide:edit" class="w-5 h-5" /></button>
                 <button @click="handleDeleteCampaign(c)" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-red-500 hover:bg-red-50 shadow-sm hover:scale-110 active:scale-95 transition-all" title="Delete"><Icon name="lucide:trash-2" class="w-5 h-5" /></button>
               </div>
             </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Banner Modal -->
    <MarketingBannerModal 
      :show="showBannerForm" 
      :banner-data="selectedBanner"
      :saving="savingBanner"
      @close="showBannerForm = false"
      @save="handleSaveBanner"
    />

    <!-- Promotion Modal -->
    <MarketingPromoModal 
      :show="showPromoForm" 
      :promo-data="selectedPromo"
      :saving="savingPromo"
      @close="showPromoForm = false"
      @save="handleSavePromo"
    />

    <!-- Template Editor Modal -->
    <MarketingTemplateEditorModal 
      :show="showTemplateModal" 
      :template-data="selectedTemplate" 
      @close="showTemplateModal = false" 
      @success="fetchTemplates" 
    />

    <!-- Campaign Modal -->
    <MarketingCampaignModal
      v-if="showCampaignModal"
      :show="showCampaignModal"
      :campaign="selectedCampaign"
      :mode="campaignModalMode"
      @close="showCampaignModal = false"
      @success="fetchCampaigns"
    />
  </div>
</template>

<script setup lang="ts">
import { marketing_api } from '@/api_factory/modules/marketing'
import { email_templates_api } from '@/api_factory/modules/email-templates'

definePageMeta({ layout: 'dashboard' })

const activeTab = ref('banners')

// === Banners ===
const banners = ref<any[]>([])
const loadingBanners = ref(true)
const showBannerForm = ref(false)
const selectedBanner = ref<any>(null)
const savingBanner = ref(false)

async function fetchBanners() {
  loadingBanners.value = true
  try { const r = await marketing_api.getBanners(); banners.value = r?.data?.data || r?.data || [] } catch {}
  loadingBanners.value = false
}

function openBannerModal(b?: any) {
  selectedBanner.value = b || null
  showBannerForm.value = true
}

async function handleSaveBanner(formData: any) {
  savingBanner.value = true
  try {
    if (selectedBanner.value?._id) await marketing_api.updateBanner(selectedBanner.value._id, formData)
    else await marketing_api.createBanner(formData)
    showBannerForm.value = false; fetchBanners()
  } catch (e) { console.error(e) }
  savingBanner.value = false
}

async function handleDeleteBanner(b: any) {
  if (!confirm(`Delete banner "${b.title}"?`)) return
  try { await marketing_api.deleteBanner(b._id); fetchBanners() } catch {}
}

// === Promotions ===
const promos = ref<any[]>([])
const loadingPromos = ref(true)
const showPromoForm = ref(false)
const selectedPromo = ref<any>(null)
const savingPromo = ref(false)

async function fetchPromos() {
  loadingPromos.value = true
  try { const r = await marketing_api.getPromotions(); promos.value = r?.data?.data || r?.data || [] } catch {}
  loadingPromos.value = false
}

function openPromoModal(p?: any) {
  selectedPromo.value = p || null
  showPromoForm.value = true
}

async function handleSavePromo(formData: any) {
  savingPromo.value = true
  try {
    if (selectedPromo.value?._id) await marketing_api.updatePromotion(selectedPromo.value._id, formData)
    else await marketing_api.createPromotion(formData)
    showPromoForm.value = false; fetchPromos()
  } catch (e) { console.error(e) }
  savingPromo.value = false
}

async function handleDeletePromo(p: any) {
  if (!confirm(`Delete promotion "${p.title}"?`)) return
  try { await marketing_api.deletePromotion(p._id); fetchPromos() } catch {}
}

// === Email Templates ===
const templates = ref<any[]>([])
const loadingTemplates = ref(true)
const showTemplateModal = ref(false)
const selectedTemplate = ref<any>(null)

async function fetchTemplates() {
  loadingTemplates.value = true
  try { const r = await email_templates_api.findAll(); templates.value = r?.data?.data || r?.data || [] } catch {}
  loadingTemplates.value = false
}

function openTemplateModal(t?: any) {
  selectedTemplate.value = t || null
  showTemplateModal.value = true
}

async function handleDeleteTemplate(t: any) {
  if (!confirm(`Delete email template "${t.name}"?`)) return
  try { await email_templates_api.delete(t._id); fetchTemplates() } catch {}
}

// === Campaigns ===
const campaigns = ref<any[]>([])
const loadingCampaigns = ref(false)
const showCampaignModal = ref(false)
const selectedCampaign = ref<any>(null)
const campaignModalMode = ref<'create' | 'edit'>('create')

function openCampaignModal(c: any = null, mode: 'create' | 'edit' = 'create') {
  selectedCampaign.value = c;
  campaignModalMode.value = mode;
  showCampaignModal.value = true;
}

async function handleDeleteCampaign(c: any) {
  if (!confirm(`Delete campaign "${c.title}"?`)) return
  try { await marketing_api.deleteCampaign(c._id); fetchCampaigns() } catch {}
}

async function fetchCampaigns() {
  loadingCampaigns.value = true
  try { const r = await marketing_api.getCampaigns(); campaigns.value = r?.data?.data || r?.data || [] } catch {}
  loadingCampaigns.value = false
}

onMounted(() => { fetchBanners(); fetchPromos(); fetchTemplates(); fetchCampaigns() })
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.4s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.animate-modal-in { animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
</style>
