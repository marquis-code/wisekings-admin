import { GATEWAY_ENDPOINT } from '../axios.config'

export const users_api = {
    findAll: (params?: any) => GATEWAY_ENDPOINT.get("/users", { params }),
    activate: (id: string) => GATEWAY_ENDPOINT.patch(`/users/${id}/activate`),
    deactivate: (id: string) => GATEWAY_ENDPOINT.patch(`/users/${id}/deactivate`),
}
