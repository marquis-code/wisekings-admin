import { production_api } from "@/api_factory/modules/production";
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useFetchBatches = () => {
  const batches = ref<any[]>([]);
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const fetchBatches = async (params?: any) => {
    loading.value = true;
    try {
      const res = await production_api.getBatches(params);
      batches.value = res.data?.data || res.data || [];
    } catch (err: any) {
      showToast({
        title: "Error",
        message: err.message || "Failed to fetch batches",
        toastType: "error",
      });
    } finally {
      loading.value = false;
    }
  };

  return { batches, loading, fetchBatches };
};
