<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="mb-6"><h1 class="text-2xl font-bold text-white">Users & Staff</h1><p class="text-dark-400 text-sm mt-1">Manage platform users and staff accounts</p></div>
    <div class="card mb-6"><div class="flex flex-wrap gap-3">
      <input v-model="search" type="text" placeholder="Search users..." class="input max-w-xs" @input="debouncedFetch" />
      <select v-model="roleFilter" class="input max-w-[160px]" @change="fetchUsers"><option value="">All Roles</option><option v-for="r in ['superadmin','admin','finance','support','viewer','user']" :key="r" :value="r">{{ r }}</option></select>
    </div></div>
    <div class="table-container">
      <table class="data-table">
        <thead><tr><th>User</th><th>Type</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-if="loading"><td colspan="6" class="text-center py-12 text-dark-400"><Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto" /></td></tr>
          <tr v-else-if="users.length === 0"><td colspan="6" class="text-center py-12 text-dark-400">No users found</td></tr>
          <tr v-for="u in users" :key="u._id" v-else>
            <td><p class="font-medium text-white">{{ u.fullName }}</p><p class="text-xs text-dark-400">{{ u.email }}</p></td>
            <td><span class="badge-info capitalize">{{ u.userType }}</span></td>
            <td><span class="badge-neutral capitalize">{{ u.role }}</span></td>
            <td><span :class="u.isActive ? 'badge-success' : 'badge-danger'">{{ u.isActive ? 'Active' : 'Inactive' }}</span></td>
            <td class="text-dark-400 text-xs">{{ u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : '—' }}</td>
            <td><div class="flex gap-1">
              <button v-if="u.isActive" @click="handleDeactivate(u)" class="btn-ghost btn-sm text-red-400"><Icon name="lucide:user-x" class="w-3.5 h-3.5" /></button>
              <button v-else @click="handleActivate(u)" class="btn-ghost btn-sm text-emerald-400"><Icon name="lucide:user-check" class="w-3.5 h-3.5" /></button>
            </div></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-4">
      <p class="text-sm text-dark-400">Page {{ page }} of {{ totalPages }}</p>
      <div class="flex gap-2"><button @click="page--; handleFetch()" :disabled="page <= 1" class="btn-secondary btn-sm">Prev</button><button @click="page++; handleFetch()" :disabled="page >= totalPages" class="btn-secondary btn-sm">Next</button></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~/types'
import { useFetchUsers } from '@/composables/modules/users/useFetchUsers'
import { useActivateUser } from '@/composables/modules/users/useActivateUser'
import { useDeactivateUser } from '@/composables/modules/users/useDeactivateUser'

definePageMeta({ layout: 'dashboard' })

const { users, loading, total, fetchUsers } = useFetchUsers()
const { activateUser: activateAction } = useActivateUser()
const { deactivateUser: deactivateAction } = useDeactivateUser()

const page = ref(1)
const search = ref('')
const roleFilter = ref('')
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
  const success = await activateAction(u._id)
  if (success) handleFetch()
}

async function handleDeactivate(u: User) {
  const success = await deactivateAction(u._id)
  if (success) handleFetch()
}

onMounted(handleFetch)
</script>
