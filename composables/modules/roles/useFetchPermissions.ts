import { ref } from "vue"
import { roles_api } from "@/api_factory/modules/roles"

export const useFetchPermissions = () => {
    const loading = ref(false)
    const permissions = ref<string[]>([])

    const fetchPermissions = async () => {
        loading.value = true
        try {
            const res = await roles_api.getPermissions() as any
            permissions.value = res.data || res || []
        } catch (err: any) {
            // Silently fail or log
        } finally {
            loading.value = false
        }
    }

    return { loading, fetchPermissions, permissions }
}
