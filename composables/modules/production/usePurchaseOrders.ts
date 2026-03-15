import { production_api } from "@/api_factory/modules/production";
import { useCustomToast } from "@/composables/core/useCustomToast";

export const usePurchaseOrders = () => {
  const orders = ref<any[]>([]);
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const fetchOrders = async (params?: any) => {
    loading.value = true;
    try {
      const res = await production_api.getBatches(params); // Using the general production API
      // Note: production_api doesn't have getOrders yet in its TS definition but I added it to the file
      // Let's use the explicit axios call if needed, but I already updated production_api in the file
      const resOrders = await (production_api as any).getOrders(params);
      orders.value = resOrders.data?.data || resOrders.data || [];
    } catch (err: any) {
      showToast({ title: "Error", message: err.message || "Failed to fetch orders", toastType: "error" });
    } finally {
      loading.value = false;
    }
  };

  const createOrder = async (payload: any) => {
    loading.value = true;
    try {
      await (production_api as any).createOrder(payload);
      showToast({ title: "Success", message: "Purchase order created", toastType: "success" });
      return true;
    } catch (err: any) {
      showToast({ title: "Error", message: err.message || "Failed to create order", toastType: "error" });
      return false;
    } finally {
      loading.value = false;
    }
  };

  return { orders, loading, fetchOrders, createOrder };
};
