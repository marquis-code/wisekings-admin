import { ref } from "vue"
import { roles_api } from "@/api_factory/modules/roles"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useSaveRole = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const saveRole = async (payload: any, id?: string) => {
        loading.value = true
        try {
            if (id) {
                await roles_api.update(id, payload)
                showToast({ title: "Success", message: "Role updated", toastType: "success" })
            } else {
                await roles_api.create(payload)
                showToast({ title: "Success", message: "Role created", toastType: "success" })
            }
            return true
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to save role", toastType: "error" })
            return false
        } finally {
            loading.value = false
        }
    }

    return { loading, saveRole }
}
