<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    <div class="mb-6"><h1 class="text-2xl font-bold text-white">Notifications</h1></div>
    <div class="space-y-3 max-w-2xl">
      <div v-if="notifications.length === 0" class="text-center py-12 text-dark-400">No notifications</div>
      <div v-for="n in notifications" :key="n._id" :class="['card-hover cursor-pointer', n.isRead ? 'opacity-60' : '']" @click="handleMarkRead(n)">
        <div class="flex items-start gap-3">
          <div :class="['w-2 h-2 rounded-full mt-2 flex-shrink-0', n.isRead ? 'bg-dark-600' : 'bg-primary-500']"></div>
          <div>
            <p class="text-sm font-medium text-white">{{ n.title }}</p>
            <p class="text-sm text-dark-400 mt-0.5">{{ n.message }}</p>
            <p class="text-xs text-dark-500 mt-1">{{ new Date(n.createdAt).toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Notification } from '~/types'
import { useFetchNotifications } from '@/composables/modules/notifications/useFetchNotifications'
import { useMarkNotificationRead } from '@/composables/modules/notifications/useMarkNotificationRead'

definePageMeta({ layout: 'dashboard' })

const { notifications, loading, fetchNotifications } = useFetchNotifications()
const { markRead: markReadAction } = useMarkNotificationRead()

async function handleFetch() { await fetchNotifications({ page: 1, limit: 50 }) }
async function handleMarkRead(n: Notification) {
  if (n.isRead) return
  const success = await markReadAction(n._id)
  if (success) n.isRead = true
}

onMounted(handleFetch)
</script>
