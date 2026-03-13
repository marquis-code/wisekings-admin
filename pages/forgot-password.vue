<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-50/30">
    <div class="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
      <div class="text-center mb-8">
        <NuxtLink to="/login" class="inline-flex items-center text-sm font-bold text-[#033958] hover:underline mb-6 transition-all group">
          <Icon name="lucide:arrow-left" size="16" class="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </NuxtLink>
        <div class="inline-flex w-20 h-20 rounded-3xl bg-[#033958]/5 text-[#033958] items-center justify-center mb-6 border border-[#033958]/10 shadow-sm">
          <Icon name="lucide:key-round" size="32" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Forgot Password</h1>
        <p class="text-gray-500 mt-2">Enter your email to receive a reset link</p>
      </div>

      <form @submit.prevent="forgotPassword" class="space-y-6">
        <div class="space-y-1">
          <CoreAnimatedInput
            v-model="email"
            label="Email Address"
            type="email"
            required
            autocomplete="email"
          />
        </div>

        <div class="pt-4">
          <button
            type="submit"
            class="btn-primary w-full py-4 rounded-2xl text-base font-bold shadow-[#033958]/10 hover:shadow-xl hover:shadow-[#033958]/20 transition-all active:scale-[0.98] disabled:opacity-50"
            :disabled="loading"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="w-5 h-5 animate-spin mr-2" />
            <span>{{ loading ? 'Sending link...' : 'Send Reset Link' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForgotPassword } from '@/composables/modules/auth/useForgotPassword'

definePageMeta({
  layout: 'default'
})

const { email, forgotPassword, loading } = useForgotPassword()
</script>
