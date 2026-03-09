// Toast notification composable

interface Toast {
    id: number
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
}

const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
    function show(type: Toast['type'], title: string, message?: string) {
        const id = nextId++
        toasts.value.push({ id, type, title, message })

        setTimeout(() => {
            remove(id)
        }, 5000)
    }

    function remove(id: number) {
        const index = toasts.value.findIndex((t) => t.id === id)
        if (index > -1) toasts.value.splice(index, 1)
    }

    function success(title: string, message?: string) { show('success', title, message) }
    function error(title: string, message?: string) { show('error', title, message) }
    function warning(title: string, message?: string) { show('warning', title, message) }
    function info(title: string, message?: string) { show('info', title, message) }

    return {
        toasts: readonly(toasts),
        success,
        error,
        warning,
        info,
        remove,
    }
}
