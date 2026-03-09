<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="mb-6"><h1 class="text-2xl font-bold text-white">Audit Trail</h1><p class="text-dark-400 text-sm mt-1">Track all system actions and changes</p></div>
    <div class="table-container">
      <table class="data-table">
        <thead><tr><th>User</th><th>Action</th><th>Resource</th><th>IP</th><th>Timestamp</th></tr></thead>
        <tbody>
          <tr v-if="loading"><td colspan="5" class="text-center py-12 text-dark-400"><Icon name="lucide:loader-2" class="w-6 h-6 animate-spin mx-auto" /></td></tr>
          <tr v-else-if="logs.length === 0"><td colspan="5" class="text-center py-12 text-dark-400">No audit logs</td></tr>
          <tr v-for="l in logs" :key="l._id" v-else>
            <td class="text-dark-200 text-sm">{{ typeof l.userId === 'object' ? (l.userId as any)?.fullName : l.userId }}</td>
            <td><span class="badge-info">{{ l.action }}</span></td>
            <td class="text-dark-300 text-sm">{{ l.resource }}</td>
            <td class="text-dark-400 text-xs font-mono">{{ l.ipAddress || '—' }}</td>
            <td class="text-dark-400 text-xs">{{ new Date(l.timestamp).toLocaleString() }}</td>
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
import type { AuditLog } from '~/types'
import { useFetchAuditLogs } from '@/composables/modules/audit/useFetchAuditLogs'

definePageMeta({ layout: 'dashboard' })

const { logs, loading, total, fetchAuditLogs } = useFetchAuditLogs()
const page = ref(1)
const totalPages = computed(() => Math.ceil(total.value / 20))

async function handleFetch() {
  await fetchAuditLogs({
    page: page.value,
    limit: 20
  })
}

onMounted(handleFetch)
</script>
