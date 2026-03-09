import { a as useNuxtApp } from './server.mjs';

function useProductsApi() {
  const { $api } = useNuxtApp();
  return {
    findAll(params) {
      return $api("/products/admin/list", { params });
    },
    findById(id) {
      return $api(`/products/${id}`);
    },
    findBySlug(slug) {
      return $api(`/products/slug/${slug}`);
    },
    create(data) {
      return $api("/products", { method: "POST", body: data });
    },
    update(id, data) {
      return $api(`/products/${id}`, { method: "PUT", body: data });
    },
    delete(id) {
      return $api(`/products/${id}`, { method: "DELETE" });
    },
    // Categories
    getCategories() {
      return $api("/products/categories/all");
    },
    createCategory(data) {
      return $api("/products/categories", { method: "POST", body: data });
    },
    updateCategory(id, data) {
      return $api(`/products/categories/${id}`, { method: "PUT", body: data });
    },
    deleteCategory(id) {
      return $api(`/products/categories/${id}`, { method: "DELETE" });
    }
  };
}

export { useProductsApi as u };
//# sourceMappingURL=useProductsApi-Cs-rGqR3.mjs.map
