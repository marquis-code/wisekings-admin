import { ref } from "vue"
import { products_api } from "@/api_factory/modules/products"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useSaveCategory = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()

    const saveCategory = async (payload: any, id?: string) => {
        loading.value = true
        try {
            if (id) {
                await products_api.updateCategory(id, payload)
                showToast({ title: "Success", message: "Category updated", toastType: "success" })
            } else {
                await products_api.createCategory(payload)
                showToast({ title: "Success", message: "Category created", toastType: "success" })
            }
            return true
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to save category", toastType: "error" })
            return false
        } finally {
            loading.value = false
        }
    }

    return { loading, saveCategory }
}
