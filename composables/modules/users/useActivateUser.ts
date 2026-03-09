import { ref } from "vue"
import { users_api } from "@/api_factory/modules/users"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useActivateUser = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const activateUser = async (id: string) => {
        loading.value = true
        try {
            await users_api.activate(id)
            showToast({ title: "Success", message: "User activated", toastType: "success" })
            return true
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to activate user", toastType: "error" })
            return false
        } finally {
            loading.value = false
        }
    }

    return { loading, activateUser }
}
