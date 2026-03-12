import { GATEWAY_ENDPOINT } from '../axios.config'

export const upload_api = {
    uploadImage: (file: File, folder: string) => {
        const formData = new FormData()
        formData.append('file', file)
        return GATEWAY_ENDPOINT.post(`/uploads/image/${folder}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    uploadDocument: (file: File, folder: string) => {
        const formData = new FormData()
        formData.append('file', file)
        return GATEWAY_ENDPOINT.post(`/uploads/document/${folder}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}
