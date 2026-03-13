<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-50/50 p-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-10">
        <div class="w-16 h-16 rounded-2xl bg-[#033958] flex items-center justify-center font-bold text-white text-2xl shadow-xl shadow-[#033958]/20 mx-auto mb-6">
          WK
        </div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Set Password</h1>
        <p class="text-gray-500 mt-2 font-medium">Choose a password for your new administrator account.</p>
      </div>

      <div class="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-[#033958]/5 border border-gray-100">
        <form v-if="!success" @submit.prevent="handleComplete" class="space-y-6">
          <div class="space-y-4">
            <div class="space-y-2 text-center p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Invited Account</p>
                <p class="text-sm font-black text-gray-900">{{ email }}</p>
            </div>

            <div class="space-y-4">
              <CoreAnimatedInput 
                v-model="form.otpCode"
                label="Verification Code"
                type="text"
                placeholder="Enter 6-digit code"
                required
              />

              <CoreAnimatedInput 
                v-model="form.password"
                label="New Password"
                type="password"
                placeholder="At least 8 characters"
                required
              />

              <CoreAnimatedInput 
                v-model="form.confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Repeat your password"
                required
              />
            </div>
          </div>

          <div class="pt-2">
              <button 
                type="submit" 
                :disabled="loading || form.password !== form.confirmPassword || form.otpCode.length < 6"
                class="w-full bg-[#033958] hover:bg-[#022f42] text-white font-bold py-4 rounded-2xl shadow-xl shadow-[#033958]/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <span>{{ loading ? 'Saving...' : 'Set Password' }}</span>
                <Icon v-if="!loading" name="lucide:check-circle" class="w-5 h-5 group-hover:scale-110 duration-300" />
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
