import { ref } from "vue"
import { wallets_api } from "@/api_factory/modules/wallets"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useRejectWithdrawal = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const rejectWithdrawal = async (id: string, reason: string) => {
        loading.value = true
        try {
            await wallets_api.rejectWithdrawal(id, { reason })
            showToast({ title: "Success", message: "Withdrawal rejected", toastType: "success" })
            return true
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to reject withdrawal", toastType: "error" })
            return false
        } finally {
            loading.value = false
        }
    }

    return { loading, rejectWithdrawal }
}
