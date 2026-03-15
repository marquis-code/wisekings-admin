<template>
  <div class="flex h-screen overflow-hidden bg-gray-50/50 font-['Inter']">
    <!-- Mobile Sidebar Overlay -->
    <Transition name="fade">
      <div v-if="mobileSidebarOpen" @click="mobileSidebarOpen = false" class="fixed inset-0 z-[60] bg-[#033958]/20 backdrop-blur-md lg:hidden"></div>
    </Transition>

    <!-- Sidebar: Dynamic Flipping Mechanism -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-[70] flex flex-col bg-white border-r border-gray-100 transition-all duration-500 shadow-2xl lg:static lg:z-40 overflow-hidden',
        sidebarOpen ? 'w-72' : 'w-24',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Layer 1: Main Categories -->
      <div 
        class="absolute inset-0 flex flex-col transition-all duration-500 bg-white"
        :class="[activeCategory ? '-translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100']"
      >
        <div class="p-8 pb-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
             <img src="@/assets/images/logo.jpg" alt="Logo" class="w-10 h-10 rounded-xl object-cover shadow-lg" />
             <h2 v-if="sidebarOpen" class="text-sm font-black text-gray-900 uppercase tracking-[0.2em] animate-in fade-in slide-in-from-left duration-500">WiseKings</h2>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto py-8 px-6 space-y-2 style-scrollbar">
          <template v-for="group in navGroups" :key="group.id">
            <button
              v-if="canAccess(group)"
              @click="handleCategoryClick(group)"
              class="w-full group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 relative border border-transparent hover:bg-gray-50 hover:border-gray-100 active:scale-[0.98]"
            >
              <div :class="['w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0', activeCategory === group.id ? 'bg-[#033958] text-white' : 'bg-gray-50 text-gray-400 group-hover:text-[#033958] group-hover:bg-[#033958]/5']">
                <Icon :name="group.icon" class="w-6 h-6" />
              </div>
              <div v-if="sidebarOpen" class="flex-1 text-left overflow-hidden animate-in fade-in slide-in-from-left duration-500">
                <p class="text-sm font-black text-gray-900 truncate">{{ group.label }}</p>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate">{{ group.children.length ? `${group.children.length} Modules` : 'Dashboard' }}</p>
              </div>
              <Icon v-if="sidebarOpen && group.children.length" name="lucide:chevron-right" class="w-4 h-4 text-gray-300 group-hover:translate-x-1 duration-300" />
            </button>
          </template>
        </div>

        <!-- System Footer -->
        <div v-if="sidebarOpen" class="p-8 pt-4 border-t border-gray-50 bg-gray-50/30">
           <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-full bg-[#033958] flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-xl shadow-[#033958]/20">
                {{ initials }}
              </div>
              <div class="min-w-0">
                <p class="text-xs font-black text-gray-900 truncate uppercase tracking-tight">{{ user?.fullName }}</p>
                <div class="flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <p class="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Connected</p>
                </div>
              </div>
           </div>
           <button @click="sidebarOpen = !sidebarOpen" class="w-full py-3 rounded-xl bg-white border border-gray-100 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
              <Icon name="lucide:panel-left-close" class="w-4 h-4 text-gray-400" />
              <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Minimize</span>
           </button>
        </div>
      </div>

      <!-- Layer 2: Sub-items (Flipped) -->
      <div 
        class="absolute inset-0 flex flex-col transition-all duration-500 bg-white"
        :class="[activeCategory ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none']"
      >
        <div class="p-8 pb-4 border-b border-gray-50">
          <button 
            @click="activeCategory = null"
            class="group mb-8 flex items-center gap-3 text-gray-400 hover:text-[#033958] transition-all"
          >
            <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#033958]/5 transition-all">
              <Icon name="lucide:arrow-left" class="w-5 h-5 group-hover:-translate-x-1 duration-300" />
            </div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em]">Return Back</span>
          </button>

          <div class="flex items-center gap-4 animate-in slide-in-from-left duration-500">
             <div class="w-14 h-14 rounded-2xl bg-[#033958]/5 text-[#033958] flex items-center justify-center shadow-inner">
               <Icon :name="navGroups.find(g => g.id === activeCategory)?.icon || 'lucide:grid'" class="w-7 h-7" />
             </div>
             <div>
               <h3 class="text-lg font-black text-gray-900 tracking-tight">{{ navGroups.find(g => g.id === activeCategory)?.label }}</h3>
               <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{{ navGroups.find(g => g.id === activeCategory)?.children.length }} Active Modules</p>
             </div>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto py-8 px-6 space-y-1.5 style-scrollbar">
           <template v-for="child in navGroups.find(g => g.id === activeCategory)?.children" :key="child.path">
              <NuxtLink
                v-if="canAccess(child)"
                :to="child.path"
                @click="mobileSidebarOpen = false"
                :class="[
                  'group flex items-center gap-3 p-4 rounded-xl text-sm font-bold transition-all relative border border-transparent',
                  isActive(child.path)
                    ? 'bg-[#033958] text-white shadow-xl shadow-[#033958]/20 border-[#033958]'
                    : 'text-gray-500 hover:text-[#033958] hover:bg-gray-50 hover:border-gray-100',
                ]"
              >
                <div :class="['w-8 h-8 rounded-lg flex items-center justify-center transition-all', isActive(child.path) ? 'bg-white/20' : 'bg-gray-50 group-hover:bg-[#033958]/5']">
                   <Icon :name="child.icon" class="w-4 h-4" />
                </div>
                <span class="flex-1 truncate">{{ child.label }}</span>
                <div v-if="isActive(child.path)" class="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                <Icon v-else name="lucide:arrow-right" class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 duration-300" />
              </NuxtLink>
           </template>
        </div>

        <!-- Contextual Help -->
        <div class="p-6">
           <div class="bg-amber-50 rounded-2xl p-4 border border-amber-100">
             <div class="flex items-center gap-2 mb-2">
               <Icon name="lucide:lightbulb" class="w-4 h-4 text-amber-500" />
               <span class="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none">Management Tip</span>
             </div>
             <p class="text-[10px] text-amber-600/80 font-medium leading-relaxed">
               Use these specialized modules to control {{ navGroups.find(g => g.id === activeCategory)?.label }} operations across the business network.
             </p>
           </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 h-screen transition-all duration-300">
      <!-- Header -->
      <header class="sticky top-0 z-30 h-24 flex items-center justify-between px-6 md:px-12 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div class="flex items-center gap-6">
          <button @click="mobileSidebarOpen = true" class="lg:hidden w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-2xl border border-gray-100">
            <Icon name="lucide:menu" class="w-6 h-6" />
          </button>
          <div class="hidden sm:block">
            <h1 class="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">{{ pageTitle }}</h1>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">WiseKings Admin Console</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Quick Tools -->
          <div class="hidden lg:flex items-center gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
             <button class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#033958] hover:bg-white rounded-xl transition-all shadow-sm">
                <Icon name="lucide:plus" class="w-5 h-5" />
             </button>
             <button class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#033958] hover:bg-white rounded-xl transition-all shadow-sm">
                <Icon name="lucide:calendar" class="w-5 h-5" />
             </button>
          </div>

          <!-- Vertical Divider -->
          <div class="h-10 w-px bg-gray-100 mx-2 hidden sm:block"></div>

          <!-- User menu -->
          <div class="relative" ref="userMenuRef">
            <button
              @click="userMenuOpen = !userMenuOpen"
              class="flex items-center gap-4 p-2 pl-2 pr-6 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group"
            >
              <div class="w-12 h-12 rounded-xl bg-[#033958] flex items-center justify-center text-white text-sm font-black shadow-xl shadow-[#033958]/20 shrink-0">
                {{ initials }}
              </div>
              <div class="hidden md:block text-left min-w-[120px]">
                <p class="text-xs font-black text-gray-900 leading-tight truncate uppercase tracking-tight">{{ user?.fullName || 'Administrator' }}</p>
                <div class="flex items-center gap-1 mt-0.5">
                   <span class="px-1.5 py-0.5 rounded bg-amber-100 text-amber-600 text-[8px] font-black uppercase tracking-widest">{{ user?.role || 'Staff' }}</span>
                </div>
              </div>
              <Icon name="lucide:chevron-down" class="w-4 h-4 text-gray-400 group-hover:text-[#033958] transition-transform" :class="{ 'rotate-180': userMenuOpen }" />
            </button>

            <transition name="slide-up">
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-4 w-72 bg-white border border-gray-100 rounded-[2rem] shadow-2xl shadow-gray-200/50 p-3 z-50 overflow-hidden"
              >
                <div class="px-5 py-6 bg-gray-50/50 rounded-2xl mb-2">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-xl bg-[#033958] text-white flex items-center justify-center text-xs font-black">
                      {{ initials }}
                    </div>
                    <div>
                      <p class="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{{ user?.fullName }}</p>
                      <p class="text-xs text-gray-400 font-bold truncate">{{ user?.email }}</p>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2 pt-3 border-t border-white">
                     <span class="px-2 py-1 rounded-lg bg-white/80 text-[10px] font-black text-gray-400 border border-gray-50">{{ user?.userType }}</span>
                     <span class="px-2 py-1 rounded-lg bg-[#033958] text-[10px] font-black text-white shadow-lg shadow-[#033958]/20">{{ user?.role }}</span>
                  </div>
                </div>
                
                <div class="p-2 space-y-1">
                  <NuxtLink to="/profile" @click="userMenuOpen = false" class="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-white hover:bg-[#033958] rounded-xl transition-all font-bold group">
                    <Icon name="lucide:user" class="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    Security Settings
                  </NuxtLink>
                  <NuxtLink to="/support" @click="userMenuOpen = false" class="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-white hover:bg-[#033958] rounded-xl transition-all font-bold group">
                    <Icon name="lucide:help-circle" class="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    Platform Help
                  </NuxtLink>
                  <div class="h-px bg-gray-50 my-2"></div>
                  <button
                    @click="handleLogout"
                    class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all font-black uppercase tracking-widest group"
                  >
                    <Icon name="lucide:log-out" class="w-5 h-5 group-hover:-translate-x-1 duration-300" />
                    Sign Out Terminal
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50/50 p-8 md:p-12 lg:p-16 style-scrollbar relative">
        <!-- Floating Decor -->
        <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-[#033958]/[0.02] rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>

        <div class="mx-auto max-w-[1400px] relative z-10">
          <slot />
        </div>
      </main>
    </div>

    <!-- AI Assistant -->
    <AiAssistant />
  </div>
</template>

<script setup lang="ts">
import { useLogout } from '@/composables/modules/auth/useLogout'
import { useConfirm } from '@/composables/core/useConfirm'
import { useAuthState } from '@/composables/useAuthState'

const route = useRoute()
const { user } = useAuthState()
const { logout: logoutAction } = useLogout()
const { confirmLogout } = useConfirm()

const sidebarOpen = ref(true)
const mobileSidebarOpen = ref(false)
const activeCategory = ref<string | null>(null)
const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement>()

const navGroups = [
  {
    id: 'dashboard',
    label: 'Intelligence',
    icon: 'lucide:layout-dashboard',
    path: '/',
    children: [],
    roles: ['superadmin', 'admin', 'staff', 'finance', 'support']
  },
  {
    id: 'commerce',
    label: 'Commerce Hub',
    icon: 'lucide:shopping-bag',
    roles: ['superadmin', 'admin', 'manager', 'finance'],
    children: [
      { label: 'Inventory', icon: 'lucide:package', path: '/products', roles: ['superadmin', 'admin'] },
      { label: 'Categories', icon: 'lucide:tags', path: '/categories', roles: ['superadmin', 'admin'] },
      { label: 'Order Pipeline', icon: 'lucide:shopping-cart', path: '/orders', roles: ['superadmin', 'admin', 'manager', 'staff', 'finance'] },
      { label: 'Marketing Engine', icon: 'lucide:megaphone', path: '/marketing', roles: ['superadmin', 'admin'] },
    ]
  },
  {
    id: 'network',
    label: 'Ecosystem',
    icon: 'lucide:users-2',
    roles: ['superadmin', 'admin', 'finance'],
    children: [
      { label: 'Merchant Directory', icon: 'lucide:store', path: '/merchants', roles: ['superadmin', 'admin', 'finance'] },
      { label: 'Partner Network', icon: 'lucide:handshake', path: '/partners', roles: ['superadmin', 'admin', 'finance'] },
      { label: 'Commissions', icon: 'lucide:percent', path: '/commissions', roles: ['superadmin', 'admin', 'finance'] },
    ]
  },
  {
    id: 'finance',
    label: 'Settlements',
    icon: 'lucide:wallet',
    roles: ['superadmin', 'admin', 'accountant', 'finance'],
    children: [
      { label: 'Withdrawal Center', icon: 'lucide:banknote', path: '/wallets/withdrawals', roles: ['superadmin', 'admin', 'finance'] },
    ]
  },
  {
    id: 'system',
    label: 'Administration',
    icon: 'lucide:settings-2',
    roles: ['superadmin', 'admin', 'support'],
    children: [
      { label: 'Identity Review', icon: 'lucide:shield-check', path: '/kyc', roles: ['superadmin', 'admin', 'support'] },
      { label: 'Support Terminal', icon: 'lucide:message-square', path: '/chat', roles: ['superadmin', 'admin', 'support'] },
      { label: 'Staff Roster', icon: 'lucide:users', path: '/users', roles: ['superadmin'] },
      { label: 'Security Profiles', icon: 'lucide:shield', path: '/roles', roles: ['superadmin'] },
      { label: 'Platform Logs', icon: 'lucide:clipboard-list', path: '/audit', roles: ['superadmin'] },
      { label: 'Communications', icon: 'lucide:bell', path: '/notifications', roles: ['superadmin', 'admin'] },
      { label: 'Platform Core', icon: 'lucide:settings', path: '/settings', roles: ['superadmin'] },
    ]
  },
  {
    id: 'intelligence',
    label: 'Support & AI',
    icon: 'lucide:brain-circuit',
    roles: ['superadmin', 'admin', 'support'],
    children: [
      { label: 'AI Forecasting', icon: 'lucide:sparkles', path: '/ai-insights', roles: ['superadmin'] },
      { label: 'User Inquiries', icon: 'lucide:mail-open', path: '/support/inquiries', roles: ['superadmin', 'admin', 'support'] },
    ]
  }
]

function canAccess(item: any) {
  if (!user.value) return false
  
  // Normalize user identification
  const userRole = (user.value.role || '').toLowerCase().trim()
  const userType = (user.value.userType || '').toLowerCase().trim()
  
  if (userRole === 'superadmin' || userType === 'superadmin') return true
  
  // Check if item has role restrictions
  if (item.roles) {
    const authorizedRoles = item.roles.map((r: string) => r.toLowerCase().trim())
    return authorizedRoles.includes(userRole) || authorizedRoles.includes(userType)
  }
  
  return true
}

// Initialize active category based on current path
onMounted(() => {
  const currentPath = route.path
  const group = navGroups.find(g => 
    (g.path && currentPath === g.path) || 
    (g.children && g.children.some(c => currentPath.startsWith(c.path)))
  )
  if (group && group.children.length) activeCategory.value = group.id
})

watch(() => route.path, (newPath) => {
  const group = navGroups.find(g => 
    (g.path && newPath === g.path) || 
    (g.children && g.children.some(c => newPath.startsWith(c.path)))
  )
  if (group && group.children.length && !activeCategory.value) {
    activeCategory.value = group.id
  }
})

function handleCategoryClick(group: any) {
  if (group.path) {
    navigateTo(group.path)
    activeCategory.value = null
  } else if (group.children && group.children.length) {
    activeCategory.value = group.id
  }
}

const initials = computed(() => {
  if (!user.value?.fullName) return 'WK'
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
    '/': 'Executive Overview',
    '/merchants': 'Merchant Network',
    '/partners': 'Partner Ecosystem',
    '/products': 'Inventory Matrix',
    '/categories': 'Classification Hub',
    '/marketing': 'Campaign Engine',
    '/orders': 'Order Pipeline',
    '/commissions': 'Commission Ledger',
    '/wallets/withdrawals': 'Payout Terminal',
    '/users': 'Identity Roster',
    '/roles': 'Security Profiles',
    '/audit': 'Platform Logs',
    '/notifications': 'Bulletin Center',
    '/settings': 'Platform Core',
    '/chat': 'Support Terminal',
    '/kyc': 'Compliance Review',
    '/ai-insights': 'Predictive Growth',
    '/support': 'Help Center',
  }
  return titles[path] || 'WiseKings Control'
})

function isActive(path: string | undefined) {
  if (!path) return false
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
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(10px); }

.style-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.style-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.style-scrollbar::-webkit-scrollbar-thumb {
  background: #033958/10;
  border-radius: 10px;
}
</style>
