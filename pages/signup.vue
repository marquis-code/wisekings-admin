<template>
  <div class="space-y-8">
    <div class="space-y-3">
      <div class="w-16 h-1 bg-[#033958] rounded-full"></div>
      <h2 class="text-4xl font-black text-gray-900 tracking-tight">Admin Registration</h2>
      <p class="text-gray-500 font-medium">Create a new administrator account for the WiseKings platform.</p>
    </div>

    <form @submit.prevent="handleSignup" class="space-y-6">
      <div class="grid grid-cols-1 gap-4">
        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Full Name</label>
          <input 
            v-model="form.fullName"
            type="text"
            placeholder="e.g. John Doe"
            class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-[#033958]/5 focus:border-[#033958] outline-none transition-all"
            required
          />
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
          <input 
            v-model="form.email"
            type="email"
            placeholder="admin@wisekings.com"
            class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-[#033958]/5 focus:border-[#033958] outline-none transition-all"
            required
          />
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Select Admin Role</label>
          <select 
            v-model="form.role"
            class="w-full px-6 py-4 bg-gray-100 border-none rounded-2xl text-sm font-black text-[#033958] focus:ring-4 focus:ring-[#033958]/10 outline-none transition-all appearance-none cursor-pointer"
            required
          >
            <option value="superadmin">Super Admin</option>
            <option value="admin">Standard Admin</option>
            <option value="finance">Finance Officer</option>
            <option value="support">Customer Support</option>
            <option value="viewer">Read-only Viewer</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Password</label>
          <input 
            v-model="form.password"
            type="password"
            placeholder="••••••••••••"
            class="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-4 focus:ring-[#033958]/5 focus:border-[#033958] outline-none transition-all"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-5 rounded-2xl bg-[#033958] text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#033958]/30 hover:shadow-[#033958]/40 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
        :disabled="loading"
      >
        <span v-if="loading">Creating account...</span>
        <template v-else>
          Register Admin Account
          <Icon name="lucide:user-plus" class="w-5 h-5" />
        </template>
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
