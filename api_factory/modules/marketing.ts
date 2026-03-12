import { GATEWAY_ENDPOINT } from '../axios.config'

export const marketing_api = {
    // Banners
    getBanners: (params?: any) => GATEWAY_ENDPOINT.get('/marketing/banners', { params }),
    getBannerById: (id: string) => GATEWAY_ENDPOINT.get(`/marketing/banners/${id}`),
    createBanner: (data: any) => GATEWAY_ENDPOINT.post('/marketing/banners', data),
    updateBanner: (id: string, data: any) => GATEWAY_ENDPOINT.patch(`/marketing/banners/${id}`, data),
    deleteBanner: (id: string) => GATEWAY_ENDPOINT.delete(`/marketing/banners/${id}`),

    // Promotions
    getPromotions: (params?: any) => GATEWAY_ENDPOINT.get('/marketing/promotions', { params }),
    getPromotionById: (id: string) => GATEWAY_ENDPOINT.get(`/marketing/promotions/${id}`),
    createPromotion: (data: any) => GATEWAY_ENDPOINT.post('/marketing/promotions', data),
    updatePromotion: (id: string, data: any) => GATEWAY_ENDPOINT.patch(`/marketing/promotions/${id}`, data),
    deletePromotion: (id: string) => GATEWAY_ENDPOINT.delete(`/marketing/promotions/${id}`),

    // Campaigns
    getCampaigns: () => GATEWAY_ENDPOINT.get('/marketing/campaigns'),
    getCampaignById: (id: string) => GATEWAY_ENDPOINT.get(`/marketing/campaigns/${id}`),
    sendCampaign: (data: any) => GATEWAY_ENDPOINT.post('/marketing/campaigns', data),
    deleteCampaign: (id: string) => GATEWAY_ENDPOINT.delete(`/marketing/campaigns/${id}`),
}
