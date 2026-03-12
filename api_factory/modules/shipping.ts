import { GATEWAY_ENDPOINT } from '../axios.config'

export const shipping_api = {
  getShippingConfig: () => {
    return GATEWAY_ENDPOINT.get('/shipping/config')
  },
  updateShippingConfig: (dto: any) => {
    return GATEWAY_ENDPOINT.post('/shipping/config', dto)
  }
}
