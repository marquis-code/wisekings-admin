export default defineNuxtRouteMiddleware((to) => {
    const { isAuthenticated, user } = useAuthState()

    const publicPages = ['/login', '/forgot-password', '/reset-password', '/signup', '/otp']
    const isPublicPage = publicPages.some((p) => to.path.startsWith(p))

    // Redirect unauthenticated users to login
    if (!isPublicPage && !isAuthenticated.value) {
        return navigateTo('/login')
    }

    // Redirect authenticated users away from login
    if (isPublicPage && isAuthenticated.value) {
        return navigateTo('/')
    }

    // Block non-admin users
    if (
        isAuthenticated.value &&
        user.value &&
        !['admin', 'superadmin', 'finance', 'support', 'viewer'].includes(user.value.role)
    ) {
        return navigateTo('/login')
    }
})
