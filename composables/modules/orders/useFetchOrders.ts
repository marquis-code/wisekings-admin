import { ref } from "vue"
import { orders_api } from "@/api_factory/modules/orders"
import { useCustomToast } from "@/composables/core/useCustomToast"
import type { Order } from "@/types"

export const useFetchOrders = () => {
    const loading = ref(false)
    const orders = ref<Order[]>([])
    const total = ref(0)
    const { showToast } = useCustomToast()

    const fetchOrders = async (params?: any) => {
        loading.value = true
        try {
            const res = await orders_api.get(params) as any
            orders.value = res.data || []
            total.value = res.total || 0
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to fetch orders", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    return { loading, fetchOrders, orders, total }
}
