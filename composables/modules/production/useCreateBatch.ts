import { production_api } from "@/api_factory/modules/production";
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useCreateBatch = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const createBatch = async (payload: any) => {
    loading.value = true;
    try {
      const res = await production_api.createBatch(payload);
      showToast({
        title: "Success",
        message: "Production batch recorded successfully",
        toastType: "success",
      });
      return res.data || res;
    } catch (err: any) {
      showToast({
        title: "Error",
        message: err.message || "Failed to record batch",
        toastType: "error",
      });
      return null;
    } finally {
      loading.value = false;
    }
  };

  return { createBatch, loading };
};
