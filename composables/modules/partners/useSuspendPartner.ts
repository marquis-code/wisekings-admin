import { ref } from "vue"
import { partners_api } from "@/api_factory/modules/partners"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useSuspendPartner = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const suspendPartner = async (id: string, reason: string) => {
        loading.value = true
        try {
            await partners_api.suspend(id, { reason })
            showToast({ title: "Success", message: "Partner suspended", toastType: "success" })
            return true
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to suspend partner", toastType: "error" })
            return false
        } finally {
            loading.value = false
        }
    }

    return { loading, suspendPartner }
}
