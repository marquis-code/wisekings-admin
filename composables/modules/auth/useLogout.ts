import { ref } from "vue"
import { auth_api } from "@/api_factory/modules/auth"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useLogout = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()
    const router = useRouter()
    const { logout: clearAuthState } = useAuthState()

    const logout = async () => {
        loading.value = true
        try {
            await auth_api.logout()
            clearAuthState()
            showToast({
                title: "Success",
                message: "Logged out successfully",
                toastType: "success",
            })
            router.push('/login')
        } catch (err: any) {
            // Even if API fails, clear local state and redirect
            clearAuthState()
            router.push('/login')
        } finally {
            loading.value = false
        }
    }

    return { loading, logout }
}
