import { ref } from 'vue'

export function useFetchInquiries() {
    const inquiries = ref<any[]>([])
    const loading = ref(false)
    const total = ref(0)
    const config = useRuntimeConfig()

    const fetchInquiries = async (params: any = {}) => {
        loading.value = true
        try {
            const { data, error } = await useFetch('/contact', {
                baseURL: config.public.apiBase,
                params,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })

            if (error.value) throw error.value
            
            // Handle both raw array and structured response
            const res = data.value?.data || data.value
            inquiries.value = Array.isArray(res) ? res : res?.items || []
            total.value = res?.total || inquiries.value.length
        } catch (err) {
            console.error('Fetch inquiries error:', err)
        } finally {
            loading.value = false
        }
    }

    return { inquiries, loading, total, fetchInquiries }
}
