import { a as useNuxtApp } from "../server.mjs";
function useMerchantsApi() {
  const { $api } = useNuxtApp();
  return {
    findAll(params) {
      return $api("/merchants", { params });
    },
    findById(id) {
      return $api(`/merchants/${id}`);
    },
    findByCode(code) {
      return $api(`/merchants/code/${code}`);
    },
    getStats() {
      return $api("/merchants/stats");
    },
    update(id, data) {
      return $api(`/merchants/${id}`, { method: "PUT", body: data });
    },
    suspend(id, reason) {
      return $api(`/merchants/${id}/suspend`, { method: "PATCH", body: { reason } });
    },
    activate(id) {
      return $api(`/merchants/${id}/activate`, { method: "PATCH" });
    }
  };
}
export {
  useMerchantsApi as u
};
//# sourceMappingURL=useMerchantsApi-C7mC4_63.js.map
