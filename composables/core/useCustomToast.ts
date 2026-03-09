import { ref } from "vue";

interface ToastOptions {
  title: string;
  message?: string;
  toastType?: "success" | "error" | "warning" | "info";
  duration?: number;
}

const toasts = ref<any[]>([]);
let nextId = 0;

export const useCustomToast = () => {
  const showToast = (options: ToastOptions) => {
    const id = nextId++;
    const toast = {
      id,
      title: options.title,
      message: options.message,
      type: options.toastType || "info",
    };
    toasts.value.push(toast);

    setTimeout(() => {
      removeToast(id);
    }, options.duration || 3000);
  };

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  return { toasts, showToast, removeToast };
};