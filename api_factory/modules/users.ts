import { GATEWAY_ENDPOINT } from '../axios.config'

export const users_api = {
    findAll: (params?: any) => GATEWAY_ENDPOINT.get("/users", { params }),
    activate: (id: string) => GATEWAY_ENDPOINT.patch(`/users/${id}/toggle-active`),
    deactivate: (id: string) => GATEWAY_ENDPOINT.patch(`/users/${id}/toggle-active`),
    invite: (payload: any) => GATEWAY_ENDPOINT.post("/users/invite", payload),
}
