<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Users & Staff</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Manage platform users and administrative access</p>
      </div>
      <div class="flex gap-3">
        <div class="px-5 py-2.5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span class="text-xs font-black text-emerald-700 uppercase tracking-widest">{{ total }} Total Users</span>
        </div>
        <button @click="showInviteModal = true" class="btn-primary flex items-center gap-2 !rounded-2xl !py-3 !px-6 shadow-lg shadow-[#033958]/20">
          <Icon name="lucide:user-plus" class="w-5 h-5" />
          <span class="font-bold">Invite Team Member</span>
        </button>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-center">
      <div class="relative flex-1 min-w-[300px]">
        <Icon name="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          v-model="search" 
          type="text" 
          placeholder="Search by name, email or phone..." 
          class="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#033958]/10 transition-all font-medium" 
          @input="debouncedFetch" 
        />
      </div>
      <div class="flex gap-3">
        <SelectInput 
          v-model="roleFilter" 
          label="Filter by Role"
          :options="[
            { label: 'All Roles', value: '' },
            { label: 'Super Admin', value: 'superadmin' },
            { label: 'Admin', value: 'admin' },
            { label: 'Finance', value: 'finance' },
            { label: 'Support', value: 'support' },
            { label: 'Viewer', value: 'viewer' },
            { label: 'User', value: 'user' }
          ]"
          @update:modelValue="handleFetch"
        />
        <button @click="handleFetch" class="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#033958]/5 text-[#033958] hover:bg-[#033958] hover:text-white transition-all">
          <Icon name="lucide:rotate-cw" class="w-5 h-5" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="table-container bg-white shadow-sm border-gray-100 overflow-hidden !rounded-3xl">
      <table class="data-table">
        <thead>
          <tr class="!bg-gray-50/50">
            <th class="!py-5 !pl-6">User Details</th>
            <th class="!py-5">Type</th>
            <th class="!py-5">Assigned Role</th>
            <th class="!py-5">Status</th>
            <th class="!py-5">Last Activity</th>
            <th class="!py-5 !pr-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="!p-0">
              <CoreSkeletonLoader :rows="5" avatar />
            </td>
          </tr>
          <tr v-else-if="users.length === 0">
            <td colspan="6" class="!py-10">
              <CoreEmptyState 
                icon="lucide:user-x" 
                title="No users found" 
                description="When administrative staff or customers register, they will appear here for management."
              />
            </td>
          </tr>
          <tr v-for="u in users" :key="u._id" v-else class="group">
            <td class="!py-4 !pl-6">
              <div class="flex items-center gap-4">
                <div class="w-11 h-11 rounded-full bg-[#033958]/10 border border-[#033958]/10 flex items-center justify-center text-[#033958] font-black text-sm uppercase">
                  {{ u.fullName.charAt(0) }}
                </div>
                <div>
                  <p class="font-bold text-gray-900 text-sm leading-tight">{{ u.fullName }}</p>
                  <p class="text-xs font-medium text-gray-400 mt-0.5">{{ u.email }}</p>
                </div>
              </div>
            </td>
            <td class="!py-4">
              <span class="inline-flex px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest border border-gray-100">
                {{ u.userType }}
              </span>
            </td>
            <td class="!py-4">
              <div class="flex items-center gap-2">
                <Icon v-if="u.role === 'superadmin'" name="lucide:crown" class="w-4 h-4 text-amber-500" />
                <span class="text-sm font-bold text-gray-700 capitalize">{{ u.role }}</span>
              </div>
            </td>
            <td class="!py-4">
              <span v-if="u.isInvited" class="badge-warning">Pending</span>
              <span v-else :class="u.isActive ? 'badge-success' : 'badge-danger'">{{ u.isActive ? 'Active' : 'Inactive' }}</span>
            </td>
            <td class="!py-4">
              <p class="text-xs font-bold text-gray-500">{{ u.lastLogin ? new Date(u.lastLogin).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never' }}</p>
              <p class="text-[10px] text-gray-400 font-medium">{{ u.lastLogin ? new Date(u.lastLogin).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '—' }}</p>
            </td>
            <td class="!py-4 !pr-6 text-right">
              <div class="flex items-center justify-end gap-2">
                <button 
                  v-if="u.isActive" 
                  @click="handleDeactivate(u)" 
                  class="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                  title="Suspend User"
                >
                  <Icon name="lucide:user-x" class="w-4 h-4" />
                </button>
                <button 
                  v-else 
                  @click="handleActivate(u)" 
                  class="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-300"
                  title="Activate User"
                >
                  <Icon name="lucide:user-check" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-8 bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm">
      <p class="text-sm font-bold text-gray-500 ml-4">Showing page {{ page }} of {{ totalPages }}</p>
      <div class="flex gap-2">
        <button 
          @click="page--; handleFetch()" 
          :disabled="page <= 1" 
          class="btn-secondary !rounded-2xl !px-6 disabled:opacity-20 transition-all font-bold"
        >
          Prev
        </button>
        <button 
          @click="page++; handleFetch()" 
          :disabled="page >= totalPages" 
          class="btn-primary !rounded-2xl !px-6 disabled:opacity-20 transition-all font-bold"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Invite Modal -->
    <UsersUserInviteModal 
      :show="showInviteModal" 
      @close="showInviteModal = false" 
      @success="handleFetch" 
    />
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'
import SelectInput from '@/components/core/SelectInput.vue'
import { useFetchUsers } from '@/composables/modules/users/useFetchUsers'
import { useActivateUser } from '@/composables/modules/users/useActivateUser'
import { useDeactivateUser } from '@/composables/modules/users/useDeactivateUser'
import { useConfirm } from '@/composables/core/useConfirm'

definePageMeta({ layout: 'dashboard' })

const { users, loading, total, fetchUsers } = useFetchUsers()
const { activateUser: activateAction } = useActivateUser()
const { deactivateUser: deactivateAction } = useDeactivateUser()
const { openConfirm } = useConfirm()

const page = ref(1)
const search = ref('')
const roleFilter = ref('')
const showInviteModal = ref(false)
const totalPages = computed(() => Math.ceil(total.value / 10))

let dt: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(dt)
  dt = setTimeout(() => { page.value = 1; handleFetch() }, 400)
}

function handleFetch() {
  fetchUsers({
    page: page.value,
    limit: 10,
    search: search.value || undefined,
    role: roleFilter.value || undefined
  })
}

async function handleActivate(u: User) {
  if (await openConfirm({
    title: 'Activate User',
    message: `Are you sure you want to activate administrative access for "${u.fullName}"?`,
    confirmText: 'Yes, Activate',
    confirmClass: 'bg-[#033958] text-white hover:bg-[#022f42] !rounded-2xl',
    icon: 'lucide:user-check'
  })) {
    const success = await activateAction(u._id)
    if (success) handleFetch()
  }
}

async function handleDeactivate(u: User) {
  if (await openConfirm({
    title: 'Suspend Access',
    message: `Are you sure you want to suspend access for "${u.fullName}"? This user will be unable to log in.`,
    confirmText: 'Yes, Suspend',
    confirmClass: 'bg-red-600 text-white hover:bg-red-700 !rounded-2xl',
    icon: 'lucide:user-x'
  })) {
    const success = await deactivateAction(u._id)
    if (success) handleFetch()
  }
}

onMounted(handleFetch)
</script>

<style scoped>
.badge-success {
  @apply inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100;
}

.badge-danger {
  @apply inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 border border-red-100;
}

.badge-warning {
  @apply inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100;
}
</style>
