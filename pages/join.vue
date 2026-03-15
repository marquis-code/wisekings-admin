<template>
  <main class="min-h-screen flex bg-white font-['Inter']">
    <!-- Left Section: Branding Image -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#033958]">
      <div class="absolute inset-0 bg-gradient-to-br from-[#033958]/80 to-[#022f42]/90 z-10"></div>
      <img 
        src="@/assets/images/join-branding.png" 
        alt="Branding" 
        class="absolute inset-0 w-full h-full object-cover mix-blend-overlay scale-110"
      />
      
      <div class="relative z-20 flex flex-col justify-between p-16 w-full text-white">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center font-black text-white text-xl shadow-2xl">
            WK
          </div>
          <span class="text-xl font-black uppercase tracking-widest opacity-90">WiseKings Admin</span>
        </div>

        <div class="max-w-md">
          <h2 class="text-6xl font-black leading-tight mb-6 tracking-tighter">
            Elevating <br/><span class="text-amber-400">Excellence.</span>
          </h2>
          <p class="text-xl text-white/70 font-medium leading-relaxed">
            Welcome to the heartbeat of WiseKings. Securely activate your account and join our mission to redefine quality.
          </p>
        </div>

        <div class="flex items-center gap-6">
          <div class="flex -space-x-3">
            <div v-for="i in 4" :key="i" class="w-12 h-12 rounded-full border-2 border-[#033958] bg-gray-200 overflow-hidden shadow-xl">
               <img :src="`https://i.pravatar.cc/150?u=${i}`" alt="Team" class="w-full h-full object-cover" />
            </div>
          </div>
          <p class="text-sm font-bold text-white/60 tracking-tight uppercase">Join 20+ Admins</p>
        </div>
      </div>
    </div>

    <!-- Right Section: Activation Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24 relative overflow-hidden">
      <!-- Mobile Background Grain/Decor -->
      <div class="absolute inset-0 bg-gray-50/50 lg:hidden -z-10"></div>
      <div class="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -mr-32 -mt-32 lg:hidden"></div>

      <div class="w-full max-w-lg transition-all duration-1000 ease-out" :class="[mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
        <div class="mb-12">
          <img src="@/assets/images/logo.jpg" alt="WiseKings" class="w-16 h-16 rounded-2xl shadow-xl mb-8 lg:hidden object-cover" />
          <div v-if="success" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-emerald-100">
             <Icon name="lucide:check-circle-2" class="w-3.5 h-3.5" />
             Account Verified
          </div>
          <h1 class="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
            {{ success ? 'Welcome to WiseKings!' : 'Activate Account' }}
          </h1>
          <p class="text-gray-500 font-medium text-lg max-w-sm">
            {{ success ? 'Your administrative portal is now ready. Let\'s get started.' : 'Complete your registration to access the administrative dashboard.' }}
          </p>
        </div>

        <div v-if="!success" class="space-y-8">
           <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400">
                <Icon name="lucide:mail" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Account</p>
                <p class="text-sm font-bold text-gray-900 truncate">{{ email }}</p>
              </div>
           </div>

           <form @submit.prevent="handleComplete" class="space-y-6">
              <AnimatedInput 
                v-model="form.otpCode" 
                label="Verification PIN" 
                type="text" 
                maxlength="6"
                required
                placeholder="6-digit code from email"
              />

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatedInput 
                  v-model="form.password" 
                  label="Secure Password" 
                  type="password" 
                  required
                  placeholder="********"
                />
                <AnimatedInput 
                  v-model="form.confirmPassword" 
                  label="Confirm Password" 
                  type="password" 
                  required
                  placeholder="********"
                />
              </div>

              <div class="space-y-4 pt-4">
                <button 
                  type="submit" 
                  :disabled="loading || form.password !== form.confirmPassword || form.otpCode.length < 6"
                  class="w-full bg-[#033958] hover:bg-[#022f42] text-white font-black py-4 lg:py-5 rounded-2xl shadow-2xl shadow-[#033958]/20 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 active:scale-95"
                >
                  <Icon v-if="loading" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
                  <template v-else>
                    Finalize Activation
                    <Icon name="lucide:arrow-right" class="w-5 h-5 group-hover:translate-x-1 duration-300" />
                  </template>
                </button>
                <p v-if="form.password && form.confirmPassword && form.password !== form.confirmPassword" class="text-xs text-red-500 font-bold text-center">
                  Passwords do not match
                </p>
              </div>
           </form>
        </div>

        <div v-else class="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
          <NuxtLink to="/login" class="inline-flex items-center gap-4 px-12 py-5 bg-[#033958] text-white font-black rounded-2xl shadow-2xl shadow-[#033958]/30 hover:bg-[#022f42] transition-all hover:-translate-y-1 active:translate-y-0 group">
            Proceed to Dashboard
            <Icon name="lucide:layout-dashboard" class="w-5 h-5 group-hover:scale-110 duration-300 text-amber-400" />
          </NuxtLink>
          
          <div class="pt-8 border-t border-gray-100">
             <p class="text-sm font-medium text-gray-400">Need help? Contact our <a href="#" class="text-[#033958] font-bold hover:underline">Support System</a></p>
          </div>
        </div>
      </div>
      
      <!-- Footer Branding -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-24 lg:translate-x-0">
        <p class="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] flex items-center gap-2">
          <Icon name="lucide:shield-check" class="w-3 h-3 text-emerald-400" />
          Powered by WiseKings Secure
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth_api } from '@/api_factory/modules/auth'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const { showToast } = useCustomToast()

const email = ref((route.query.email as string) || '')
const loading = ref(false)
const success = ref(false)
const showPassword = ref(false)
const mounted = ref(false)

const form = reactive({
  otpCode: '',
  password: '',
  confirmPassword: ''
})

onMounted(() => {
  setTimeout(() => mounted.value = true, 100)
  if (!email.value) {
    showToast({ title: 'Invalid Link', message: 'No email address found in the invitation link.', toastType: 'error' })
    router.push('/login')
  }
})

async function handleComplete() {
  if (form.password !== form.confirmPassword) return

  loading.value = true
  try {
    await auth_api.completeInvitation({
        email: email.value,
        otpCode: form.otpCode,
        password: form.password
    })
    success.value = true
    showToast({ title: 'Success', message: 'Your account has been activated!', toastType: 'success' })
  } catch (err: any) {
    showToast({ title: 'Error', message: err.message || 'Activation failed', toastType: 'error' })
  } finally {
    loading.value = false
  }
}
</script>
