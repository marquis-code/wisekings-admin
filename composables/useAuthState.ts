import type { User, AuthTokens } from '~/types'

// ── Reactive auth state (singleton via composable) ──

const accessToken = ref<string>('')
const refreshTokenValue = ref<string>('')
const user = ref<User | null>(null)
const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

export function useAuthState() {
    // Hydrate from localStorage on client
    if (import.meta.client && !accessToken.value) {
        const savedToken = localStorage.getItem('wk_admin_token')
        const savedRefresh = localStorage.getItem('wk_admin_refresh')
        const savedUser = localStorage.getItem('wk_admin_user')

        if (savedToken) accessToken.value = savedToken
        if (savedRefresh) refreshTokenValue.value = savedRefresh
        if (savedUser) {
            try {
                user.value = JSON.parse(savedUser)
            } catch {
                user.value = null
            }
        }

        // Also sync to cookies for SSR
        if (!useCookie('wk_admin_token').value && savedToken) {
            useCookie('wk_admin_token').value = savedToken
            useCookie('wk_admin_refresh').value = savedRefresh
            useCookie('wk_admin_user').value = savedUser
        }
    }

    function setAuth(userData: User, tokens: AuthTokens) {
        accessToken.value = tokens.accessToken
        refreshTokenValue.value = tokens.refreshToken
        user.value = userData

        if (import.meta.client) {
            localStorage.setItem('wk_admin_token', tokens.accessToken)
            localStorage.setItem('wk_admin_refresh', tokens.refreshToken)
            localStorage.setItem('wk_admin_user', JSON.stringify(userData))
        }

        // SSR-safe cookies
        useCookie('wk_admin_token', { maxAge: 60 * 60 * 24 * 7 }).value = tokens.accessToken
        useCookie('wk_admin_refresh', { maxAge: 60 * 60 * 24 * 7 }).value = tokens.refreshToken
        useCookie('wk_admin_user', { maxAge: 60 * 60 * 24 * 7 }).value = JSON.stringify(userData)
    }

    function logout() {
        accessToken.value = ''
        refreshTokenValue.value = ''
        user.value = null

        if (import.meta.client) {
            localStorage.removeItem('wk_admin_token')
            localStorage.removeItem('wk_admin_refresh')
            localStorage.removeItem('wk_admin_user')
        }

        useCookie('wk_admin_token').value = null
        useCookie('wk_admin_refresh').value = null
        useCookie('wk_admin_user').value = null
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
