import { GATEWAY_ENDPOINT } from '../axios.config'

export const wallets_api = {
    getWithdrawals: (params?: any) => GATEWAY_ENDPOINT.get("/wallets/withdrawals/admin", { params }),
    approveWithdrawal: (id: string) => GATEWAY_ENDPOINT.patch(`/wallets/withdrawals/${id}/approve`),
    rejectWithdrawal: (id: string, payload: { reason: string }) => GATEWAY_ENDPOINT.patch(`/wallets/withdrawals/${id}/reject`, payload),
    markAsPaid: (id: string, payload: { reference: string }) => GATEWAY_ENDPOINT.patch(`/wallets/withdrawals/${id}/mark-paid`, payload),
}
