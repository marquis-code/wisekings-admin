import { ref } from "vue"
import { users_api } from "@/api_factory/modules/users"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useInviteUser = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const inviteUser = async (payload: { fullName: string; email: string; role: string }) => {
        loading.value = true
        try {
            await users_api.invite(payload)
            showToast({ title: "Success", message: "Invitation sent successfully", toastType: "success" })
            return true
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to send invitation", toastType: "error" })
            return false
        } finally {
            loading.value = false
        }
    }

    return { loading, inviteUser }
}
