<template>
  <div class="fixed bottom-8 right-8 z-[200]">
    <!-- Toggle Button -->
    <button 
      @click="isOpen = !isOpen"
      class="w-16 h-16 rounded-[2.5rem] bg-[#033958] text-white shadow-2xl shadow-[#033958]/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
    >
      <div v-if="hasNotification && !isOpen" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-4 border-white animate-pulse"></div>
      <Icon :name="isOpen ? 'lucide:x' : 'lucide:sparkles'" class="w-7 h-7" :class="{ 'animate-pulse': loading }" />
    </button>

    <!-- Chat Window -->
    <Transition name="slide-up">
      <div v-if="isOpen" class="absolute bottom-20 right-0 w-[400px] max-h-[600px] bg-white rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
        <!-- Header -->
        <div class="p-6 bg-[#033958] text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Icon name="lucide:bot" class="w-6 h-6" />
            </div>
            <div>
              <p class="font-black uppercase tracking-widest text-[10px] opacity-70">WiseKings AI</p>
              <h3 class="font-bold text-lg leading-none">ERP Assistant</h3>
            </div>
          </div>
          <button @click="messages = []" class="p-2 hover:bg-white/10 rounded-xl transition-all" title="Clear Chat">
            <Icon name="lucide:refresh-cw" class="w-4 h-4" />
          </button>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px]" ref="messageContainer">
          <div v-if="messages.length === 0" class="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-40">
            <Icon name="lucide:message-square-dashed" class="w-12 h-12" />
            <p class="text-sm font-medium italic">How can I help you automate WiseKings today? Try asking about sales or stock.</p>
          </div>
          
          <div 
            v-for="(msg, i) in messages" 
            :key="i"
            :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
          >
            <div 
              :class="[
                'max-w-[85%] p-4 text-sm font-medium transition-all',
                msg.role === 'user' 
                  ? 'bg-gray-100 text-gray-800 rounded-2xl rounded-tr-none' 
                  : 'bg-[#033958]/5 text-[#033958] rounded-2xl rounded-tl-none border border-[#033958]/10'
              ]"
            >
              <p class="whitespace-pre-wrap leading-relaxed">{{ msg.content }}</p>
            </div>
          </div>

          <!-- Loading Indicator -->
          <div v-if="loading" class="flex justify-start">
            <div class="bg-gray-50 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
              <div class="w-1.5 h-1.5 bg-[#033958]/40 rounded-full animate-bounce"></div>
              <div class="w-1.5 h-1.5 bg-[#033958]/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div class="w-1.5 h-1.5 bg-[#033958]/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-6 border-t border-gray-50 flex gap-2 items-center bg-gray-50/30">
          <input 
            v-model="input" 
            @keyup.enter="sendMessage"
            placeholder="Type your command..." 
            class="flex-1 bg-white border border-gray-100 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#033958] focus:border-transparent outline-none transition-all shadow-sm"
          />
          <button 
            @click="sendMessage"
            :disabled="!input.trim() || loading"
            class="w-12 h-12 rounded-xl bg-[#033958] text-white flex items-center justify-center transition-all active:scale-90 disabled:opacity-50 disabled:grayscale shadow-lg shadow-[#033958]/20"
          >
            <Icon name="lucide:send-horizontal" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ai_api } from '@/api_factory/modules/ai'

const isOpen = ref(false)
const input = ref('')
const loading = ref(false)
const hasNotification = ref(false)
const messages = ref<{ role: 'user' | 'assistant', content: string }[]>([])
const messageContainer = ref<HTMLElement | null>(null)

async function sendMessage() {
  if (!input.value.trim() || loading.value) return
  
  const userMsg = input.value.trim()
  input.value = ''
  messages.value.push({ role: 'user', content: userMsg })
  
  loading.value = true
  scrollToBottom()
  
  try {
    const res = await ai_api.askAssistant(userMsg)
    messages.value.push({ role: 'assistant', content: res?.data || 'No response data' })
  } catch (e: any) {
    messages.value.push({ 
      role: 'assistant', 
      content: e.response?.data?.message || 'Something went wrong. Please check your connection or AI configuration.' 
    })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

// Example suggestions
const suggestions = ['Show today\'s sales', 'Low stock alert', 'Unpaid invoices']

watch(isOpen, (val) => {
  if (val) hasNotification.value = false
})
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>
