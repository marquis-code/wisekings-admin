import { GATEWAY_ENDPOINT } from '../axios.config'

export const notifications_api = {
    findAll: (params?: any) => GATEWAY_ENDPOINT.get("/notifications", { params }),
    markAsRead: (id: string) => GATEWAY_ENDPOINT.patch(`/notifications/${id}/read`),
}
