import { production_api } from "@/api_factory/modules/production";
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useFetchMaterials = () => {
  const materials = ref<any[]>([]);
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const fetchMaterials = async () => {
    loading.value = true;
    try {
      const res = await production_api.getMaterials();
      materials.value = res.data?.data || res.data || [];
    } catch (err: any) {
      showToast({
        title: "Error",
        message: err.message || "Failed to fetch materials",
        toastType: "error",
      });
    } finally {
      loading.value = false;
    }
  };

  return { materials, loading, fetchMaterials };
};
