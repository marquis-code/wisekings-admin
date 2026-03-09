import { a as useNuxtApp } from './server.mjs';

function useOrdersApi() {
  const { $api } = useNuxtApp();
  return {
    findAll(params) {
      return $api("/orders", { params });
    },
    findById(id) {
      return $api(`/orders/${id}`);
    },
    getStats() {
      return $api("/orders/stats");
    },
    updateStatus(id, status) {
      return $api(`/orders/${id}/status`, { method: "PATCH", body: { status } });
    }
  };
}

export { useOrdersApi as u };
//# sourceMappingURL=useOrdersApi-CRRcXSQA.mjs.map
