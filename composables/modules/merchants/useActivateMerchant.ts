import { ref } from "vue"
import { merchants_api } from "@/api_factory/modules/merchants"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useActivateMerchant = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const activateMerchant = async (id: string) => {
        loading.value = true
        try {
            await merchants_api.activate(id)
            showToast({ title: "Success", message: "Merchant activated successfully", toastType: "success" })
            return true
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to activate merchant", toastType: "error" })
            return false
        } finally {
            loading.value = false
        }
    }

    return { loading, activateMerchant }
}
