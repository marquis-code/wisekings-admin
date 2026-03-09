<template>
  <div class="min-h-screen flex items-center justify-center bg-dark-950 p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 items-center justify-center mb-4">
          <span class="text-2xl font-bold text-white">WK</span>
        </div>
        <h1 class="text-2xl font-bold text-white">WiseKings Admin</h1>
        <p class="text-dark-400 mt-1">Sign in to your admin account</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="login" class="card space-y-5">
        <div>
          <label class="label">Email</label>
          <input
            v-model="credentials.email"
            type="email"
            class="input"
            placeholder="admin@wisekings.ng"
            required
            autocomplete="email"
          />
        </div>

        <div>
          <label class="label">Password</label>
          <div class="relative">
            <input
              v-model="credentials.password"
              :type="showPassword ? 'text' : 'password'"
              class="input pr-10"
              placeholder="••••••••"
              required
              autocomplete="current-password"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200"
            >
              <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 text-dark-400">
            <input type="checkbox" v-model="rememberMe" class="rounded bg-dark-800 border-dark-600 text-primary-600 focus:ring-primary-500" />
            Remember me
          </label>
          <NuxtLink to="/forgot-password" class="text-primary-400 hover:text-primary-300">
            Forgot password?
          </NuxtLink>
        </div>

        <button
          type="submit"
          class="btn-primary w-full"
          :disabled="loading"
        >
          <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
          <span>{{ loading ? 'Signing in...' : 'Sign in' }}</span>
        </button>

        <p v-if="errorMessage" class="text-red-400 text-sm text-center">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogin } from '@/composables/modules/auth/useLogin';

definePageMeta({ layout: 'default' })

const { credentials, login, loading, errorMessage } = useLogin();
const showPassword = ref(false)
const rememberMe = ref(false)
</script>
