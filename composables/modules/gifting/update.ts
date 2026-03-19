import { ref } from 'vue'
import { gifting_api } from '@/api_factory/modules/gifting'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useUpdateGifting = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const updateGifting = async (id: string, payload: any) => {
    loading.value = true
    try {
      const response = await gifting_api.$_update_gifting(id, payload)
      showToast({
        title: 'Success',
        message: 'Gifting request updated successfully',
        toastType: 'success'
      })
      return response
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error?.response?.data?.message || 'Failed to update request',
        toastType: 'error'
      })
      return null
    } finally {
      loading.value = false
    }
  }

  return { updateGifting, loading }
}
