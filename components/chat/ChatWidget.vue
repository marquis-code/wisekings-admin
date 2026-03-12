<template>
  <div class="fixed bottom-8 right-8 z-[100]">
    <!-- Chat Button -->
    <button 
      @click="toggleChat"
      :class="['w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group', 
      isOpen ? 'bg-gray-900 border border-white/10' : 'bg-[#033958] shadow-blue-900/30']"
    >
      <Icon v-if="!isOpen" name="lucide:message-square" class="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
      <Icon v-else name="lucide:x" class="w-8 h-8 text-white transition-opacity" />
    </button>

    <!-- Chat Mini Window -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-8 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform translate-y-8 opacity-0 scale-95"
    >
      <div v-if="isOpen" class="absolute bottom-20 right-0 w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="p-6 bg-gray-900 text-white flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Icon name="lucide:messages-square" class="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 class="font-black text-sm tracking-tight">Recent Chats</h3>
              <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-0.5">Admin Control Center</p>
            </div>
          </div>
          <NuxtLink to="/chat" @click="isOpen = false" class="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
            <Icon name="lucide:maximize-2" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <!-- Conversations List (Mini) -->
        <div class="flex-1 overflow-y-auto bg-white custom-scrollbar">
          <div v-if="loadingConversations" class="p-12 flex justify-center">
            <Icon name="lucide:loader-2" class="w-8 h-8 text-[#033958] animate-spin" />
          </div>

          <div v-else-if="conversations.length === 0" class="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
            <Icon name="lucide:inbox" class="w-12 h-12 text-gray-200" />
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">No Recent Activity</p>
          </div>

          <div v-else class="divide-y divide-gray-50">
            <button 
              v-for="conv in conversations.slice(0, 8)" 
              :key="conv._id"
              @click="openFullChat(conv._id)"
              class="w-full p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#033958] text-xs shrink-0">
                {{ getConversationName(conv).charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-0.5">
                  <span class="font-bold text-gray-900 text-xs truncate">{{ getConversationName(conv) }}</span>
                </div>
                <p class="text-[10px] text-gray-500 truncate font-medium">{{ conv.lastMessage || 'Click to view' }}</p>
              </div>
            </button>
          </div>
        </div>

        <div class="p-4 bg-gray-50 border-t border-gray-100">
           <NuxtLink to="/chat" @click="isOpen = false" class="w-full py-3 bg-[#033958] text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-[#055380] transition-all">
              Go to Messages Center
              <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
           </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useChat } from '@/composables/modules/chat/useChat'
import { useAuthState } from '@/composables/useAuthState'

const isOpen = ref(false)
const { user } = useAuthState()
const { conversations, loadingConversations, getConversations } = useChat()
const router = useRouter()

async function toggleChat() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await getConversations()
  }
}

function openFullChat(id: string) {
  isOpen.value = false
  router.push(`/chat?id=${id}`) // We can handle the ID on the chat page
}

function getConversationName(conv: any) {
  if (conv.groupName) return conv.groupName
  const other = conv.participants?.find((p: any) => p._id !== user.value?._id)
  return other?.fullName || other?.email || 'User'
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
</style>
