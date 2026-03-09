import { ref } from "vue"
import { wallets_api } from "@/api_factory/modules/wallets"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useMarkPaidWithdrawal = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const markAsPaid = async (id: string, reference: string) => {
        loading.value = true
        try {
            await wallets_api.markAsPaid(id, { reference })
            showToast({ title: "Success", message: "Withdrawal marked as paid", toastType: "success" })
            return true
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to mark as paid", toastType: "error" })
            return false
        } finally {
            loading.value = false
        }
    }

    return { loading, markAsPaid }
}
