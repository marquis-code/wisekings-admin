import { ref } from "vue"
import { merchants_api } from "@/api_factory/modules/merchants"
import { useCustomToast } from "@/composables/core/useCustomToast"
import type { Merchant } from "@/types"

export const useFetchMerchants = () => {
    const loading = ref(false)
    const merchants = ref<Merchant[]>([])
    const total = ref(0)
    const { showToast } = useCustomToast()

    const fetchMerchants = async (params?: any) => {
        loading.value = true
        try {
            const res = await merchants_api.get(params) as any
            merchants.value = res.data || []
            total.value = res.total || 0
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to fetch merchants", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    return { loading, fetchMerchants, merchants, total }
}
