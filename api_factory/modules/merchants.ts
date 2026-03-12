import { GATEWAY_ENDPOINT } from '../axios.config'

export const merchants_api = {
    get: (params?: any) => GATEWAY_ENDPOINT.get("/merchants", { params }),
    getById: (id: string) => GATEWAY_ENDPOINT.get(`/merchants/${id}`),
    create: (payload: any) => GATEWAY_ENDPOINT.post("/merchants", payload),
    update: (id: string, payload: any) => GATEWAY_ENDPOINT.put(`/merchants/${id}`, payload),
    suspend: (id: string, payload: { reason: string }) => GATEWAY_ENDPOINT.patch(`/merchants/${id}/suspend`, payload),
    activate: (id: string) => GATEWAY_ENDPOINT.patch(`/merchants/${id}/activate`),
    getStats: () => GATEWAY_ENDPOINT.get("/merchants/stats"),
    updateKycDocumentStatus: (id: string, payload: { documentType: string; status: string; reason?: string }) => GATEWAY_ENDPOINT.patch(`/merchants/${id}/kyc-document-status`, payload),
}
