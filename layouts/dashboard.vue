<template>
  <div class="flex h-screen overflow-hidden bg-dark-950">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 flex flex-col bg-dark-900 border-r border-dark-700 transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20',
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center h-16 px-4 border-b border-dark-700">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center font-bold text-white text-sm">
            WK
          </div>
          <transition name="fade">
            <span v-if="sidebarOpen" class="text-lg font-bold text-white whitespace-nowrap">
              WiseKings
            </span>
          </transition>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <template v-for="item in navItems" :key="item.path">
          <div v-if="item.separator" class="pt-4 pb-2">
            <p v-if="sidebarOpen" class="px-3 text-[10px] font-semibold text-dark-500 uppercase tracking-widest">
              {{ item.label }}
            </p>
            <div v-else class="border-b border-dark-700 mx-2"></div>
          </div>
          <NuxtLink
            v-else
            :to="item.path"
            :class="[
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
              isActive(item.path!)
                ? 'bg-primary-600/10 text-primary-400 border border-primary-500/20'
                : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800',
            ]"
          >
            <Icon :name="item.icon!" class="w-5 h-5 flex-shrink-0" />
            <transition name="fade">
              <span v-if="sidebarOpen" class="whitespace-nowrap">{{ item.label }}</span>
            </transition>
          </NuxtLink>
        </template>
      </nav>

      <!-- Sidebar toggle -->
      <div class="p-3 border-t border-dark-700">
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors"
        >
          <Icon :name="sidebarOpen ? 'lucide:panel-left-close' : 'lucide:panel-left-open'" class="w-5 h-5" />
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div :class="['flex-1 flex flex-col transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-20']">
      <!-- Header -->
      <header class="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700">
        <div class="flex items-center gap-4">
          <h1 class="text-lg font-semibold text-white">{{ pageTitle }}</h1>
        </div>

        <div class="flex items-center gap-3">
          <!-- Notifications -->
          <button class="relative p-2 rounded-lg text-dark-400 hover:text-dark-200 hover:bg-dark-800 transition-colors">
            <Icon name="lucide:bell" class="w-5 h-5" />
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <!-- User menu -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="userMenuOpen = !userMenuOpen"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-dark-800 transition-colors"
            >
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-semibold">
                {{ initials }}
              </div>
              <span v-if="user" class="text-sm font-medium text-dark-200 hidden md:block">{{ user.fullName }}</span>
              <Icon name="lucide:chevron-down" class="w-4 h-4 text-dark-400" />
            </button>

            <transition name="slide-up">
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-56 bg-dark-850 border border-dark-700 rounded-xl shadow-xl py-2 z-50"
              >
                <div class="px-4 py-2 border-b border-dark-700">
                  <p class="text-sm font-medium text-dark-200">{{ user?.fullName }}</p>
                  <p class="text-xs text-dark-400">{{ user?.email }}</p>
                  <span class="badge-info mt-1">{{ user?.role }}</span>
                </div>
                <button
                  @click="logout"
                  class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-dark-800 transition-colors"
                >
                  <Icon name="lucide:log-out" class="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </transition>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogout } from '@/composables/modules/auth/useLogout'

const route = useRoute()
const { user } = useAuthState()
const { logout, loading } = useLogout()

const sidebarOpen = ref(true)
const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement>()

const initials = computed(() => {
  if (!user.value?.fullName) return '?'
  return user.value.fullName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
})

const pageTitle = computed(() => {
  const path = route.path
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/merchants': 'Merchants',
    '/partners': 'Partners',
    '/products': 'Products',
    '/categories': 'Categories',
    '/orders': 'Orders',
    '/commissions': 'Commissions',
    '/wallets/withdrawals': 'Withdrawals',
    '/users': 'Users & Staff',
    '/roles': 'Roles & Permissions',
    '/audit': 'Audit Trail',
    '/notifications': 'Notifications',
    '/settings': 'Settings',
  }
  return titles[path] || 'WiseKings Admin'
})

const navItems = [
  { label: 'Dashboard', icon: 'lucide:layout-dashboard', path: '/' },
  { separator: true, label: 'Commerce' },
  { label: 'Products', icon: 'lucide:package', path: '/products' },
  { label: 'Categories', icon: 'lucide:tags', path: '/categories' },
  { label: 'Orders', icon: 'lucide:shopping-cart', path: '/orders' },
  { separator: true, label: 'Network' },
  { label: 'Merchants', icon: 'lucide:store', path: '/merchants' },
  { label: 'Partners', icon: 'lucide:handshake', path: '/partners' },
  { label: 'Commissions', icon: 'lucide:percent', path: '/commissions' },
  { separator: true, label: 'Finance' },
  { label: 'Withdrawals', icon: 'lucide:wallet', path: '/wallets/withdrawals' },
  { separator: true, label: 'System' },
  { label: 'Users & Staff', icon: 'lucide:users', path: '/users' },
  { label: 'Roles', icon: 'lucide:shield', path: '/roles' },
  { label: 'Audit Trail', icon: 'lucide:clipboard-list', path: '/audit' },
  { label: 'Notifications', icon: 'lucide:bell', path: '/notifications' },
  { label: 'Settings', icon: 'lucide:settings', path: '/settings' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

// Close dropdown on outside click
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
      userMenuOpen.value = false
    }
  })
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.2s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(4px); }
</style>
