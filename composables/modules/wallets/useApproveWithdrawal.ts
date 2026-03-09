import { ref } from "vue"
import { wallets_api } from "@/api_factory/modules/wallets"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useApproveWithdrawal = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const approveWithdrawal = async (id: string) => {
        loading.value = true
        try {
            await wallets_api.approveWithdrawal(id)
            showToast({ title: "Success", message: "Withdrawal approved", toastType: "success" })
            return true
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to approve withdrawal", toastType: "error" })
            return false
        } finally {
            loading.value = false
        }
    }

    return { loading, approveWithdrawal }
}
