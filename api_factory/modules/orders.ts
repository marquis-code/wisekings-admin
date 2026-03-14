import { GATEWAY_ENDPOINT } from '../axios.config'

export const orders_api = {
    get: (params?: any) => GATEWAY_ENDPOINT.get("/orders", { params }),
    getById: (id: string) => GATEWAY_ENDPOINT.get(`/orders/${id}`),
    updateStatus: (id: string, payload: any) => GATEWAY_ENDPOINT.patch(`/orders/${id}/status`, payload),
    bulkUpdateStatus: (payload: { ids: string[]; status: string }) => GATEWAY_ENDPOINT.patch("/orders/bulk/status", payload),
    verifyProof: (id: string, status: 'verified' | 'rejected') => GATEWAY_ENDPOINT.patch(`/orders/${id}/verify-proof`, { status }),
    getStats: () => GATEWAY_ENDPOINT.get("/orders/stats"),
}
