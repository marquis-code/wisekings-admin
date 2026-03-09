import { ref } from "vue"
import { commissions_api } from "@/api_factory/modules/commissions"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useAdjustCommission = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const adjustCommission = async (id: string, amount: number, reason: string) => {
        loading.value = true
        try {
            await commissions_api.adjust(id, { amount, reason })
            showToast({ title: "Success", message: "Commission adjusted", toastType: "success" })
            return true
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to adjust commission", toastType: "error" })
            return false
        } finally {
            loading.value = false
        }
    }

    return { loading, adjustCommission }
}
