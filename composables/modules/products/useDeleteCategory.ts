import { ref } from "vue"
import { products_api } from "@/api_factory/modules/products"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useDeleteCategory = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const deleteCategory = async (id: string) => {
        loading.value = true
        try {
            await products_api.deleteCategory(id)
            showToast({ title: "Success", message: "Category deleted", toastType: "success" })
            return true
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to delete category", toastType: "error" })
            return false
        } finally {
            loading.value = false
        }
    }

    return { loading, deleteCategory }
}
