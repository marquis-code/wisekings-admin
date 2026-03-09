import { ref } from "vue"
import { products_api } from "@/api_factory/modules/products"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useDeleteProduct = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const deleteProduct = async (id: string) => {
        loading.value = true
        try {
            await products_api.delete(id)
            showToast({ title: "Success", message: "Product deleted successfully", toastType: "success" })
            return true
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to delete product", toastType: "error" })
            return false
        } finally {
            loading.value = false
        }
    }

    return { loading, deleteProduct }
}
