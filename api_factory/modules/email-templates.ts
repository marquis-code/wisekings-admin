import { GATEWAY_ENDPOINT } from '../axios.config'

export const email_templates_api = {
    findAll: () => GATEWAY_ENDPOINT.get("/email-templates"),
    findById: (id: string) => GATEWAY_ENDPOINT.get(`/email-templates/${id}`),
    create: (payload: any) => GATEWAY_ENDPOINT.post("/email-templates", payload),
    update: (id: string, payload: any) => GATEWAY_ENDPOINT.patch(`/email-templates/${id}`, payload),
    delete: (id: string) => GATEWAY_ENDPOINT.delete(`/email-templates/${id}`),
}
