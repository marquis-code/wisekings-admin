<template>
  <div>
    <definePageMeta :layout="'dashboard'" />
    
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Notifications</h1>
        <p class="text-gray-500 text-sm mt-1 font-medium">Global system alerts and user activity updates</p>
      </div>
      <div class="flex gap-3">
        <button @click="handleFetch" class="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#033958]/5 text-[#033958] hover:bg-[#033958] hover:text-white transition-all">
          <Icon name="lucide:rotate-cw" class="w-5 h-5" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <div class="space-y-4 max-w-3xl">
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 5" :key="i" class="h-24 bg-white rounded-[2rem] border border-gray-100 animate-pulse"></div>
      </div>
      <div v-else-if="notifications.length === 0" class="bg-white rounded-[2rem] p-12 shadow-sm border border-gray-100">
        <CoreEmptyState 
          icon="lucide:bell-off" 
          title="No notifications" 
          description="We'll notify you here when there are important system updates or actions required."
        />
      </div>
      <div 
        v-for="n in notifications" 
        :key="n._id" 
        :class="[
          'bg-white rounded-[2rem] p-6 shadow-sm border transition-all cursor-pointer group',
          n.isRead ? 'border-gray-100 opacity-60' : 'border-[#033958]/10 hover:shadow-md hover:border-[#033958]/20'
        ]" 
        @click="handleMarkRead(n)"
      >
        <div class="flex items-start gap-5">
          <div :class="[
            'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors',
            n.isRead ? 'bg-gray-100 text-gray-400' : 'bg-[#033958]/10 text-[#033958]'
          ]">
            <Icon :name="n.isRead ? 'lucide:bell' : 'lucide:bell-ring'" class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-1">
              <p :class="['text-sm font-black tracking-tight', n.isRead ? 'text-gray-500' : 'text-gray-900']">{{ n.title }}</p>
              <div v-if="!n.isRead" class="w-2 h-2 rounded-full bg-[#033958]"></div>
            </div>
            <p :class="['text-sm font-medium leading-relaxed', n.isRead ? 'text-gray-400' : 'text-gray-600']">{{ n.message }}</p>
            <div class="flex items-center gap-2 mt-3">
              <Icon name="lucide:clock" class="w-3 h-3 text-gray-300" />
              <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{{ new Date(n.createdAt).toLocaleString() }}</p>
            </div>
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
