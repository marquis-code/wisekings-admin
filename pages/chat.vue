<template>
  <div class="h-screen w-screen bg-[#f0f2f5] flex overflow-hidden select-none font-sans text-[#111b21]">
    <!-- Left Sidebar -->
    <div class="w-[450px] border-r border-[#e9edef] flex flex-col bg-white shrink-0">
      <!-- Header -->
      <div class="h-[64px] px-4 bg-[#f0f2f5] flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white hover:scale-105 transition-transform" title="Back to Dashboard">
             <Icon name="lucide:layout-dashboard" size="20" />
          </NuxtLink>
          <div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-[#f0f2f5]">
            {{ user?.fullName?.charAt(0) || 'A' }}
          </div>
        </div>
        <div class="flex items-center gap-1">
          <button @click="showNewChatModal = true" class="p-2.5 text-[#54656f] hover:bg-[#d9dbdf] rounded-full transition-colors" title="New Chat">
            <Icon name="lucide:message-square-plus" class="w-5 h-5" />
          </button>
          <button class="p-2.5 text-[#54656f] hover:bg-[#d9dbdf] rounded-full transition-colors">
            <Icon name="lucide:more-vertical" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="p-2.5 bg-white shrink-0">
        <div class="relative group">
          <Icon name="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 text-[#8696a0] group-focus-within:text-[#00a884] transition-colors" size="16" />
          <input
            v-model="searchQuery"
            placeholder="Search or start new chat"
            class="w-full bg-[#f0f2f5] border-none rounded-xl pl-12 pr-4 py-2 text-sm text-[#3b4a54] focus:ring-0 placeholder:text-[#8696a0]"
          />
        </div>
      </div>

      <!-- Conversations -->
      <div class="flex-1 overflow-y-auto custom-scrollbar bg-white">
        <div v-if="loadingConversations" class="p-12 flex justify-center">
          <Icon name="lucide:loader-2" class="w-8 h-8 text-[#00a884] animate-spin" />
        </div>

        <div v-else-if="filteredConversations.length === 0" class="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
          <div class="w-20 h-20 bg-[#f0f2f5] rounded-full flex items-center justify-center">
            <Icon name="lucide:message-square" class="w-10 h-10 text-[#d1d7db]" />
          </div>
          <p class="text-sm font-bold text-[#8696a0] uppercase tracking-widest">No chats found</p>
          <button @click="showNewChatModal = true" class="px-6 py-2 bg-[#00a884] text-white rounded-full text-xs font-bold hover:bg-[#06cf9c] transition-colors shadow-md">
            Start New Chat
          </button>
        </div>

        <div v-else class="divide-y divide-[#f5f6f6]">
          <button
            v-for="conv in filteredConversations"
            :key="conv._id"
            @click="getHistory(conv._id)"
            :class="[
              'w-full px-4 py-3 flex items-center gap-4 transition-all text-left group h-[72px]',
              activeConversation?._id === conv._id ? 'bg-[#ebebeb]' : 'hover:bg-[#f5f6f6]'
            ]"
          >
            <div class="relative shrink-0">
              <div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-sm"
                :class="conv.type === 'group' ? 'bg-[#033958]' : 'bg-[#00a884]'">
                {{ getParticipantInitials(conv) }}
              </div>
            </div>

            <div class="flex-1 min-w-0 py-1 border-b border-[#f5f6f6]">
              <div class="flex justify-between items-center mb-0.5">
                <span class="font-normal text-[17px] text-[#111b21] truncate">
                  {{ getParticipantName(conv) }}
                </span>
                <span class="text-[12px] text-[#667781] shrink-0 ml-2">
                  {{ conv.lastMessageAt ? formatRelativeTime(conv.lastMessageAt) : '' }}
                </span>
              </div>
              <p class="text-[14px] text-[#667781] truncate flex items-center gap-1">
                <Icon v-if="conv.lastMessageBy === user?._id" name="lucide:check-check" class="w-4 h-4 text-[#53bdeb]" />
                {{ conv.lastMessage || 'Tap to chat' }}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Right Area -->
    <div class="flex-1 flex flex-col bg-[#efeae2] relative overflow-hidden">
      <!-- Wallpaper -->
      <div class="absolute inset-0 opacity-[0.4] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"></div>

      <template v-if="activeConversation">
        <!-- Header -->
        <div class="h-[64px] px-4 flex items-center justify-between bg-[#f0f2f5] shrink-0 relative z-10 border-l border-[#d1d7db]">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center bg-[#00a884] text-white font-bold text-lg">
              {{ getParticipantInitials(activeConversation) }}
            </div>
            <div class="min-w-0">
              <h2 class="font-medium text-[16px] text-[#111b21] truncate tracking-tight">{{ getParticipantName(activeConversation) }}</h2>
              <p class="text-[11px] text-[#667781] flex items-center gap-1">
                <span v-if="isTyping" class="text-[#00a884] animate-pulse">typing...</span>
                <span v-else-if="isConnected" class="text-[#667781]">online</span>
                <span v-else class="text-[#111b21] bg-[#d1d7db] px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-tighter">Connecting...</span>
              </p>
            </div>
          </div>
          <div class="flex items-center gap-4 px-2">
            <button class="p-2 text-[#54656f] hover:bg-[#d9dbdf] rounded-full transition-colors">
              <Icon name="lucide:search" class="w-5 h-5" />
            </button>
            <button class="p-2 text-[#54656f] hover:bg-[#d9dbdf] rounded-full transition-colors">
              <Icon name="lucide:more-vertical" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-12 space-y-1 relative z-10 custom-scrollbar scroll-smooth" ref="messagesContainer">
          <div v-if="loadingMessages" class="flex justify-center py-20">
            <Icon name="lucide:loader-2" class="w-10 h-10 text-[#00a884] animate-spin" />
          </div>

          <template v-else>
            <template v-for="(msg, i) in messages" :key="msg._id || i">
               <!-- Date Separator -->
               <div v-if="showDateSeparator(i)" class="flex justify-center my-6">
                <span class="px-3 py-1.5 bg-white rounded-lg text-[12px] text-[#54656f] uppercase tracking-widest shadow-sm">
                  {{ formatDateSeparator(msg.createdAt) }}
                </span>
               </div>

               <div :class="['flex mb-1', isSentByMe(msg) ? 'justify-end' : 'justify-start']">
                <div :class="['max-w-[85%] md:max-w-[65%] flex flex-col', isSentByMe(msg) ? 'items-end' : 'items-start']">
                  <!-- Message Bubble -->
                  <div :class="['relative p-2 px-3 shadow-sm min-w-[80px] group transition-all', 
                    isSentByMe(msg) 
                      ? 'bg-[#dcf8c6] text-[#111b21] rounded-lg rounded-tr-none' 
                      : 'bg-[#ffffff] text-[#111b21] rounded-lg rounded-tl-none']">
                    
                    <p class="text-[14.2px] leading-relaxed break-words pr-10">{{ msg.content }}</p>
                    
                    <span class="absolute bottom-1 right-1.5 flex items-center gap-1">
                      <span class="text-[11px] text-[#667781]">{{ formatTime(msg.createdAt) }}</span>
                      <Icon v-if="isSentByMe(msg)" 
                        :name="msg.isRead ? 'lucide:check-check' : 'lucide:check'" 
                        :class="['w-3.5 h-3.5', msg.isRead ? 'text-[#53bdeb]' : 'text-[#8696af]']" />
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </div>

        <!-- Input -->
        <div class="px-4 py-2.5 bg-[#f0f2f5] flex items-center gap-4 relative z-10 shrink-0 border-l border-[#d1d7db]">
          <div class="flex items-center gap-1">
            <button class="p-2 text-[#54656f] hover:text-[#00a884] transition-colors">
              <Icon name="lucide:smile" class="w-6 h-6" />
            </button>
            <button class="p-2 text-[#54656f] hover:text-[#00a884] transition-colors">
              <Icon name="lucide:plus" class="w-6 h-6" />
            </button>
          </div>
          <div class="flex-1">
            <input 
              v-model="text" 
              @input="handleTyping"
              @keydown.enter.prevent="handleSend"
              placeholder="Type a message..." 
              class="w-full bg-white border-none rounded-xl py-2.5 px-4 text-[15px] text-[#3b4a54] focus:ring-0 placeholder:text-[#8696a0]"
            />
          </div>
          <button @click="handleSend" :disabled="!text.trim()" 
            class="w-10 h-10 flex items-center justify-center text-[#54656f] hover:text-[#00a884] transition-all disabled:opacity-30">
            <Icon :name="text.trim() ? 'lucide:send' : 'lucide:mic'" class="w-6 h-6" />
          </button>
        </div>
      </template>

      <!-- Empty State -->
      <div v-else class="flex-1 flex flex-col items-center justify-center text-center p-12 relative z-10 bg-[#f8f9fa] border-l border-[#d1d7db]">
        <div class="mb-10 text-[#d1d7db]">
           <Icon name="lucide:laptop" class="w-64 h-64" />
        </div>
        <h2 class="text-[32px] font-light text-[#41525d] mb-4">WiseKings Admin Chat</h2>
        <p class="text-[#667781] text-[14px] max-w-md leading-relaxed mb-10">
          Connect with Merchants and Partners instantly. <br/>
          Select a chat to begin messaging with end-to-end security.
        </p>
        <button @click="showNewChatModal = true" class="px-8 py-3 bg-[#00a884] text-white rounded-full text-sm font-bold hover:bg-[#06cf9c] transition-all transform active:scale-95 mb-10 shadow-lg shadow-[#00a884]/20">
          Start New Conversation
        </button>
        <div class="flex items-center gap-2 text-[#8696a0]">
          <Icon name="lucide:lock" class="w-3 h-3" />
          <span class="text-[12px]">End-to-end encrypted</span>
        </div>
      </div>
    </div>

    <!-- New Chat Modal -->
    <div v-if="showNewChatModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showNewChatModal = false"></div>
      <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div class="p-4 bg-[#f0f2f5] flex items-center justify-between">
          <h3 class="font-bold text-lg text-[#111b21]">New Chat</h3>
          <button @click="showNewChatModal = false" class="p-2 text-[#54656f] hover:text-[#111b21] transition-colors">
            <Icon name="lucide:x" size="20" />
          </button>
        </div>

        <div class="p-4">
          <div class="relative mb-4">
            <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-[#8696a0]" size="14" />
            <input 
              v-model="userSearchQuery"
              @input="handleUserSearch"
              placeholder="Search merchants or partners"
              class="w-full bg-[#f0f2f5] border-none rounded-lg py-2 pl-9 pr-4 text-sm text-[#3b4a54] focus:ring-1 focus:ring-[#00a884] placeholder:text-[#8696a0]"
            />
          </div>

          <div class="h-64 overflow-y-auto custom-scrollbar space-y-1">
            <div v-if="searchingUsers" class="flex justify-center py-10">
              <Icon name="lucide:loader-2" class="w-6 h-6 text-[#00a884] animate-spin" />
            </div>
            <template v-else-if="users.length > 0">
              <button 
                v-for="u in users" 
                :key="u._id"
                @click="startChat(u)"
                class="w-full p-3 flex items-center gap-3 hover:bg-[#f5f6f6] rounded-xl transition-colors text-left group"
              >
                <div class="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white font-bold text-sm">
                  {{ u.fullName?.charAt(0) || 'U' }}
                </div>
                <div>
                  <p class="font-bold text-sm text-[#111b21] group-hover:text-[#00a884] transition-colors">{{ u.fullName }}</p>
                  <p class="text-xs text-[#667781] uppercase tracking-tighter">{{ u.userType }}</p>
                </div>
              </button>
            </template>
            <div v-else class="flex flex-col items-center justify-center py-10 text-center opacity-50">
               <Icon name="lucide:users" class="w-8 h-8 mb-2" />
               <p class="text-xs font-bold text-[#111b21]">No stakeholders found</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChat } from '@/composables/modules/chat/useChat'
import { useAuthState } from '@/composables/useAuthState'
import { format, isToday, isYesterday, isSameDay } from 'date-fns'

definePageMeta({
  layout: 'chat'
})

const { user } = useAuthState()
const {
  conversations,
  messages,
  isConnected,
  isTyping,
  activeConversation,
  loadingConversations,
  loadingMessages,
  connect,
  getConversations,
  getHistory,
  getParticipants,
  createConversation,
  sendMessage,
  sendTyping,
} = useChat()

const text = ref('')
const searchQuery = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

// New Chat Modal State
const showNewChatModal = ref(false)
const userSearchQuery = ref('')
const searchingUsers = ref(false)
const users = ref<any[]>([])

const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value
  const q = searchQuery.value.toLowerCase()
  return conversations.value.filter((conv: any) => {
    const name = getParticipantName(conv).toLowerCase()
    return name.includes(q)
  })
})

function handleSend() {
  if (!text.value.trim()) return
  sendMessage(text.value.trim())
  text.value = ''
}

let typingTimeout: any = null
function handleTyping() {
  sendTyping(true)
  if (typingTimeout) clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => sendTyping(false), 2000)
}

function getOtherParticipant(conv: any) {
  if (!conv?.participants) return null
  return conv.participants.find((p: any) => p._id !== user.value?._id) || conv.participants[0]
}

function getParticipantName(conv: any) {
  if (conv?.groupName) return conv.groupName
  const other = getOtherParticipant(conv)
  return other?.fullName || other?.email || 'User'
}

function getParticipantInitials(conv: any) {
  const name = getParticipantName(conv)
  return name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
}

function isSentByMe(msg: any) {
  const senderId = msg.senderId?._id || msg.senderId
  return senderId === user.value?._id
}

function formatTime(date: any) {
  return date ? format(new Date(date), 'HH:mm') : ''
}

function formatRelativeTime(date: any) {
  if (!date) return ''
  const d = new Date(date)
  if (isToday(d)) return format(d, 'HH:mm')
  if (isYesterday(d)) return 'Yesterday'
  return format(d, 'dd/MM/yy')
}

function formatDateSeparator(date: any) {
  if (!date) return ''
  const d = new Date(date)
  if (isToday(d)) return 'TODAY'
  if (isYesterday(d)) return 'YESTERDAY'
  return format(d, 'MMMM d, yyyy').toUpperCase()
}

function showDateSeparator(index: number) {
  if (index === 0) return true
  return !isSameDay(new Date(messages.value[index].createdAt), new Date(messages.value[index - 1].createdAt))
}

// User Search for New Chat
let searchTimeout: any = null
async function handleUserSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    searchingUsers.value = true
    users.value = await getParticipants(userSearchQuery.value)
    searchingUsers.value = false
  }, 300)
}

async function startChat(participant: any) {
  const exists = conversations.value.find(c => 
    c.type === 'direct' && 
    c.participants.some((p: any) => p._id === participant._id)
  )

  if (exists) {
    getHistory(exists._id)
  } else {
    const newConv = await createConversation([participant._id])
    if (newConv) getHistory(newConv._id)
  }
  showNewChatModal.value = false
}

watch(messages, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}, { deep: true })

onMounted(async () => {
  connect()
  await getConversations()
  users.value = await getParticipants()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
