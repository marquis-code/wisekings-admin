import { GATEWAY_ENDPOINT } from '../axios.config'

export const auth_api = {
  register: (payload: any) => {
    const url = "/auth/register"
    return GATEWAY_ENDPOINT.post(url, payload)
  },

  login: (payload: { email: string; password: string }) => {
    const url = "/auth/login"
    return GATEWAY_ENDPOINT.post(url, payload)
  },

  forgotPassword: (payload: { email: string }) => {
    const url = "/auth/forgot-password"
    return GATEWAY_ENDPOINT.post(url, payload)
  },

  resetPassword: (payload: { token: string; newPassword: string }) => {
    const url = "/auth/reset-password"
    return GATEWAY_ENDPOINT.post(url, payload)
  },

  getProfile: () => {
    const url = "/auth/me" // Backend used /me in previous session
    return GATEWAY_ENDPOINT.get(url)
  },

  updateProfile: (payload: any) => {
    const url = "/auth/profile/update"
    return GATEWAY_ENDPOINT.post(url, payload)
  },

  logout: () => {
    const url = "/auth/logout"
    return GATEWAY_ENDPOINT.post(url, {})
  },
}
