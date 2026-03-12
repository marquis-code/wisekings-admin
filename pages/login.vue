<template>
  <div class="space-y-12">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-1 bg-emerald-400 rounded-full"></div>
        <span class="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Secure Gateway</span>
      </div>
      <h2 class="text-5xl font-black text-gray-900 tracking-tighter leading-none">System Core <br/><span class="text-gray-400">Access.</span></h2>
      <p class="text-gray-400 font-medium text-sm leading-relaxed max-w-sm">Authorized personnel only. Please verify your administrative credentials to continue.</p>
    </div>

    <form @submit.prevent="login()" class="space-y-10">
      <!-- Standard Login -->
      <div class="space-y-8">
        <div class="space-y-3">
          <label class="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">Credential Identifier</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#033958]">
              <Icon name="lucide:user-cog" class="w-5 h-5 text-gray-300" />
            </div>
            <input 
              v-model="credentials.email"
              type="email"
              placeholder="operator@wisekings.systems"
              class="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-bold text-gray-900 focus:ring-8 focus:ring-[#033958]/5 focus:border-[#033958] outline-none transition-all placeholder:text-gray-300 shadow-sm"
              required
            />
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between px-4">
            <label class="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Security Key</label>
            <NuxtLink to="/forgot-password" class="text-[9px] font-black uppercase tracking-[0.2em] text-[#033958] hover:underline">Reset Authority</NuxtLink>
          </div>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#033958]">
              <Icon name="lucide:lock-keyhole" class="w-5 h-5 text-gray-300" />
            </div>
            <input 
              v-model="credentials.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••••••"
              class="w-full pl-14 pr-14 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-bold text-gray-900 focus:ring-8 focus:ring-[#033958]/5 focus:border-[#033958] outline-none transition-all placeholder:text-gray-300 shadow-sm"
              required
            />
            <button @click="showPassword = !showPassword" type="button" class="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors">
              <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div class="pt-4">
        <button
          type="submit"
          class="w-full py-6 rounded-[2rem] bg-[#033958] text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-[#033958]/40 hover:bg-[#044a70] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
          :disabled="loading"
        >
          <Icon v-if="loading" name="lucide:refresh-cw" class="w-5 h-5 animate-spin" />
          <span class="relative z-10">{{ loading ? 'Establishing Link...' : 'Initiate Session' }}</span>
          <Icon v-if="!loading" name="lucide:arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div class="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-center">
        <p class="text-[10px] font-bold text-gray-400">
          Internal recruitment only. <NuxtLink to="/signup" class="text-[#033958] hover:underline font-black ml-1">Request Operational Access</NuxtLink>
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
