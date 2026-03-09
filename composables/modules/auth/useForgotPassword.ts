import { ref } from "vue"
import { auth_api } from "@/api_factory/modules/auth"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useForgotPassword = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()
    const email = ref('')

    const forgotPassword = async () => {
        loading.value = true
        try {
            await auth_api.forgotPassword({ email: email.value })
            showToast({
                title: "Success",
                message: "Password reset link sent to your email",
                toastType: "success",
            })
        } catch (err: any) {
            showToast({
                title: "Error",
                message: err.message || "Failed to send reset link",
                toastType: "error",
            })
        } finally {
            loading.value = false
        }
    }

    return { loading, forgotPassword, email }
}
