import { a as useNuxtApp } from "../server.mjs";
function usePartnersApi() {
  const { $api } = useNuxtApp();
  return {
    findAll(params) {
      return $api("/partners", { params });
    },
    findById(id) {
      return $api(`/partners/${id}`);
    },
    update(id, data) {
      return $api(`/partners/${id}`, { method: "PUT", body: data });
    },
    approve(id) {
      return $api(`/partners/${id}/approve`, { method: "PATCH" });
    },
    suspend(id, reason) {
      return $api(`/partners/${id}/suspend`, { method: "PATCH", body: { reason } });
    }
  };
}
export {
  usePartnersApi as u
};
//# sourceMappingURL=usePartnersApi-LSGssh6C.js.map
