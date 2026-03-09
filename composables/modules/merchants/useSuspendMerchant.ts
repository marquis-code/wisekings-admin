import { ref } from "vue"
import { merchants_api } from "@/api_factory/modules/merchants"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useSuspendMerchant = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const suspendMerchant = async (id: string) => {
        loading.value = true
        try {
            await merchants_api.suspend(id)
            showToast({ title: "Success", message: "Merchant suspended successfully", toastType: "success" })
            return true
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to suspend merchant", toastType: "error" })
            return false
        } finally {
            loading.value = false
        }
    }

    return { loading, suspendMerchant }
}
