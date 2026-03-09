import { GATEWAY_ENDPOINT } from '../axios.config'

export const audit_api = {
    findAll: (params?: any) => GATEWAY_ENDPOINT.get("/audit", { params }),
}
