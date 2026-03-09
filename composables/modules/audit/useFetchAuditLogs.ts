import { ref } from "vue"
import { audit_api } from "@/api_factory/modules/audit"
import { useCustomToast } from "@/composables/core/useCustomToast"
import type { AuditLog } from "@/types"

export const useFetchAuditLogs = () => {
    const loading = ref(false)
    const logs = ref<AuditLog[]>([])
    const total = ref(0)
    const { showToast } = useCustomToast()

    const fetchAuditLogs = async (params?: any) => {
        loading.value = true
        try {
            const res = await audit_api.findAll(params) as any
            logs.value = res.data || []
            total.value = res.total || 0
        } catch (err: any) {
            showToast({ title: "Error", message: err.message || "Failed to fetch audit logs", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    return { loading, fetchAuditLogs, logs, total }
}
