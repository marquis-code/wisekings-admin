<template>
  <div class="space-y-12">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-1 bg-emerald-400 rounded-full"></div>
        <span class="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Admin Portal</span>
      </div>
      <h2 class="text-5xl font-black text-gray-900 tracking-tighter leading-none">Welcome <br/><span class="text-gray-400">Back.</span></h2>
      <p class="text-gray-400 font-medium text-sm leading-relaxed max-w-sm">Please enter your details to access the management console.</p>
    </div>

    <form @submit.prevent="login()" class="space-y-10">
      <!-- Standard Login -->
      <div class="space-y-2">
        <CoreAnimatedInput
          v-model="credentials.email"
          label="Email Address"
          type="email"
          placeholder="e.g. admin@wisekings.com"
          required
        >
          <template #right>
            <Icon name="lucide:mail" class="w-5 h-5 text-gray-300" />
          </template>
        </CoreAnimatedInput>

        <div class="space-y-4">
          <CoreAnimatedInput
            v-model="credentials.password"
            label="Password"
            type="password"
            placeholder="••••••••••••"
            required
          />
          <div class="flex justify-end px-1">
            <NuxtLink to="/forgot-password" class="text-[10px] font-black uppercase tracking-widest text-[#033958] hover:text-emerald-500 transition-colors">
              Forgot password?
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="pt-4">
        <button
          type="submit"
          class="w-full py-4 rounded-2xl bg-[#033958] text-white font-bold text-sm shadow-xl shadow-[#033958]/20 hover:bg-[#044a70] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          :disabled="loading"
        >
          <Icon v-if="loading" name="lucide:refresh-cw" class="w-5 h-5 animate-spin" />
          <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
          <Icon v-if="!loading" name="lucide:arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-center">
        <p class="text-xs font-bold text-gray-400">
          Not yet a member? <NuxtLink to="/signup" class="text-[#033958] hover:underline font-black ml-1">Request Account</NuxtLink>
        </p>
      </div>

      <p v-if="errorMessage" class="p-5 rounded-3xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-[0.2em] text-center border border-red-100 animate-shake shadow-lg shadow-red-500/10">
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>


<script setup lang="ts">
import { useLogin } from '@/composables/modules/auth/useLogin';

definePageMeta({ layout: 'auth' })

const { credentials, login, loading, errorMessage } = useLogin();
const showPassword = ref(false)
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-shake {
  animation: shake 0.5s linear;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style>
