import { ref } from "vue"
import { notifications_api } from "@/api_factory/modules/notifications"
import { useCustomToast } from "@/composables/core/useCustomToast"
import type { Notification } from "@/types"

export const useFetchNotifications = () => {
    const loading = ref(false)
    const notifications = ref<Notification[]>([])
    const { showToast } = useCustomToast()

    const fetchNotifications = async (params?: any) => {
        loading.value = true
        try {
            const res = await notifications_api.findAll(params) as any
            notifications.value = res.data || []
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to fetch notifications", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    return { loading, fetchNotifications, notifications }
}
