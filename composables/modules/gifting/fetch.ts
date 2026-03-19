import { ref } from 'vue'
import { gifting_api } from '@/api_factory/modules/gifting'

export const useGetGiftings = () => {
  const loading = ref(false)
  const requests = ref<any[]>([])

  const fetchGiftings = async () => {
    loading.value = true
    try {
      const response = await gifting_api.$_get_giftings()
      requests.value = response?.data?.data || response?.data || []
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  return { fetchGiftings, loading, requests }
}

export const useGetGiftingById = () => {
  const loading = ref(false)
  const request = ref<any>(null)

  const fetchGiftingById = async (id: string) => {
    loading.value = true
    try {
      const response = await gifting_api.$_get_gifting_by_id(id)
      request.value = response?.data?.data || response?.data || null
      return request.value
    } catch (error) {
      console.error(error)
      return null
    } finally {
      loading.value = false
    }
  }

  return { fetchGiftingById, loading, request }
}
