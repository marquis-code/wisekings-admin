import { ref } from "vue"
import { users_api } from "@/api_factory/modules/users"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useDeactivateUser = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const deactivateUser = async (id: string) => {
        loading.value = true
        try {
            await users_api.deactivate(id)
            showToast({ title: "Success", message: "User deactivated", toastType: "success" })
            return true
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to deactivate user", toastType: "error" })
            return false
        } finally {
            loading.value = false
        }
    }

    return { loading, deactivateUser }
}
