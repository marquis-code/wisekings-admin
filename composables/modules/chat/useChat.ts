import { io, Socket } from 'socket.io-client'
import { ref, onUnmounted } from 'vue'
import { chatApiFactory } from '~/api_factory/modules/chat'

export const useChat = () => {
    const config = useRuntimeConfig()
    const { accessToken, user } = useAuthState()
    const socket = ref<Socket | null>(null)
    const conversations = ref<any[]>([])
    const messages = ref<any[]>([])
    const isConnected = ref(false)
    const isTyping = ref(false)
    const typingUser = ref<string | null>(null)
    const activeConversation = ref<any>(null)
    const loadingConversations = ref(false)
    const loadingMessages = ref(false)

    const connect = () => {
        if (socket.value?.connected) return

        const socketUrl = (config.public.apiBase as string).replace('/api/v1', '')
        socket.value = io(`${socketUrl}/chat`, {
            auth: { token: `Bearer ${accessToken.value}` },
            transports: ['polling', 'websocket'],
            reconnection: true,
            reconnectionAttempts: 10,
            timeout: 10000,
            autoConnect: true
        })

        socket.value.on('connect', () => {
            isConnected.value = true
            console.log('Admin Chat Socket Connected')
        })

        socket.value.on('disconnect', (reason) => {
            isConnected.value = false
            console.log('Admin Chat Socket Disconnected:', reason)
            if (reason === 'io server disconnect') {
                socket.value?.connect()
            }
        })

        socket.value.on('connect_error', (error) => {
            console.error('Admin Chat Connection Error:', error)
            isConnected.value = false
        })

        socket.value.on('chat:message:new', (msg) => {
            console.log('New message received:', msg)
            const incomingConvId = msg.conversationId?._id || msg.conversationId
            const activeConvId = activeConversation.value?._id || activeConversation.value

            // Add to messages if we're in the active conversation
            if (activeConvId === incomingConvId) {
                // Prevent duplicate messages
                if (!messages.value.find(m => m._id === msg._id)) {
                    messages.value.push(msg)
                }
            }
            // Update conversation list with latest message
            updateConversationPreview(msg)
        })

        socket.value.on('chat:typing:state', (state) => {
            const activeConvId = activeConversation.value?._id || activeConversation.value
            if (state.userId !== user.value?._id && activeConvId === state.conversationId) {
                isTyping.value = state.isTyping
                typingUser.value = state.isTyping ? state.userId : null
            }
        })
    }

    const updateConversationPreview = (msg: any) => {
        const convId = msg.conversationId?._id || msg.conversationId
        const idx = conversations.value.findIndex((c: any) => c._id === convId)
        if (idx > -1) {
            conversations.value[idx].lastMessage = msg.content
            conversations.value[idx].lastMessageAt = msg.createdAt || new Date().toISOString()
            conversations.value[idx].lastMessageBy = msg.senderId?._id || msg.senderId

            // Move to top of list
            const conv = conversations.value.splice(idx, 1)[0]
            conversations.value.unshift(conv)
        } else {
            // If it's a new message for a conversation not in our list, refresh list
            getConversations()
        }
    }

    const getConversations = async () => {
        loadingConversations.value = true
        try {
            const res = await chatApiFactory.getConversations({ limit: 50 })
            conversations.value = (res as any)?.data || []
        } catch (error) {
            console.error('Failed to fetch conversations:', error)
        } finally {
            loadingConversations.value = false
        }
    }

    const getParticipants = async (query = '') => {
        try {
            const res: any = await $fetch(`${config.public.apiBase}/users`, {
                headers: { Authorization: `Bearer ${accessToken.value}` },
                params: { search: query, limit: 100 }
            })
            // Filter out self and only show Merchants/Partners
            return (res.data || []).filter((u: any) => u._id !== user.value?._id && ['merchant', 'partner'].includes(u.userType))
        } catch (error) {
            console.error('Failed to fetch participants:', error)
            return []
        }
    }

    const getHistory = async (conversationId: string) => {
        // Find existing conversation object if passing just ID
        const conv = conversations.value.find(c => c._id === conversationId)
        activeConversation.value = conv || conversationId

        messages.value = []
        loadingMessages.value = true
        connect()

        const idToJoin = typeof conversationId === 'string' ? conversationId : (conversationId as any)._id
        socket.value?.emit('chat:join', idToJoin)

        try {
            const res = await chatApiFactory.getMessages(idToJoin, { limit: 100 })
            messages.value = (res as any)?.data || []
        } catch (error) {
            console.error('Failed to fetch chat history:', error)
            messages.value = []
        } finally {
            loadingMessages.value = false
        }

        // Mark as read
        try {
            await chatApiFactory.markAsRead(idToJoin)
        } catch { }
    }

    const createConversation = async (participants: string[], type: 'direct' | 'group' = 'direct') => {
        try {
            const res = await chatApiFactory.createConversation({ participants, type })
            const newConv = (res as any)?.data
            if (newConv) {
                const exists = conversations.value.find((c: any) => c._id === newConv._id)
                if (!exists) {
                    conversations.value.unshift(newConv)
                }
                return newConv
            }
        } catch (error) {
            console.error('Failed to create conversation:', error)
        }
    }

    const sendMessage = (content: string) => {
        const activeConvId = activeConversation.value?._id || activeConversation.value
        if (!socket.value || !activeConvId) return
        socket.value.emit('chat:message', {
            conversationId: activeConvId,
            content,
        })
    }

    const sendTyping = (state: boolean) => {
        const activeConvId = activeConversation.value?._id || activeConversation.value
        if (!socket.value || !activeConvId) return
        socket.value.emit('chat:typing', {
            conversationId: activeConvId,
            isTyping: state,
        })
    }

    onUnmounted(() => {
        socket.value?.disconnect()
    })

    return {
        conversations,
        messages,
        isConnected,
        isTyping,
        typingUser,
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
    }
}
