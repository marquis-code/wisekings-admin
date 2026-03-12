import { GATEWAY_ENDPOINT } from '../axios.config'

export const settings_api = {
  getKycDocuments: () => {
    return GATEWAY_ENDPOINT.get('/settings/kyc-documents')
  },
  updateKycDocuments: (documentTypes: { value: string; label: string }[]) => {
    return GATEWAY_ENDPOINT.patch('/settings/kyc-documents', { documentTypes })
  },
  getSettings: () => {
    return GATEWAY_ENDPOINT.get('/settings')
  },
  updateSettings: (dto: any) => {
    return GATEWAY_ENDPOINT.patch('/settings', dto)
  }
}
