import { GATEWAY_ENDPOINT } from '../axios.config'

export const roles_api = {
    findAll: () => GATEWAY_ENDPOINT.get("/roles"),
    getPermissions: () => GATEWAY_ENDPOINT.get("/roles/permissions"),
    create: (payload: any) => GATEWAY_ENDPOINT.post("/roles", payload),
    update: (id: string, payload: any) => GATEWAY_ENDPOINT.put(`/roles/${id}`, payload),
    delete: (id: string) => GATEWAY_ENDPOINT.delete(`/roles/${id}`),
}
