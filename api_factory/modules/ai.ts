import { GATEWAY_ENDPOINT } from '../axios.config'

export const ai_api = {
    askAssistant: (question: string) => GATEWAY_ENDPOINT.post('/ai/assistant', { question }),
    getForecast: () => GATEWAY_ENDPOINT.get('/ai/forecast'),
    getChurnAnalysis: () => GATEWAY_ENDPOINT.get('/ai/churn-analysis'),
    getProductivity: () => GATEWAY_ENDPOINT.get('/ai/productivity'),
}
