<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Audit Trail</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Global history of system actions and security events</p>
      </div>
      <div class="flex gap-3">
        <div class="px-5 py-2.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-2">
          <Icon name="lucide:clipboard-list" class="w-4 h-4 text-gray-400" />
          <span class="text-xs font-black text-gray-500 uppercase tracking-widest">System Logs</span>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white shadow-sm border border-gray-100 overflow-hidden !rounded-3xl">
      <div class="overflow-x-auto">
        <table class="data-table w-full">
          <thead>
            <tr class="!bg-gray-50/50">
              <th class="!py-5 !pl-6">Actor/User</th>
              <th class="!py-5">Event/Action</th>
              <th class="!py-5">Target Resource</th>
              <th class="!py-5 text-center">Origin (IP)</th>
              <th class="!py-5 !pr-6 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="!p-0">
                <CoreSkeletonLoader :rows="8" />
              </td>
            </tr>
            <tr v-else-if="logs.length === 0">
              <td colspan="5" class="!py-10">
                <CoreEmptyState 
                  icon="lucide:history" 
                  title="No logs found" 
                  description="System activity logs will appear here as users interact with the platform."
                />
              </td>
            </tr>
            <tr v-for="l in logs" :key="l._id" v-else class="hover:bg-gray-50/50 transition-colors">
              <td class="!py-4 !pl-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                    <Icon name="lucide:user" class="w-4 h-4" />
                  </div>
                  <span class="text-sm font-bold text-gray-900 truncate max-w-[150px]">
                    {{ typeof l.userId === 'object' ? (l.userId as any)?.fullName : l.userId || 'System' }}
                  </span>
                </div>
              </td>
              <td class="!py-4 text-sm font-medium">
                <span class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                  {{ l.action }}
                </span>
              </td>
              <td class="!py-4">
                <code class="text-[10px] font-mono font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                  {{ l.resource }}
                </code>
              </td>
              <td class="!py-4 text-center">
                <span class="text-xs font-mono text-gray-400 font-medium">{{ l.ipAddress || '—' }}</span>
              </td>
              <td class="!py-4 !pr-6 text-right">
                <div class="text-[11px] font-bold text-gray-900">{{ new Date(l.timestamp).toLocaleDateString() }}</div>
                <div class="text-[10px] text-gray-400 font-medium lowercase">{{ new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <CorePagination 
      v-model="page" 
      :total="total" 
      :limit="10" 
      @update:modelValue="handleFetch"
    />
  </div>
</template>

<script setup lang="ts">
import type { AuditLog } from '~/types'
import { useFetchAuditLogs } from '@/composables/modules/audit/useFetchAuditLogs'

definePageMeta({ layout: 'dashboard' })

const { logs, loading, total, fetchAuditLogs } = useFetchAuditLogs()
const page = ref(1)

async function handleFetch() {
  await fetchAuditLogs({
    page: page.value,
    limit: 10
  })
}

onMounted(handleFetch)
</script>
