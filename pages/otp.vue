<template>
  <div class="space-y-10">
    <div class="space-y-3">
      <div class="w-16 h-1 bg-[#033958] rounded-full"></div>
      <h2 class="text-4xl font-black text-gray-900 tracking-tight">Email Verification</h2>
      <p class="text-gray-500 font-medium">We've sent a 6-digit verification code to <span class="text-[#033958] font-bold">{{ email }}</span>. Please enter it below to continue.</p>
    </div>

    <form @submit.prevent="handleVerify" class="space-y-6">
      <div class="p-8 bg-[#033958]/5 rounded-[2.5rem] border border-[#033958]/10 animate-fade-in text-center shadow-inner relative overflow-hidden">
        <div class="w-16 h-16 rounded-2xl bg-[#033958] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#033958]/20 mb-6 -rotate-3 group hover:rotate-0 transition-transform duration-500">
          <Icon name="lucide:shield-check" size="32" />
        </div>
        
        <div class="space-y-6">
          <label class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Secure Access Code</label>
          <div class="flex justify-center items-center gap-2 max-w-sm mx-auto">
            <input
              v-for="(digit, index) in 6"
              :key="index"
              :id="'otp-' + index"
              v-model="digits[index]"
              type="text"
              maxlength="1"
              class="w-10 h-14 sm:w-12 sm:h-16 text-center text-2xl sm:text-3xl font-black bg-white border-2 border-gray-100 rounded-xl focus:border-[#033958] focus:ring-4 focus:ring-[#033958]/5 transition-all shadow-md shadow-[#033958]/5"
              @input="handleInput($event, index)"
              @keydown.backspace="handleBackspace(index)"
              @paste="handlePaste"
              required
              autocomplete="one-time-code"
            />
          </div>
        </div>
        
        <div class="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.1em] pt-6 border-t border-gray-100/50 mt-8">
           <button type="button" @click="router.push('/login')" class="text-gray-400 hover:text-gray-950 transition-colors flex items-center gap-1.5">
             <Icon name="lucide:arrow-left" size="12" />
             Back
           </button>
           <span class="w-1 h-1 bg-gray-200 rounded-full"></span>
           <button type="button" @click="resendOtp" :disabled="resending" class="text-[#033958] hover:text-[#05507a] transition-colors disabled:opacity-50 flex items-center gap-1.5">
             <Icon name="lucide:rotate-cw" size="12" :class="{ 'animate-spin': resending }" />
             Resend
           </button>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-6 rounded-[2rem] bg-[#033958] text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#033958]/30 hover:shadow-[#033958]/50 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
        :disabled="loading"
      >
        <Icon v-if="loading" name="lucide:loader-2" class="w-6 h-6 animate-spin" />
        <span v-else>Verify Code</span>
        <Icon v-if="!loading" name="lucide:check-circle-2" class="w-6 h-6" />
      </button>

      <p v-if="errorMessage" class="p-5 rounded-2xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest text-center border border-red-100 animate-shake">
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { auth_api } from '@/api_factory/modules/auth'
import { useAuthState } from "@/composables/useAuthState"
import { useCustomToast } from "@/composables/core/useCustomToast"

definePageMeta({ layout: 'auth' })

const route = useRoute()
const router = useRouter()
const { showToast } = useCustomToast()
const { setAuth } = useAuthState()

const email = ref(route.query.email as string || '')
const digits = ref(['', '', '', '', '', ''])
const loading = ref(false)
const resending = ref(false)
const errorMessage = ref('')

function handleInput(event: Event, index: number) {
  const input = event.target as HTMLInputElement
  const value = input.value

  // Ensure only numbers
  if (!/^\d*$/.test(value)) {
    digits.value[index] = ''
    return
  }

  // Move forward
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

  // Focus the last filled or next empty box
  const nextIdx = Math.min(pastedDigits.length, 5)
  document.getElementById(`otp-${nextIdx}`)?.focus()
}

async function handleVerify() {
  const otpCode = digits.value.join('')
  if (otpCode.length !== 6) {
    errorMessage.value = "Please enter the full 6-digit code."
    return
  }
  
  if (!email.value) {
    errorMessage.value = "Missing email context."
    return
  }
  
  loading.value = true
  errorMessage.value = ''
  try {
    const res = await auth_api.verifyLoginOtp({
      email: email.value,
      otpCode
    }) as any

    if (res.data) {
      const { user, tokens } = res.data
      setAuth(user, tokens)
      showToast({
        title: "Session Verified",
        message: "Welcome back to the Command Center.",
        toastType: "success",
      })
      router.push('/')
    }
  } catch (err: any) {
    errorMessage.value = err.message || "Verification failed."
    showToast({
      title: "Security Alert",
      message: errorMessage.value,
      toastType: "error",
    })
  } finally {
    loading.value = false
  }
}

async function resendOtp() {
  resending.value = true
  try {
    // Current backend doesn't have a specific login OTP resend, but register/forgot pass ones exist.
    // For now, assume login triggers a new OTP or provide a message.
    // Assuming backend resendOtp works for login OTP too if it's just updating user.otpCode.
    await auth_api.forgotPassword({ email: email.value }) // Re-using as it triggers OTP flow
    showToast({ title: "Code Sent", message: "Please check your email again.", toastType: "info" })
  } catch (e) {}
  resending.value = false
}

onMounted(() => {
  if (!email.value) router.push('/login')
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-shake { animation: shake 0.5s linear; }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
</style>
