import { ref } from "vue"
import { products_api } from "@/api_factory/modules/products"
import { useCustomToast } from "@/composables/core/useCustomToast"
import type { Category } from "@/types"

export const useFetchCategories = () => {
    const loading = ref(false)
    const categories = ref<Category[]>([])
    const { showToast } = useCustomToast()

    const fetchCategories = async (params?: any) => {
        loading.value = true
        try {
            const res = await products_api.getCategories(params) as any
            categories.value = res.data || res || []
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to fetch categories", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    return { loading, fetchCategories, categories }
}
