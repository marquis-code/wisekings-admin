<template>
  <main class="min-h-screen flex items-center justify-center bg-[#fff9f0] p-6 relative overflow-hidden">
    <!-- Playful Background Decorations -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[120px] -mr-64 -mt-64"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#033958]/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

    <div class="w-full max-w-md relative z-10 transition-all duration-700 ease-out" :class="[mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
      <div class="text-center mb-10">
        <div class="w-20 h-20 rounded-[2.5rem] bg-[#033958] flex items-center justify-center font-black text-white text-3xl shadow-[0_20px_40px_rgba(3,57,88,0.3)] mx-auto mb-8 relative group overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent group-hover:translate-x-full duration-1000 transition-transform"></div>
          WK
        </div>
        <h1 class="text-3xl font-black text-gray-900 tracking-tight mb-2">Security Check</h1>
        <p class="text-gray-500 font-medium italic">We've sent a 6-digit code to your email.</p>
      </div>

      <div class="bg-white rounded-[3rem] p-10 shadow-[0_30px_70px_rgba(3,57,88,0.1)] border border-white relative overflow-hidden">
        <!-- Inner glow -->
        <div class="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-amber-50/30 to-transparent pointer-events-none"></div>

        <div class="text-center mb-10 relative">
            <div class="px-4 py-2 bg-amber-50 rounded-full inline-block border border-amber-100/50 mb-3">
                <p class="text-[10px] font-black text-amber-600 uppercase tracking-widest">{{ email }}</p>
            </div>
        </div>

        <form @submit.prevent="handleVerify" class="space-y-10 relative">
          <div class="flex justify-between items-center gap-2">
            <input
              v-for="(digit, index) in 6"
              :key="index"
              :id="'otp-' + index"
              v-model="digits[index]"
              type="text"
              maxlength="1"
              inputmode="numeric"
              autocomplete="one-time-code"
              class="w-12 h-16 text-center text-2xl font-black bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-amber-400 focus:ring-8 focus:ring-amber-400/5 transition-all outline-none shadow-sm"
              @input="handleInput($event, index)"
              @keydown.backspace="handleBackspace(index)"
              @paste="handlePaste"
              required
            />
          </div>

          <div class="space-y-6">
            <button 
              type="submit" 
              :disabled="loading || digits.join('').length < 6"
              class="w-full bg-[#033958] hover:bg-[#022f42] text-white font-black py-4 rounded-[1.5rem] shadow-2xl shadow-[#033958]/20 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 active:scale-95"
            >
              <span v-if="loading" class="flex items-center gap-2">
                <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
                Verifying...
              </span>
              <template v-else>
                Verify & Continue
                <Icon name="lucide:arrow-right" class="w-5 h-5 group-hover:translate-x-1 duration-300 text-amber-300" />
              </template>
            </button>

            <div class="flex flex-col items-center gap-4">
                <button type="button" @click="resendOtp" :disabled="resending" class="text-xs font-black text-amber-600 hover:text-amber-700 uppercase tracking-widest transition-colors flex items-center gap-2">
                    <Icon name="lucide:refresh-cw" :class="['w-4 h-4', resending ? 'animate-spin' : '']" />
                    {{ resending ? 'Sending...' : 'Resend Code' }}
                </button>
                <NuxtLink to="/login" class="text-[10px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-tighter flex items-center gap-1 transition-all">
                    <Icon name="lucide:arrow-left" class="w-3 h-3" />
                    Back to Login
                </NuxtLink>
            </div>
          </div>
        </form>
      </div>

      <div class="mt-10 text-center">
        <p class="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <Icon name="lucide:shield-check" class="w-3 h-3" />
            Secure Verification
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth_api } from '@/api_factory/modules/auth'
import { useAuthState } from "@/composables/useAuthState"
import { useCustomToast } from "@/composables/core/useCustomToast"

definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const { showToast } = useCustomToast()
const { setAuth } = useAuthState()

const email = ref(route.query.email as string || '')
const digits = ref(['', '', '', '', '', ''])
const loading = ref(false)
const resending = ref(false)
const mounted = ref(false)

onMounted(() => {
  setTimeout(() => mounted.value = true, 100)
  if (!email.value) router.push('/login')
  
  // Focus first input
  const firstInput = document.getElementById('otp-0')
  if (firstInput) firstInput.focus()
})

function handleInput(event: Event, index: number) {
  const input = event.target as HTMLInputElement
  const value = input.value

  if (!/^\d*$/.test(value)) {
    digits.value[index] = ''
    return
  }

  if (value && index < 5) {
    const nextInput = document.getElementById(`otp-${index + 1}`)
    nextInput?.focus()
  }
}

function handleBackspace(index: number) {
  if (!digits.value[index] && index > 0) {
    const prevInput = document.getElementById(`otp-${index - 1}`)
    prevInput?.focus()
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const text = event.clipboardData?.getData('text') || ''
  const pastedDigits = text.replace(/\D/g, '').split('').slice(0, 6)
  
  pastedDigits.forEach((digit, idx) => {
    digits.value[idx] = digit
  })

  const nextIdx = Math.min(pastedDigits.length, 5)
  document.getElementById(`otp-${nextIdx}`)?.focus()
}

async function handleVerify() {
  const otpCode = digits.value.join('')
  if (otpCode.length !== 6) return
  
  loading.value = true
  try {
    const res = await auth_api.verifyLoginOtp({
      email: email.value,
      otpCode
    }) as any

    if (res.data) {
      const { user, tokens } = res.data
      setAuth(user, tokens)
      showToast({ title: "Welcome Back", message: "Verification successful!", toastType: "success" })
      router.push('/')
    }
  } catch (err: any) {
    showToast({ title: "Error", message: err.message || "Verification failed", toastType: "error" })
  } finally {
    loading.value = false
  }
}

async function resendOtp() {
  resending.value = true
  try {
    await auth_api.forgotPassword({ email: email.value })
    showToast({ title: "Success", message: "New code sent to your email", toastType: "success" })
  } catch (e: any) {
    showToast({ title: "Error", message: e.message || "Failed to resend code", toastType: "error" })
  } finally {
    resending.value = false
  }
}
</script>
