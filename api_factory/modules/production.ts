import { GATEWAY_ENDPOINT } from "../axios.config";

export const production_api = {
  // Raw Materials
  getMaterials() {
    return GATEWAY_ENDPOINT.get("/production/materials");
  },
  createMaterial(data: any) {
    return GATEWAY_ENDPOINT.post("/production/materials", data);
  },
  updateMaterial(id: string, data: any) {
    return GATEWAY_ENDPOINT.patch(`/production/materials/${id}`, data);
  },

  // Batches
  getBatches(params?: any) {
    return GATEWAY_ENDPOINT.get("/production/batches", { params });
  },
  getBatch(id: string) {
    return GATEWAY_ENDPOINT.get(`/production/batches/${id}`);
  },
  createBatch(data: any) {
    return GATEWAY_ENDPOINT.post("/production/batches", data);
  },

  // Purchase Orders
  getOrders(params?: any) {
    return GATEWAY_ENDPOINT.get("/production/orders", { params });
  },
  createOrder(data: any) {
    return GATEWAY_ENDPOINT.post("/production/orders", data);
  },
  updateOrderStatus(id: string, status: string) {
    return GATEWAY_ENDPOINT.patch(`/production/orders/${id}/status`, { status });
  }
};
