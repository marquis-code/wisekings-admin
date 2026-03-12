<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Roles & Permissions</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Configure and manage staff access control</p>
      </div>
      <button 
        @click="openAddModal" 
        class="group btn-primary !rounded-2xl !px-6 !py-3 shadow-lg shadow-[#033958]/10 hover:shadow-[#033958]/20 transition-all duration-300"
      >
        <span class="flex items-center gap-2">
          <Icon name="lucide:plus" class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 
          Add Role
        </span>
      </button>
    </div>

    <!-- Role Form Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showForm" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/20 backdrop-blur-sm" @click="showForm = false"></div>
          
          <div class="relative bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl animate-modal-in overflow-hidden border border-white max-h-[90vh] flex flex-col">
            <div class="flex items-center justify-between mb-8 flex-shrink-0">
              <div>
                <h2 class="text-2xl font-black text-gray-900 tracking-tight">{{ editingId ? 'Update' : 'Create' }} Role</h2>
                <p class="text-gray-500 text-sm font-medium mt-1">Define access levels and permissions</p>
              </div>
              <button 
                @click="showForm = false" 
                class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300"
              >
                <Icon name="lucide:x" class="w-6 h-6" />
              </button>
            </div>

            <form @submit.prevent="handleSave" class="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
              <AnimatedInput 
                v-model="form.name" 
                label="Role Name" 
                required 
                :disabled="!!editingId"
                placeholder="e.g. Manager"
              />
              
              <AnimatedInput 
                v-model="form.description" 
                label="Role Description" 
                type="textarea" 
                :rows="2"
                placeholder="Briefly describe what this role can do..."
              />

              <div class="space-y-4">
                <label class="text-sm font-bold text-gray-900 ml-1 flex items-center gap-2">
                  <Icon name="lucide:shield-check" class="w-4 h-4 text-[#033958]" />
                  Permissions
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/50 rounded-3xl p-6 border border-gray-100">
                  <label 
                    v-for="p in availablePermissions" 
                    :key="p" 
                    class="group flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 cursor-pointer hover:border-[#033958] hover:shadow-sm transition-all duration-300"
                  >
                    <div class="relative flex items-center">
                      <input 
                        type="checkbox" 
                        :value="p" 
                        v-model="form.permissions" 
                        class="custom-checkbox !w-5 !h-5" 
                      />
                    </div>
                    <span class="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors capitalize">
                      {{ p.replace(/_/g, ' ') }}
                    </span>
                  </label>
                </div>
              </div>

              <div class="flex gap-4 pt-4 sticky bottom-0 bg-white pb-2 mt-auto">
                <button 
                  type="submit" 
                  class="flex-[2] btn-primary !rounded-[1.5rem] !py-4 shadow-xl shadow-[#033958]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  :disabled="saving"
                >
                  <Icon v-if="saving" name="lucide:loader-2" class="w-5 h-5 animate-spin mr-2" />
                  {{ saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Create Role') }}
                </button>
                <button 
                  type="button" 
                  @click="showForm = false" 
                  class="flex-1 btn-secondary !rounded-[1.5rem] !py-4 hover:bg-gray-200 transition-all duration-300"
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Roles List -->
    <div class="table-container bg-white shadow-sm border-gray-100 overflow-hidden !rounded-3xl">
      <table class="data-table">
        <thead>
          <tr class="!bg-gray-50/50">
            <th class="!py-5 !pl-6 w-1/3">Role Details</th>
            <th class="!py-5 w-1/2">Permissions</th>
            <th class="!py-5 !pr-6 text-right w-[150px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="3" class="!p-0">
              <CoreSkeletonLoader :rows="3" />
            </td>
          </tr>
          <tr v-else-if="roles.length === 0">
            <td colspan="3" class="!py-10">
              <CoreEmptyState 
                icon="lucide:shield-off" 
                title="No roles defined" 
                description="Establish security profiles and permissions to manage team access levels."
              />
            </td>
          </tr>
          <tr v-for="r in roles" :key="r._id" v-else class="group">
            <td class="!py-4 !pl-6 align-top">
              <div class="flex flex-col gap-1.5">
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-gray-900 text-sm capitalize">{{ r.name }}</h3>
                  <span v-if="r.isSystem" class="px-2 py-0.5 rounded-lg bg-[#033958]/5 text-[#033958] text-[10px] font-black uppercase tracking-widest border border-[#033958]/10">System</span>
                </div>
                <p class="text-xs font-medium text-gray-500 leading-snug">{{ r.description || 'No description provided.' }}</p>
              </div>
            </td>
            <td class="!py-4 align-top">
              <div class="flex flex-wrap gap-1.5">
                <span v-for="p in r.permissions.slice(0, 5)" :key="p" class="px-2 py-1 rounded-lg bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wider border border-gray-100">
                  {{ p.replace(/_/g, ' ') }}
                </span>
                <span v-if="r.permissions.length > 5" class="px-2 py-1 rounded-lg bg-gray-50 text-[#033958] text-[10px] font-black uppercase tracking-wider border border-gray-100">
                  +{{ r.permissions.length - 5 }} More
                </span>
              </div>
            </td>
            <td class="!py-4 !pr-6 text-right align-top">
              <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  @click="editRole(r)" 
                  class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-[#033958] hover:text-white transition-all duration-300"
                  title="Edit Role"
                >
                  <Icon name="lucide:edit" class="w-4 h-4" />
                </button>
                <button 
                  v-if="!r.isSystem" 
                  @click="handleDelete(r)" 
                  class="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                  title="Delete Role"
                >
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Role } from '~/types'
import { useFetchRoles } from '@/composables/modules/roles/useFetchRoles'
import { useFetchPermissions } from '@/composables/modules/roles/useFetchPermissions'
import { useSaveRole } from '@/composables/modules/roles/useSaveRole'
import { useDeleteRole } from '@/composables/modules/roles/useDeleteRole'
import { useConfirm } from '@/composables/core/useConfirm'
import AnimatedInput from '@/components/core/AnimatedInput.vue'

definePageMeta({ layout: 'dashboard' })

const { roles, loading, fetchRoles } = useFetchRoles()
const { permissions: availablePermissions, fetchPermissions } = useFetchPermissions()
const { saveRole: saveAction, loading: saving } = useSaveRole()
const { deleteRole: deleteAction } = useDeleteRole()
const { confirmDelete } = useConfirm()

const showForm = ref(false)
const editingId = ref('')
const form = ref({ name: '', description: '', permissions: [] as string[] })

function openAddModal() {
  editingId.value = ''
  form.value = { name: '', description: '', permissions: [] }
  showForm.value = true
}

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
  if (await confirmDelete('Delete Role', `Are you sure you want to delete the role "${r.name}"? This action cannot be undone.`)) {
    const success = await deleteAction(r._id)
    if (success) fetchRoles()
  }
}

onMounted(() => {
  fetchRoles()
  fetchPermissions()
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.4s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.animate-modal-in {
  animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-200 rounded-full;
}
</style>
