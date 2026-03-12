<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-50/50 p-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-10">
        <div class="w-16 h-16 rounded-2xl bg-[#033958] flex items-center justify-center font-bold text-white text-2xl shadow-xl shadow-[#033958]/20 mx-auto mb-6">
          WK
        </div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Activate Account</h1>
        <p class="text-gray-500 mt-2 font-medium italic">Complete your registration to join the WiseKings team</p>
      </div>

      <div class="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-[#033958]/5 border border-gray-100">
        <form v-if="!success" @submit.prevent="handleComplete" class="space-y-6">
          <div class="space-y-4">
            <div class="space-y-2 text-center p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Invited Account</p>
                <p class="text-sm font-black text-gray-900">{{ email }}</p>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-gray-700 ml-1">Verification Code (OTP)</label>
              <div class="relative group">
                <Icon name="lucide:key-round" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#033958] transition-colors w-5 h-5" />
                <input 
                  v-model="form.otpCode" 
                  type="text" 
                  placeholder="Enter 6-digit code" 
                  maxlength="6"
                  required
                  class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-center text-xl tracking-[0.3em] font-black focus:ring-2 focus:ring-[#033958]/10 transition-all text-gray-900" 
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-gray-700 ml-1">Create Password</label>
              <div class="relative group">
                <Icon name="lucide:lock" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#033958] transition-colors w-5 h-5" />
                <input 
                  v-model="form.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  placeholder="At least 8 characters" 
                  required
                  class="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#033958]/10 transition-all font-medium text-gray-900" 
                />
                <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-gray-700 ml-1">Confirm Password</label>
              <div class="relative group">
                <Icon name="lucide:shield-check" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#033958] transition-colors w-5 h-5" />
                <input 
                  v-model="form.confirmPassword" 
                  :type="showPassword ? 'text' : 'password'" 
                  placeholder="Repeat your password" 
                  required
                  class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#033958]/10 transition-all font-medium text-gray-900" 
                />
              </div>
            </div>
          </div>

          <div class="pt-2">
            <button 
              type="submit" 
              :disabled="loading || form.password !== form.confirmPassword || form.otpCode.length < 6"
              class="w-full bg-[#033958] hover:bg-[#022f42] text-white font-bold py-4 rounded-2xl shadow-xl shadow-[#033958]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <span v-if="loading">Processing...</span>
              <template v-else>
                Complete Activation
                <Icon name="lucide:check-circle" class="w-5 h-5 group-hover:scale-110 duration-300" />
              </template>
            </button>
            <p v-if="form.password && form.confirmPassword && form.password !== form.confirmPassword" class="text-xs text-red-500 font-bold text-center mt-3">
              Passwords do not match
            </p>
          </div>
        </form>

        <div v-else class="text-center py-6">
          <div class="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Icon name="lucide:party-popper" class="w-10 h-10" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Welcome Aboard!</h2>
          <p class="text-gray-500 font-medium mb-8 italic">Your account is now active. You're ready to start managing WiseKings.</p>
          <NuxtLink to="/login" class="inline-flex items-center gap-2 px-8 py-4 bg-[#033958] text-white font-bold rounded-2xl shadow-lg shadow-[#033958]/20 hover:bg-[#022f42] transition-all">
            Go to Portal
            <Icon name="lucide:arrow-right" class="w-5 h-5" />
          </NuxtLink>
        </div>
      </div>

      <div class="mt-8 text-center">
        <p class="text-gray-400 text-sm font-bold flex items-center justify-center gap-2">
            <Icon name="lucide:shield" class="w-4 h-4" />
            Secure Enterprise Encryption
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

const form = reactive({
  otpCode: '',
  password: '',
  confirmPassword: ''
})

onMounted(() => {
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
