<template>
  <div v-if="show" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#033958]/20 backdrop-blur-md">
    <div class="bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-[0_20px_50px_rgba(3,57,88,0.15)] border border-white/50 animate-in fade-in zoom-in duration-500">
      <div class="relative p-10">
        <!-- Decoration -->
        <div class="absolute -top-12 -right-12 w-32 h-32 bg-amber-100/50 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-12 -left-12 w-32 h-32 bg-[#033958]/5 rounded-full blur-3xl"></div>

        <div class="relative">
          <div class="flex items-center justify-between mb-10">
            <div>
              <div class="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 border border-amber-100">
                <Icon name="lucide:user-plus" class="w-6 h-6 text-amber-600" />
              </div>
              <h2 class="text-3xl font-black text-gray-900 tracking-tight">Invite Member</h2>
              <p class="text-gray-500 text-sm mt-1 font-medium italic">Grow your administrative team</p>
            </div>
            <button @click="$emit('close')" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-8">
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div class="relative group">
                  <Icon name="lucide:user" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-amber-500 transition-colors w-5 h-5 font-bold" />
                  <input 
                    v-model="form.fullName" 
                    type="text" 
                    placeholder="e.g. John Doe" 
                    required
                    class="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] text-sm focus:border-amber-200 focus:bg-white focus:ring-0 transition-all font-bold text-gray-900 placeholder:text-gray-300" 
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div class="relative group">
                  <Icon name="lucide:mail" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-amber-500 transition-colors w-5 h-5" />
                  <input 
                    v-model="form.email" 
                    type="email" 
                    placeholder="staff@wisekings.ng" 
                    required
                    class="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] text-sm focus:border-amber-200 focus:bg-white focus:ring-0 transition-all font-bold text-gray-900 placeholder:text-gray-300" 
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Role</label>
                <SelectInput 
                  v-model="form.role"
                  label="Role"
                  :options="roleOptions"
                  placeholder="Select access level"
                />
              </div>
            </div>

            <div class="pt-4 text-center">
              <button 
                type="submit" 
                :disabled="loading"
                class="w-full bg-[#033958] hover:bg-[#022f42] text-white font-black py-4 rounded-[1.5rem] shadow-2xl shadow-[#033958]/20 active:scale-[0.97] transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                <span v-if="loading" class="flex items-center gap-2">
                  <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
                  Sending...
                </span>
                <template v-else>
                  Send Invitation
                  <Icon name="lucide:sparkles" class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 text-amber-300" />
                </template>
              </button>
              <p class="text-[10px] text-gray-400 font-bold mt-4 flex items-center justify-center gap-1 uppercase tracking-tighter">
                <Icon name="lucide:lock" class="w-3 h-3" />
                Secure Administrative Invitation
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useInviteUser } from '@/composables/modules/users/useInviteUser'
import SelectInput from '@/components/core/SelectInput.vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close', 'success'])

const form = reactive({
  fullName: '',
  email: '',
  role: ''
})

const roleOptions = [
  { label: 'Administrator', value: 'admin' },
  { label: 'Finance Manager', value: 'finance' },
  { label: 'Customer Support', value: 'support' },
  { label: 'Viewer (Read-only)', value: 'viewer' }
]

const { loading, inviteUser } = useInviteUser()

async function handleSubmit() {
  const success = await inviteUser(form)
  if (success) {
    emit('success')
    emit('close')
    // Reset form
    form.fullName = ''
    form.email = ''
    form.role = ''
  }
}
</script>
