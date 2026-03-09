import { ref } from "vue"
import { partners_api } from "@/api_factory/modules/partners"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useApprovePartner = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const approvePartner = async (id: string) => {
        loading.value = true
        try {
            await partners_api.approve(id)
            showToast({ title: "Success", message: "Partner approved", toastType: "success" })
            return true
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to approve partner", toastType: "error" })
            return false
        } finally {
            loading.value = false
        }
    }

    return { loading, approvePartner }
}
