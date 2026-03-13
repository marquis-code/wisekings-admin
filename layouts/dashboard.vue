<template>
  <div class="flex h-screen overflow-hidden bg-gray-50/50">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-gray-100 transition-all duration-300 shadow-sm',
        sidebarOpen ? 'w-64' : 'w-20',
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center h-20 px-6 border-b border-gray-50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#033958] flex items-center justify-center font-bold text-white text-base shadow-lg shadow-[#033958]/20">
            WK
          </div>
          <transition name="fade">
            <span v-if="sidebarOpen" class="text-xl font-bold text-gray-900 whitespace-nowrap tracking-tight">
              WiseKings
            </span>
          </transition>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 style-scrollbar">
        <template v-for="item in navItems" :key="item.path">
          <div v-if="item.separator" class="pt-6 pb-2">
            <p v-if="sidebarOpen" class="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              {{ item.label }}
            </p>
            <div v-else class="border-b border-gray-100 mx-2"></div>
          </div>
          <NuxtLink
            v-else
            :to="item.path"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative',
              isActive(item.path!)
                ? 'bg-[#033958]/5 text-[#033958]'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
            ]"
          >
            <Icon :name="item.icon!" :class="['w-5 h-5 flex-shrink-0 transition-colors', isActive(item.path!) ? 'text-[#033958]' : 'text-gray-400 group-hover:text-gray-900']" />
            <transition name="fade">
              <span v-if="sidebarOpen" class="whitespace-nowrap">{{ item.label }}</span>
            </transition>
            <div v-if="isActive(item.path!)" class="absolute left-0 w-1 h-6 bg-[#033958] rounded-r-full"></div>
          </NuxtLink>
        </template>
      </nav>

      <!-- Sidebar toggle -->
      <div class="p-4 border-t border-gray-50">
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all"
        >
          <Icon :name="sidebarOpen ? 'lucide:panel-left-close' : 'lucide:panel-left-open'" class="w-5 h-5" />
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div :class="['flex-1 flex flex-col transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-20']">
      <!-- Header -->
      <header class="sticky top-0 z-30 h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold text-gray-900 tracking-tight">{{ pageTitle }}</h1>
        </div>

        <div class="flex items-center gap-6">
          <!-- Quick Search -->
          <div class="hidden lg:flex items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 w-64 group focus-within:border-[#033958]/30 transition-all">
            <Icon name="lucide:search" class="w-4 h-4 text-gray-400 group-focus-within:text-[#033958]" />
            <input type="text" placeholder="Quick search..." class="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 text-gray-900 placeholder:text-gray-400" />
            <span class="text-[10px] font-bold text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-100">⌘K</span>
          </div>

          <!-- Notifications -->
          <button class="relative p-2.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
            <Icon name="lucide:bell" class="w-5 h-5" />
            <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          <!-- User menu -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="userMenuOpen = !userMenuOpen"
              class="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
            >
              <div class="w-9 h-9 rounded-xl bg-[#033958] flex items-center justify-center text-white text-xs font-bold shadow-md shadow-[#033958]/20">
                {{ initials }}
              </div>
              <div class="hidden md:block text-left">
                <p v-if="user" class="text-sm font-bold text-gray-900 leading-tight">{{ user.fullName }}</p>
                <p class="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">{{ user?.role }}</p>
              </div>
              <Icon name="lucide:chevron-down" class="w-4 h-4 text-gray-400 transition-transform" :class="{ 'rotate-180': userMenuOpen }" />
            </button>

            <transition name="slide-up">
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 py-2 z-50 overflow-hidden"
              >
                <div class="px-5 py-4 border-b border-gray-50 bg-gray-50/30">
                  <p class="text-sm font-bold text-gray-900">{{ user?.fullName }}</p>
                  <p class="text-xs text-gray-500 font-medium truncate mt-0.5">{{ user?.email }}</p>
                </div>
                <div class="p-2">
                  <NuxtLink to="/profile" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
                    <Icon name="lucide:user" class="w-4 h-4" />
                    My Profile
                  </NuxtLink>
                  <NuxtLink to="/settings" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
                    <Icon name="lucide:settings" class="w-4 h-4" />
                    Settings
                  </NuxtLink>
                  <div class="h-px bg-gray-50 my-1"></div>
                  <button
                    @click="handleLogout"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all font-semibold"
                  >
                    <Icon name="lucide:log-out" class="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8 lg:p-12">
        <slot />
      </main>
    </div>

    <!-- AI Assistant -->
    <AiAssistant />
  </div>
</template>

<script setup lang="ts">
import { useLogout } from '@/composables/modules/auth/useLogout'
import { useConfirm } from '@/composables/core/useConfirm'
import ChatWidget from '@/components/chat/ChatWidget.vue'

const route = useRoute()
const { user } = useAuthState()
const { logout: logoutAction, loading } = useLogout()
const { confirmLogout } = useConfirm()

const sidebarOpen = ref(true)
const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement>()

const initials = computed(() => {
  if (!user.value?.fullName) return '?'
  return user.value.fullName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
})

async function handleLogout() {
  userMenuOpen.value = false
  if (await confirmLogout()) {
    logoutAction()
  }
}

const pageTitle = computed(() => {
  const path = route.path
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/merchants': 'Merchants',
    '/partners': 'Partners',
    '/products': 'Products',
    '/categories': 'Categories',
    '/marketing': 'Marketing',
    '/orders': 'Orders',
    '/commissions': 'Commissions',
    '/wallets/withdrawals': 'Withdrawals',
    '/users': 'Users & Staff',
    '/roles': 'Roles & Permissions',
    '/audit': 'Audit Trail',
    '/notifications': 'Notifications',
    '/settings': 'Settings',
    '/chat': 'Message Center',
    '/kyc': 'KYC Review',
    '/ai-insights': 'AI Scaling Insights',
    '/support': 'Support Center',
  }
  return titles[path] || 'WiseKings Admin'
})

const navItems = [
  { label: 'Dashboard', icon: 'lucide:layout-dashboard', path: '/' },
  { separator: true, label: 'Commerce' },
  { label: 'Products', icon: 'lucide:package', path: '/products' },
  { label: 'Categories', icon: 'lucide:tags', path: '/categories' },
  { label: 'Marketing', icon: 'lucide:megaphone', path: '/marketing' },
  { label: 'Analytics', icon: 'lucide:bar-chart-3', path: 'https://analytics.google.com' },
  { label: 'Orders', icon: 'lucide:shopping-cart', path: '/orders' },
  { separator: true, label: 'Network' },
  { label: 'Merchants', icon: 'lucide:store', path: '/merchants' },
  { label: 'Partners', icon: 'lucide:handshake', path: '/partners' },
  { label: 'Commissions', icon: 'lucide:percent', path: '/commissions' },
  { separator: true, label: 'Finance' },
  { label: 'Withdrawals', icon: 'lucide:wallet', path: '/wallets/withdrawals' },
  { separator: true, label: 'Intelligence' },
  { label: 'AI Scaling Insights', icon: 'lucide:brain-circuit', path: '/ai-insights' },
  { label: 'Support Center', icon: 'lucide:headphones', path: '/support' },
  { label: 'Guest Inquiries', icon: 'lucide:mail-open', path: '/support/inquiries' },
  { separator: true, label: 'System' },
  { label: 'KYC Review', icon: 'lucide:shield-check', path: '/kyc' },
  { label: 'Message Center', icon: 'lucide:message-square', path: '/chat' },
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
