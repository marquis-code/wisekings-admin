import { ref } from "vue"
import { partners_api } from "@/api_factory/modules/partners"
import { useCustomToast } from "@/composables/core/useCustomToast"
import type { Partner } from "@/types"

export const useFetchPartners = () => {
    const loading = ref(false)
    const partners = ref<Partner[]>([])
    const total = ref(0)
    const { showToast } = useCustomToast()

    const fetchPartners = async (params?: any) => {
        loading.value = true
        try {
            const res = await partners_api.get(params) as any
            partners.value = res.data || []
            total.value = res.total || 0
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to fetch partners", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    return { loading, fetchPartners, partners, total }
}
