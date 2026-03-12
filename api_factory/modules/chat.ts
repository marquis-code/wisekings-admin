import { GATEWAY_ENDPOINT } from '../axios.config'

export const chatApiFactory = {
    getConversations(params?: { limit?: number; skip?: number }) {
        return GATEWAY_ENDPOINT.get('/chat/conversations', { params })
    },

    createConversation(body: { participants: string[]; type?: 'direct' | 'group' }) {
        return GATEWAY_ENDPOINT.post('/chat/conversations', body)
    },

    getMessages(conversationId: string, params?: { limit?: number; skip?: number }) {
        return GATEWAY_ENDPOINT.get(`/chat/conversations/${conversationId}/messages`, { params })
    },

    markAsRead(conversationId: string) {
        return GATEWAY_ENDPOINT.patch(`/chat/conversations/${conversationId}/read`)
    },
}
