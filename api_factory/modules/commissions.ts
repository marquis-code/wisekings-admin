import { GATEWAY_ENDPOINT } from '../axios.config'

export const commissions_api = {
    findAll: (params?: any) => GATEWAY_ENDPOINT.get("/commissions", { params }),
    adjust: (id: string, payload: { amount: number; reason: string }) => GATEWAY_ENDPOINT.patch(`/commissions/${id}/adjust`, payload),
}
