import { ref } from "vue"
import { notifications_api } from "@/api_factory/modules/notifications"

export const useMarkNotificationRead = () => {
    const loading = ref(false)

    const markRead = async (id: string) => {
        loading.value = true
        try {
            await notifications_api.markAsRead(id)
            return true
        } catch (err: any) {
            return false
        } finally {
            loading.value = false
        }
    }

    return { loading, markRead }
}
