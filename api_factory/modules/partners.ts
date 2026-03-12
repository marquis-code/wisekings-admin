import { GATEWAY_ENDPOINT } from '../axios.config'

export const partners_api = {
    get: (params?: any) => GATEWAY_ENDPOINT.get("/partners", { params }),
    getById: (id: string) => GATEWAY_ENDPOINT.get(`/partners/${id}`),
    update: (id: string, payload: any) => GATEWAY_ENDPOINT.put(`/partners/${id}`, payload),
    approve: (id: string) => GATEWAY_ENDPOINT.patch(`/partners/${id}/approve`),
    suspend: (id: string, payload?: any) => GATEWAY_ENDPOINT.patch(`/partners/${id}/suspend`, payload),
    updateKycDocumentStatus: (id: string, payload: { documentType: string; status: string; reason?: string }) => GATEWAY_ENDPOINT.patch(`/partners/${id}/kyc-document-status`, payload),
}
