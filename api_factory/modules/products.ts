import { GATEWAY_ENDPOINT } from '../axios.config'

export const products_api = {
    get: (params?: any) => GATEWAY_ENDPOINT.get("/products/admin/list", { params }),
    getById: (id: string) => GATEWAY_ENDPOINT.get(`/products/${id}`),
    create: (payload: any) => GATEWAY_ENDPOINT.post("/products", payload),
    update: (id: string, payload: any) => GATEWAY_ENDPOINT.put(`/products/${id}`, payload),
    delete: (id: string) => GATEWAY_ENDPOINT.delete(`/products/${id}`),
    getCategories: (params?: any) => GATEWAY_ENDPOINT.get("/products/categories/all", { params }),
    createCategory: (payload: any) => GATEWAY_ENDPOINT.post("/products/categories", payload),
    updateCategory: (id: string, payload: any) => GATEWAY_ENDPOINT.put(`/products/categories/${id}`, payload),
    deleteCategory: (id: string) => GATEWAY_ENDPOINT.delete(`/products/categories/${id}`),
    bulkUpdate: (payload: { ids: string[]; update: any }) => GATEWAY_ENDPOINT.patch("/products/bulk", payload),
}
