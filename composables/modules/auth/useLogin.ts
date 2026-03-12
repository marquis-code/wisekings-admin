import { ref } from "vue"
import { auth_api } from "@/api_factory/modules/auth"
import { useCustomToast } from "@/composables/core/useCustomToast"
import { useAuthState } from "@/composables/useAuthState"

export const useLogin = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()
    const router = useRouter()
    const { setAuth } = useAuthState()

    const credentials = ref({
        email: '',
        password: '',
    })

    const errorMessage = ref('')

    const login = async () => {
        loading.value = true
        errorMessage.value = ''
        try {
            const res = await auth_api.login(credentials.value) as any
            const data = res?.data || res

            if (data?.mfaRequired) {
                showToast({
                    title: "OTP Required",
                    message: "Please enter the code sent to your email",
                    toastType: "info",
                })
                router.push(`/otp?email=${credentials.value.email}`)
                return
            }

            if (res.data) {
                const { user, tokens } = res.data
                setAuth(user, tokens)
                showToast({
                    title: "Success",
                    message: res.message || "Login successful",
                    toastType: "success",
                })
                router.push('/')
            }
        } catch (err: any) {
            errorMessage.value = err.message || "Invalid credentials"
            showToast({
                title: "Error",
                message: errorMessage.value,
                toastType: "error",
            })
        } finally {
            loading.value = false
        }
    }


    return { loading, login, credentials, errorMessage }
}
