import { GATEWAY_ENDPOINT } from "../axios.config";

export const investments_api = {
  // Investment Products (PiggyVest style)
  getProducts(params?: any) {
    return GATEWAY_ENDPOINT.get("/investments/products", { params });
  },
  getProduct(id: string) {
    return GATEWAY_ENDPOINT.get(`/investments/products/${id}`);
  },
  createProduct(data: any) {
    return GATEWAY_ENDPOINT.post("/investments/products", data);
  },
  updateProduct(id: string, data: any) {
    return GATEWAY_ENDPOINT.put(`/investments/products/${id}`, data);
  },

  // Proposals & Legacy Investments
  getProposals(params?: any) {
    return GATEWAY_ENDPOINT.get("/investments/proposals", { params });
  },
  getProposal(id: string) {
    return GATEWAY_ENDPOINT.get(`/investments/proposals/${id}`);
  },
  createProposal(data: any) {
    return GATEWAY_ENDPOINT.post("/investments/proposals", data);
  },
  getAllInvestments(params?: any) {
    return GATEWAY_ENDPOINT.get("/investments/all", { params });
  },
  updateStatus(id: string, data: any) {
    return GATEWAY_ENDPOINT.put(`/investments/${id}/status`, data);
  }
};
