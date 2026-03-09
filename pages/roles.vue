<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex items-center justify-between mb-6">
      <div><h1 class="text-2xl font-bold text-white">Roles & Permissions</h1><p class="text-dark-400 text-sm mt-1">Configure staff access control</p></div>
      <button @click="showForm = true; editingId = ''" class="btn-primary"><Icon name="lucide:plus" class="w-4 h-4" /> Add Role</button>
    </div>

    <!-- Role Form Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-dark-850 border border-dark-700 rounded-2xl p-6 w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto">
        <h2 class="text-lg font-semibold text-white mb-4">{{ editingId ? 'Edit' : 'New' }} Role</h2>
        <form @submit.prevent="handleSave" class="space-y-4">
          <div><label class="label">Name</label><input v-model="form.name" class="input" required :disabled="!!editingId" /></div>
          <div><label class="label">Description</label><textarea v-model="form.description" class="input min-h-[60px]" /></div>
          <div>
            <label class="label mb-2">Permissions</label>
            <div class="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto bg-dark-900 rounded-lg p-3">
              <label v-for="p in availablePermissions" :key="p" class="flex items-center gap-2 text-sm text-dark-300 hover:text-dark-200">
                <input type="checkbox" :value="p" v-model="form.permissions" class="rounded bg-dark-800 border-dark-600 text-primary-600" />
                {{ p }}
              </label>
            </div>
          </div>
          <div class="flex gap-3">
            <button type="submit" class="btn-primary flex-1" :disabled="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
            <button type="button" @click="showForm = false" class="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Roles List -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="r in roles" :key="r._id" class="card-hover">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold text-white capitalize">{{ r.name }}</h3>
          <span v-if="r.isSystem" class="badge-info">System</span>
        </div>
        <p class="text-dark-400 text-sm mb-3">{{ r.description || 'No description' }}</p>
        <div class="flex flex-wrap gap-1 mb-4">
          <span v-for="p in r.permissions.slice(0, 5)" :key="p" class="badge-neutral text-[10px]">{{ p }}</span>
          <span v-if="r.permissions.length > 5" class="badge-neutral text-[10px]">+{{ r.permissions.length - 5 }} more</span>
        </div>
        <div class="flex gap-2">
          <button @click="editRole(r)" class="btn-ghost btn-sm"><Icon name="lucide:edit" class="w-3.5 h-3.5" /> Edit</button>
          <button v-if="!r.isSystem" @click="handleDelete(r)" class="btn-ghost btn-sm text-red-400"><Icon name="lucide:trash-2" class="w-3.5 h-3.5" /> Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Role } from '~/types'
import { useFetchRoles } from '@/composables/modules/roles/useFetchRoles'
import { useFetchPermissions } from '@/composables/modules/roles/useFetchPermissions'
import { useSaveRole } from '@/composables/modules/roles/useSaveRole'
import { useDeleteRole } from '@/composables/modules/roles/useDeleteRole'

definePageMeta({ layout: 'dashboard' })

const { roles, loading, fetchRoles } = useFetchRoles()
const { permissions: availablePermissions, fetchPermissions } = useFetchPermissions()
const { saveRole: saveAction, loading: saving } = useSaveRole()
const { deleteRole: deleteAction } = useDeleteRole()

const showForm = ref(false)
const editingId = ref('')
const form = ref({ name: '', description: '', permissions: [] as string[] })

function editRole(r: Role) {
  editingId.value = r._id
  form.value = {
    name: r.name,
    description: r.description || '',
    permissions: [...r.permissions]
  }
  showForm.value = true
}

async function handleSave() {
  const success = await saveAction(form.value, editingId.value)
  if (success) {
    showForm.value = false
    form.value = { name: '', description: '', permissions: [] }
    fetchRoles()
  }
}

async function handleDelete(r: Role) {
  if (confirm(`Delete role "${r.name}"?`)) {
    const success = await deleteAction(r._id)
    if (success) fetchRoles()
  }
}

onMounted(() => {
  fetchRoles()
  fetchPermissions()
})
</script>
