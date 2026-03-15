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
          <div class="absolute inset-0 bg-[#033958]/20 backdrop-blur-md" @click="showForm = false"></div>
          
          <div class="relative bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl animate-modal-in overflow-hidden border border-white max-h-[90vh] flex flex-col">
            <!-- Modal Header -->
            <div class="p-8 pb-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-2xl bg-[#033958]/5 flex items-center justify-center text-[#033958]">
                  <Icon :name="editingId ? 'lucide:edit-3' : 'lucide:shield-plus'" class="w-7 h-7" />
                </div>
                <div>
                  <h2 class="text-3xl font-black text-gray-900 tracking-tight">{{ editingId ? 'Update' : 'Establish' }} Role</h2>
                  <p class="text-gray-500 text-sm font-medium">Configure security scope and staff limitations</p>
                </div>
              </div>
              <button 
                @click="showForm = false" 
                class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
              >
                <Icon name="lucide:x" class="w-6 h-6" />
              </button>
            </div>

            <form @submit.prevent="handleSave" class="flex-1 overflow-hidden flex flex-col">
              <div class="p-8 pt-6 overflow-y-auto custom-scrollbar flex-1 space-y-10">
                <!-- Basic Info Segment -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-6">
                    <AnimatedInput 
                      v-model="form.name" 
                      label="Public Title" 
                      required 
                      :disabled="!!editingId"
                      placeholder="e.g. Operations Director"
                    />
                    <div class="space-y-2">
                       <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 block">Contextual Details</label>
                       <textarea 
                        v-model="form.description" 
                        class="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:bg-white focus:border-[#033958] outline-none transition-all resize-none"
                        rows="3"
                        placeholder="Define the purpose of this security profile..."
                      ></textarea>
                    </div>
                  </div>

                  <!-- Statistics/Summary Card -->
                  <div class="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col justify-center items-center text-center space-y-4">
                    <div class="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm text-2xl font-black text-[#033958]">
                      {{ form.permissions.length }}
                    </div>
                    <div>
                      <p class="text-xs font-black uppercase tracking-widest text-[#033958]">Active Privileges</p>
                      <p class="text-xs text-gray-400 font-medium mt-1">Select specific modules this role can access from the distribution list below.</p>
                    </div>
                  </div>
                </div>

                <!-- Permissions Matrix -->
                <div class="space-y-8 pb-4">
                  <div class="flex items-center justify-between border-b border-gray-100 pb-4">
                    <label class="text-sm font-black text-gray-900 ml-1 flex items-center gap-2">
                      <Icon name="lucide:lock" class="w-4 h-4 text-amber-500" />
                      Access Distribution Matrix
                    </label>
                    <div class="flex items-center gap-4">
                      <button 
                        type="button" 
                        @click="selectAllPermissions"
                        class="text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Grant All Access
                      </button>
                      <button 
                        type="button" 
                        @click="form.permissions = []"
                        class="text-[9px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Revoke All
                      </button>
                    </div>
                  </div>
                  
                  <div class="space-y-10">
                    <div v-for="group in availablePermissions" :key="group.resource" class="space-y-4">
                      <div class="flex items-center gap-3">
                        <div class="h-px flex-1 bg-gray-100"></div>
                        <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-3">{{ group.resource }}</span>
                        <div class="h-px flex-1 bg-gray-100"></div>
                      </div>
                      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <label 
                          v-for="action in group.actions" 
                          :key="action.permission" 
                          class="relative group cursor-pointer"
                        >
                          <input 
                            type="checkbox" 
                            :value="action.permission" 
                            v-model="form.permissions" 
                            class="peer sr-only" 
                          />
                          <div class="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-transparent peer-checked:bg-amber-500 peer-checked:text-white transition-all duration-300 hover:bg-gray-100 shadow-sm peer-checked:shadow-amber-500/20">
                            <div class="w-5 h-5 rounded-md border-2 border-gray-300 flex items-center justify-center peer-checked:border-white transition-colors">
                              <Icon v-if="form.permissions.includes(action.permission)" name="lucide:check" class="w-3.5 h-3.5" />
                            </div>
                            <span class="text-[11px] font-bold capitalize truncate">
                              {{ action.label }}
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Toolbar -->
              <div class="p-8 border-t border-gray-100 bg-white flex gap-4 shrink-0 relative z-20">
                <button 
                  type="button" 
                  @click="showForm = false" 
                  class="flex-1 py-4 px-6 rounded-2xl bg-gray-50 text-gray-700 text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="flex-[2] py-4 px-6 rounded-2xl bg-gray-900 text-white text-xs font-black uppercase tracking-widest shadow-2xl shadow-black/10 hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  :disabled="saving"
                >
                  <Icon v-if="saving" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                  {{ saving ? 'Syncing...' : (editingId ? 'Push Updates' : 'Establish Role') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Roles List -->
    <div class="bg-white shadow-2xl shadow-gray-200/50 border border-gray-100 !rounded-[3rem] overflow-hidden">
      <div class="table-container !border-none !shadow-none !rounded-none">
        <table class="data-table">
          <thead>
            <tr class="!bg-gray-50/20">
              <th class="!py-8 !pl-10">Security Profile</th>
              <th class="!py-8">Permissions Scope</th>
              <th class="!py-8 !pr-10 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="loading">
              <td colspan="3" class="!p-12">
                <div class="flex flex-col items-center justify-center animate-pulse">
                  <div class="w-16 h-16 bg-gray-50 rounded-2xl mb-4"></div>
                  <div class="h-4 w-32 bg-gray-50 rounded-full mb-2"></div>
                </div>
              </td>
            </tr>
            <tr v-else-if="roles.length === 0">
              <td colspan="3" class="!py-24">
                <CoreEmptyState 
                  icon="lucide:shield-off" 
                  title="No Custom Roles" 
                  description="Begin by establishing security profiles for your administration team."
                />
              </td>
            </tr>
            <tr v-for="r in roles" :key="r._id" v-else class="hover:bg-gray-50/30 transition-colors">
              <td class="!py-8 !pl-10">
                <div class="flex items-start gap-5">
                  <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner border-2', r.isSystem ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100']">
                    {{ r.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="space-y-1.5">
                    <div class="flex items-center gap-2">
                      <h3 class="font-black text-gray-900 text-sm capitalize tracking-tight">{{ r.name }}</h3>
                      <span v-if="r.isSystem" class="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-widest border border-amber-200">System Internal</span>
                    </div>
                    <p class="text-[10px] font-bold text-gray-400 max-w-xs leading-relaxed uppercase tracking-tight">{{ r.description || 'Global administrative access profile.' }}</p>
                  </div>
                </div>
              </td>
              <td class="!py-8">
                <div class="flex flex-wrap gap-2 max-w-md">
                  <span v-for="p in r.permissions.slice(0, 3)" :key="p" class="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-900 text-[9px] font-black uppercase tracking-widest border border-white shadow-sm">
                    {{ p.split(':')[1] }} {{ p.split(':')[0] }}
                  </span>
                  <span v-if="r.permissions.length > 3" class="px-3 py-1.5 rounded-xl bg-[#033958] text-white text-[9px] font-black uppercase tracking-widest border border-white shadow-md">
                    +{{ r.permissions.length - 3 }} Privileges
                  </span>
                </div>
              </td>
              <td class="!py-8 !pr-10 text-right">
                <div class="flex items-center justify-end gap-3">
                  <button 
                    @click="editRole(r)" 
                    class="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-900 text-white shadow-xl shadow-black/10 hover:scale-110 active:scale-95 transition-all"
                  >
                    <Icon name="lucide:settings-2" class="w-5 h-5" />
                  </button>
                  <button 
                    v-if="!r.isSystem" 
                    @click="handleDelete(r)" 
                    class="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-red-500 hover:bg-red-50 hover:border-red-200 shadow-sm hover:scale-110 active:scale-95 transition-all"
                  >
                    <Icon name="lucide:trash-2" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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

function selectAllPermissions() {
  const allPerms: string[] = []
  availablePermissions.value.forEach((group: any) => {
    group.actions.forEach((action: any) => {
      allPerms.push(action.permission)
    })
  })
  form.value.permissions = allPerms
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
  background-color: #e5e7eb;
  border-radius: 9999px;
}
</style>
