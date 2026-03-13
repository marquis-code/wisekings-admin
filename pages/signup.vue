<template>
  <div class="space-y-8">
    <div class="space-y-3">
      <div class="w-16 h-1 bg-[#033958] rounded-full"></div>
      <h2 class="text-4xl font-black text-gray-900 tracking-tight">Create Account</h2>
      <p class="text-gray-500 font-medium text-sm">Fill in the details below to set up your administrator profile.</p>
    </div>

    <form @submit.prevent="handleSignup" class="space-y-6">
      <div class="grid grid-cols-1 gap-2">
        <CoreAnimatedInput 
          v-model="form.fullName"
          label="Full Name"
          type="text"
          placeholder="e.g. John Doe"
          required
        />

        <CoreAnimatedInput 
          v-model="form.email"
          label="Email Address"
          type="email"
          placeholder="admin@wisekings.com"
          required
        />

        <CoreSelectInput 
          v-model="form.role"
          label="Admin Role"
          :options="roleOptions"
          required
        />

        <CoreAnimatedInput 
          v-model="form.password"
          label="Password"
          type="password"
          placeholder="••••••••••••"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full py-4 rounded-2xl bg-[#033958] text-white font-bold text-sm shadow-xl shadow-[#033958]/20 hover:shadow-[#033958]/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
        :disabled="loading"
      >
        <span>{{ loading ? 'Creating account...' : 'Create Account' }}</span>
        <Icon v-if="!loading" name="lucide:user-plus" class="w-5 h-5" />
      </button>

      <p class="text-center text-xs font-bold text-gray-400 pt-2">
        Already have an account? <NuxtLink to="/login" class="text-[#033958] hover:underline font-black">Log in here</NuxtLink>
      </p>

      <p v-if="errorMessage" class="p-4 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest text-center border border-red-100 animate-shake">
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { auth_api } from '@/api_factory/modules/auth'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({ layout: 'auth' })

const { showToast } = useCustomToast()
const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  role: 'admin',
  userType: 'admin' // Force userType to admin
})

const roleOptions = [
  { label: 'Super Admin', value: 'superadmin' },
  { label: 'Standard Admin', value: 'admin' },
  { label: 'Finance Officer', value: 'finance' },
  { label: 'Customer Support', value: 'support' },
  { label: 'Read-only Viewer', value: 'viewer' }
]

async function handleSignup() {
  loading.value = true
  errorMessage.value = ''
  try {
    await auth_api.register(form)
    showToast({
      title: "Account Created",
      message: "Please verify your email to activate administrative access.",
      toastType: "success",
    })
    router.push(`/otp?email=${form.email}`)
  } catch (err: any) {
    errorMessage.value = err.message || "Registration failed"
    showToast({
      title: "Error",
      message: errorMessage.value,
      toastType: "error",
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-shake { animation: shake 0.5s linear; }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
</style>
