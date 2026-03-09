import { ref } from "vue"
import { commissions_api } from "@/api_factory/modules/commissions"
import { useCustomToast } from "@/composables/core/useCustomToast"
import type { Commission } from "@/types"

export const useFetchCommissions = () => {
    const loading = ref(false)
    const commissions = ref<Commission[]>([])
    const total = ref(0)
    const { showToast } = useCustomToast()

    const fetchCommissions = async (params?: any) => {
        loading.value = true
        try {
            const res = await commissions_api.findAll(params) as any
            commissions.value = res.data || []
            total.value = res.total || 0
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to fetch commissions", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    return { loading, fetchCommissions, commissions, total }
}
