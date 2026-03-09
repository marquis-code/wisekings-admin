import { ref } from "vue"
import { users_api } from "@/api_factory/modules/users"
import { useCustomToast } from "@/composables/core/useCustomToast"
import type { User } from "@/types"

export const useFetchUsers = () => {
    const loading = ref(false)
    const users = ref<User[]>([])
    const total = ref(0)
    const { showToast } = useCustomToast()

    const fetchUsers = async (params?: any) => {
        loading.value = true
        try {
            const res = await users_api.findAll(params) as any
            users.value = res.data || []
            total.value = res.total || 0
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to fetch users", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    return { loading, fetchUsers, users, total }
}
