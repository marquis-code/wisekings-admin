import { GATEWAY_ENDPOINT } from '../axios.config'

export const support_api = {
    getTickets: (params?: any) => GATEWAY_ENDPOINT.get('/support/tickets', { params }),
    getMyTickets: () => GATEWAY_ENDPOINT.get('/support/tickets/me'),
    getTicket: (id: string) => GATEWAY_ENDPOINT.get(`/support/tickets/${id}`),
    updateStatus: (id: string, status: string) => GATEWAY_ENDPOINT.patch(`/support/tickets/${id}/status`, { status }),
    addComment: (id: string, message: string) => GATEWAY_ENDPOINT.post(`/support/tickets/${id}/comments`, { message }),
}
