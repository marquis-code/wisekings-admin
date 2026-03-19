import { GATEWAY_ENDPOINT } from '../axios.config'

export const gifting_api = {
  $_get_giftings: (queryParams?: string) => {
    return GATEWAY_ENDPOINT.get(`/gifting${queryParams ? `?${queryParams}` : ''}`)
  },
  $_get_gifting_by_id: (id: string) => {
    return GATEWAY_ENDPOINT.get(`/gifting/${id}`)
  },
  $_update_gifting: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT.patch(`/gifting/${id}`, payload)
  }
}
