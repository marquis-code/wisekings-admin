import { ref } from "vue"
import { roles_api } from "@/api_factory/modules/roles"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useDeleteRole = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const deleteRole = async (id: string) => {
        loading.value = true
        try {
            await roles_api.delete(id)
            showToast({ title: "Success", message: "Role deleted", toastType: "success" })
            return true
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to delete role", toastType: "error" })
            return false
        } finally {
            loading.value = false
        }
    }

    return { loading, deleteRole }
}
