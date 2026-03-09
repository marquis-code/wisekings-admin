import { ref } from "vue"
import { roles_api } from "@/api_factory/modules/roles"
import { useCustomToast } from "@/composables/core/useCustomToast"
import type { Role } from "@/types"

export const useFetchRoles = () => {
    const loading = ref(false)
    const roles = ref<Role[]>([])
    const { showToast } = useCustomToast()

    const fetchRoles = async () => {
        loading.value = true
        try {
            const res = await roles_api.findAll() as any
            roles.value = res.data || res || []
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to fetch roles", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    return { loading, fetchRoles, roles }
}
