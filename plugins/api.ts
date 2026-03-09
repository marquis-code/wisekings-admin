// API Factory Plugin — creates a typed $api helper using $fetch with JWT auth
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const authState = useAuthState()

    const api = $fetch.create({
        baseURL: config.public.apiBase as string,

        onRequest({ options }) {
            const token = authState.accessToken.value
            if (token) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${token}`,
                } as HeadersInit
            }
        },

        async onResponseError({ response }) {
            // If 401, try refresh; if that fails, logout
            if (response.status === 401) {
                const refreshed = await authState.refresh()
                if (!refreshed) {
                    authState.logout()
                    navigateTo('/login')
                }
            }
        },
    })

    return {
        provide: {
            api,
        },
    }
})
