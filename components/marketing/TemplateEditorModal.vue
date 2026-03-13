<template>
  <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="relative bg-white rounded-[3rem] w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl animate-modal-in border border-white overflow-hidden">
      <!-- Header -->
      <div class="p-8 border-b border-gray-100 flex items-center justify-between bg-white relative z-20">
        <div>
          <h2 class="text-3xl font-black text-gray-900 tracking-tight">{{ isEdit ? 'Edit' : 'Create' }} Email Template</h2>
          <p class="text-gray-500 font-medium text-sm mt-1 italic">Craft beautiful messages for your users</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex bg-gray-100 p-1 rounded-2xl">
            <button 
              @click="viewMode = 'edit'" 
              :class="['px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all', viewMode === 'edit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
            >Editor</button>
            <button 
              @click="viewMode = 'preview'" 
              :class="['px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all', viewMode === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
            >Preview</button>
          </div>
          <button @click="$emit('close')" class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all border border-gray-100">
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-hidden flex flex-col md:flex-row bg-gray-50/50">
        <!-- Editor View -->
        <div v-show="viewMode === 'edit'" class="flex-1 overflow-y-auto p-10 style-scrollbar">
          <div class="max-w-3xl mx-auto space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2">
                <label class="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Template Name</label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  placeholder="e.g. USER_WELCOME" 
                  class="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-900 focus:ring-4 focus:ring-[#033958]/10 focus:border-[#033958] outline-none transition-all shadow-sm" 
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Email Subject</label>
                <input 
                  v-model="form.subject" 
                  type="text" 
                  placeholder="Hello {{ name }}, Welcome!" 
                  class="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-900 focus:ring-4 focus:ring-[#033958]/10 focus:border-[#033958] outline-none transition-all shadow-sm" 
                />
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between px-1">
                <label class="text-sm font-black text-gray-700 uppercase tracking-widest">Email Design Content</label>
                <p v-pre class="text-[10px] font-bold text-gray-400">Use {{ variable }} for dynamic data</p>
              </div>
              <CoreRichTextEditor v-model="form.content" />
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between px-1">
                <label class="text-sm font-black text-gray-700 uppercase tracking-widest">Variables</label>
                <p class="text-[10px] font-bold text-gray-400">Comma separated list</p>
              </div>
              <input 
                v-model="variablesInput" 
                type="text" 
                placeholder="name, otpCode, link" 
                class="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-900 focus:ring-4 focus:ring-[#033958]/10 focus:border-[#033958] outline-none transition-all shadow-sm" 
              />
            </div>
            
            <div class="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm w-fit">
              <input v-model="form.isActive" type="checkbox" id="tplActive" class="custom-checkbox" />
              <label for="tplActive" class="text-sm font-black text-gray-700 uppercase tracking-widest cursor-pointer">Template Active</label>
            </div>
          </div>
        </div>

        <!-- Preview View -->
        <div v-show="viewMode === 'preview'" class="flex-1 bg-gray-200/30 p-10 overflow-y-auto style-scrollbar">
          <div class="max-w-2xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden min-h-[600px] border border-gray-100">
            <div class="bg-gray-50 border-b border-gray-100 p-6">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Subject Preview</p>
                <h3 class="font-black text-gray-900">{{ renderedSubject || '(No subject)' }}</h3>
            </div>
            <div class="p-8" v-html="form.content || '<p class=\'text-gray-300 italic text-center py-20\'>Template content preview will appear here</p>'"></div>
          </div>
          
          <div class="max-w-2xl mx-auto mt-8 p-6 bg-[#033958] rounded-3xl text-white shadow-xl shadow-[#033958]/20">
            <div class="flex items-center gap-3 mb-4">
                <Icon name="lucide:info" class="w-5 h-5 text-emerald-400" />
                <h4 class="font-black uppercase tracking-widest text-xs">Preview Helper</h4>
            </div>
            <p class="text-sm font-medium text-gray-200 italic leading-relaxed">
              This is a live preview of how your email will look. Ensure all styles are inline for maximum compatibility across email clients (Gmail, Outlook, etc.).
            </p>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-8 border-t border-gray-100 bg-white flex items-center justify-between">
        <button @click="$emit('close')" class="px-8 py-4 text-sm font-black text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest">Cancel</button>
        <button 
          @click="handleSave" 
          :disabled="saving"
          class="bg-[#033958] hover:bg-[#022f42] text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-[#033958]/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-widest text-sm"
        >
          <span v-if="saving">Synchronizing...</span>
          <template v-else>
            {{ isEdit ? 'Update' : 'Deploy' }} Template
            <Icon name="lucide:zap" class="w-4 h-4 text-emerald-400" />
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { email_templates_api } from '@/api_factory/modules/email-templates'
import { useCustomToast } from '@/composables/core/useCustomToast'

const props = defineProps<{
  show: boolean
  templateData?: any
}>()

const emit = defineEmits(['close', 'success'])
const { showToast } = useCustomToast()

const isEdit = computed(() => !!props.templateData?._id)
const saving = ref(false)
const viewMode = ref<'edit' | 'preview'>('edit')

const form = reactive({
  name: '',
  subject: '',
  content: '',
  variables: [] as string[],
  isActive: true
})

const variablesInput = ref('')

watch(() => props.templateData, (val) => {
  if (val) {
    form.name = val.name || ''
    form.subject = val.subject || ''
    form.content = val.content || ''
    form.variables = val.variables || []
    form.isActive = val.isActive ?? true
    variablesInput.value = (val.variables || []).join(', ')
  } else {
    form.name = ''
    form.subject = ''
    form.content = ''
    form.variables = []
    form.isActive = true
    variablesInput.value = ''
  }
}, { immediate: true })

const renderedSubject = computed(() => form.subject)

async function handleSave() {
  if (!form.name || !form.subject || !form.content) {
    showToast({ title: 'Wait', message: 'All fields are required.', toastType: 'error' })
    return
  }

  form.variables = variablesInput.value.split(',').map(v => v.trim()).filter(Boolean)
  
  saving.value = true
  try {
    if (isEdit.value) {
      await email_templates_api.update(props.templateData._id, form)
      showToast({ title: 'Updated', message: 'Email template synchronized.', toastType: 'success' })
    } else {
      await email_templates_api.create(form)
      showToast({ title: 'Success', message: 'New template deployed.', toastType: 'success' })
    }
    emit('success')
    emit('close')
  } catch (err: any) {
    showToast({ title: 'Error', message: err.message || 'Failed to save template', toastType: 'error' })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.animate-modal-in {
  animation: modalSlide 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes modalSlide {
  from { opacity: 0; transform: scale(0.9) translateY(40px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
