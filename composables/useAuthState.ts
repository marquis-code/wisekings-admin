import type { User, AuthTokens } from '~/types'

// ── Reactive auth state (singleton via composable) ──

const accessToken = ref<string>('')
const refreshTokenValue = ref<string>('')
const user = ref<User | null>(null)
const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

export function useAuthState() {
    // Hydrate from cookie on first call (SSR-safe)
    if (import.meta.client && !accessToken.value) {
        const tokenCookie = useCookie<string>('wk_admin_access_token')
        const refreshCookie = useCookie<string>('wk_admin_refresh_token')
        const userCookie = useCookie<User | null>('wk_admin_user')

        if (tokenCookie.value) accessToken.value = tokenCookie.value
        if (refreshCookie.value) refreshTokenValue.value = refreshCookie.value
        if (userCookie.value) user.value = userCookie.value
    }

    function setAuth(userData: User, tokens: AuthTokens) {
        accessToken.value = tokens.accessToken
        refreshTokenValue.value = tokens.refreshToken
        user.value = userData

        const tokenCookie = useCookie('wk_admin_access_token', { maxAge: 60 * 60 }) // 1h
        const refreshCookie = useCookie('wk_admin_refresh_token', { maxAge: 60 * 60 * 24 * 7 }) // 7d
        const userCookie = useCookie('wk_admin_user', { maxAge: 60 * 60 * 24 * 7 })

        tokenCookie.value = tokens.accessToken
        refreshCookie.value = tokens.refreshToken
        userCookie.value = JSON.stringify(userData) as any
    }

    function logout() {
        accessToken.value = ''
        refreshTokenValue.value = ''
        user.value = null

        const tokenCookie = useCookie('wk_admin_access_token')
        const refreshCookie = useCookie('wk_admin_refresh_token')
        const userCookie = useCookie('wk_admin_user')

        tokenCookie.value = null
        refreshCookie.value = null
        userCookie.value = null
    }

    async function refresh(): Promise<boolean> {
        if (!refreshTokenValue.value) return false

        try {
            const config = useRuntimeConfig()
            const response = await $fetch<any>(`${config.public.apiBase}/auth/refresh`, {
                method: 'POST',
                body: { refreshToken: refreshTokenValue.value },
            })

            if (response?.data?.tokens) {
                setAuth(response.data.user || user.value!, response.data.tokens)
                return true
            }
            return false
        } catch {
            logout()
            return false
        }
    }

    return {
        accessToken: readonly(accessToken),
        refreshToken: readonly(refreshTokenValue),
        user: readonly(user),
        isAuthenticated,
        setAuth,
        logout,
        refresh,
    }
}
