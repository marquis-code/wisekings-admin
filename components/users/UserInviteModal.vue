<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-300">
      <div class="p-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Invite Team Member</h2>
            <p class="text-gray-500 text-sm mt-1 font-medium">Send an email invitation to a new staff member</p>
          </div>
          <button @click="$emit('close')" class="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700 ml-1">Full Name</label>
            <div class="relative group">
              <Icon name="lucide:user" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#033958] transition-colors w-5 h-5" />
              <input 
                v-model="form.fullName" 
                type="text" 
                placeholder="Enter full name" 
                required
                class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#033958]/10 transition-all font-medium" 
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700 ml-1">Email Address</label>
            <div class="relative group">
              <Icon name="lucide:mail" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#033958] transition-colors w-5 h-5" />
              <input 
                v-model="form.email" 
                type="email" 
                placeholder="email@example.com" 
                required
                class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#033958]/10 transition-all font-medium" 
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700 ml-1">Assigned Role</label>
            <div class="relative group">
              <Icon name="lucide:shield-check" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#033958] transition-colors w-5 h-5" />
              <select 
                v-model="form.role" 
                required
                class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#033958]/10 transition-all font-medium appearance-none outline-none"
              >
                <option value="" disabled>Select a role</option>
                <option value="admin">Admin</option>
                <option value="finance">Finance Role</option>
                <option value="support">Customer Support</option>
                <option value="viewer">Viewer (Read-only)</option>
              </select>
            </div>
          </div>

          <div class="pt-4">
            <button 
              type="submit" 
              :disabled="loading"
              class="w-full bg-[#033958] hover:bg-[#022f42] text-white font-bold py-4 rounded-2xl shadow-xl shadow-[#033958]/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <span v-if="loading">Sending Invitation...</span>
              <template v-else>
                Send Invitation
                <Icon name="lucide:send" class="w-5 h-5 group-hover:translate-x-1 duration-300" />
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useInviteUser } from '@/composables/modules/users/useInviteUser'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close', 'success'])

const form = reactive({
  fullName: '',
  email: '',
  role: ''
})

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
