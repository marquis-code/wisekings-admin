import { GATEWAY_ENDPOINT } from '../axios.config'

export const merchants_api = {
    get: (params?: any) => GATEWAY_ENDPOINT.get("/merchants", { params }),
    getById: (id: string) => GATEWAY_ENDPOINT.get(`/merchants/${id}`),
    create: (payload: any) => GATEWAY_ENDPOINT.post("/merchants", payload),
    update: (id: string, payload: any) => GATEWAY_ENDPOINT.put(`/merchants/${id}`, payload),
    suspend: (id: string) => GATEWAY_ENDPOINT.patch(`/merchants/${id}/suspend`),
    activate: (id: string) => GATEWAY_ENDPOINT.patch(`/merchants/${id}/activate`),
    getStats: (id: string) => GATEWAY_ENDPOINT.get(`/merchants/${id}/stats`),
}
