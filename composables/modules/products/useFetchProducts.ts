import { ref } from "vue"
import { products_api } from "@/api_factory/modules/products"
import { useCustomToast } from "@/composables/core/useCustomToast"
import type { Product } from "@/types"

export const useFetchProducts = () => {
    const loading = ref(false)
    const products = ref<Product[]>([])
    const total = ref(0)
    const { showToast } = useCustomToast()

    const fetchProducts = async (params?: any) => {
        loading.value = true
        try {
            const res = await products_api.get(params) as any
            products.value = res.data || []
            total.value = res.total || 0
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to fetch products", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    return { loading, fetchProducts, products, total }
}
