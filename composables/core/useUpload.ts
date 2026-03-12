import { ref } from 'vue'
import { upload_api } from '@/api_factory/modules/upload'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useUpload = () => {
    const uploading = ref(false)
    const { showToast } = useCustomToast()

    const uploadImage = async (file: File, folder: string = 'products') => {
        uploading.value = true
        try {
            const res = await upload_api.uploadImage(file, folder) as any
            return res.url || res.data?.url
        } catch (err: any) {
            showToast({
                title: 'Upload Failed',
                message: err.message || 'Failed to upload image',
                toastType: 'error'
            })
            return null
        } finally {
            uploading.value = false
        }
    }

    return {
        uploading,
        uploadImage
    }
}
