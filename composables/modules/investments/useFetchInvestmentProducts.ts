import { investments_api } from "@/api_factory/modules/investments";
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useFetchInvestmentProducts = () => {
  const products = ref<any[]>([]);
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const fetchProducts = async (params?: any) => {
    loading.value = true;
    try {
      const res = await investments_api.getProducts(params);
      products.value = res.data?.data || res.data || [];
    } catch (err: any) {
      showToast({
        title: "Error",
        message: err.message || "Failed to fetch products",
        toastType: "error",
      });
    } finally {
      loading.value = false;
    }
  };

  return { products, loading, fetchProducts };
};
