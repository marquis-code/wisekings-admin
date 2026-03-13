import { ref } from 'vue'

export function useUpdateInquiryStatus() {
    const updating = ref(false)
    const config = useRuntimeConfig()

    const updateStatus = async (id: string, status: string) => {
        updating.value = true
        try {
            const { data, error } = await useFetch(`/contact/${id}`, {
                baseURL: config.public.apiBase,
                method: 'PATCH',
                body: { status },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })

            if (error.value) throw error.value
            return true
        } catch (err) {
            console.error('Update inquiry status error:', err)
            return false
        } finally {
            updating.value = false
        }
    }

    return { updating, updateStatus }
}
