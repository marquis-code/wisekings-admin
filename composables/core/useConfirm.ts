import { render, h, type AppContext } from 'vue'
import ConfirmModal from '@/components/core/ConfirmModal.vue'

interface ConfirmOptions {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    confirmClass?: string
    icon?: string
}

let confirmInstance: any = null

export const useConfirm = () => {
    const nuxtApp = useNuxtApp()

    const openConfirm = (options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            // Create container
            const container = document.createElement('div')
            document.body.appendChild(container)

            const vnode = h(ConfirmModal, {
                ...options,
                resolve: (result: boolean) => {
                    resolve(result)
                    // Delayed unmount to allow for exit animation
                    setTimeout(() => {
                        render(null, container)
                        document.body.removeChild(container)
                    }, 500)
                }
            })

            vnode.appContext = nuxtApp.vueApp._context as AppContext
            render(vnode, container)
        })
    }

    const confirmLogout = () => {
        return openConfirm({
            title: 'Sign Out',
            message: 'Are you sure you want to sign out of your account?',
            confirmText: 'Sign Out',
            confirmClass: 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20',
            icon: 'lucide:log-out'
        })
    }

    const confirmDelete = (title = 'Delete Item', message = 'This action cannot be undone. Are you sure?') => {
        return openConfirm({
            title,
            message,
            confirmText: 'Delete',
            confirmClass: 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/20',
            icon: 'lucide:trash-2'
        })
    }

    return { openConfirm, confirmLogout, confirmDelete }
}
