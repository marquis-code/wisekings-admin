import { ref } from "vue"
import { auth_api } from "@/api_factory/modules/auth"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useResetPassword = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()
    const router = useRouter()

    const form = ref({
        token: '',
        newPassword: '',
    })

    const resetPassword = async () => {
        loading.value = true
        try {
            await auth_api.resetPassword(form.value)
            showToast({
                title: "Success",
                message: "Password reset successful. Please login.",
                toastType: "success",
            })
            router.push('/login')
        } catch (err: any) {
            showToast({
                title: "Error",
                message: err.message || "Failed to reset password",
                toastType: "error",
            })
        } finally {
            loading.value = false
        }
    }

    return { loading, resetPassword, form }
}
