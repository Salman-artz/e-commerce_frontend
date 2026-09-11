<template>
  <div class="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#FAFAFA]">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <NuxtLink to="/" class="inline-block">
        <!-- Mock Logo -->
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#18181B] text-white font-bold text-xl">
          E
        </div>
      </NuxtLink>
      <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Selamat Datang Kembali
      </h2>
      <p class="mt-2 text-center text-sm text-gray-500">
        Belum punya akun?
        <NuxtLink to="/auth/register" class="font-medium text-[#18181B] hover:underline">
          Daftar sekarang
        </NuxtLink>
      </p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 shadow-sm border border-gray-100 sm:rounded-3xl sm:px-12">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <AppInput
            v-model="email"
            label="Email"
            type="email"
            placeholder="nama@email.com"
            required
          />

          <div>
            <AppInput
              v-model="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              required
            />
            <div class="mt-2 text-right">
              <a href="#" class="text-sm font-medium text-gray-500 hover:text-gray-900">Lupa password?</a>
            </div>
          </div>

          <AppButton type="submit" size="lg" class="w-full" :loading="isLoading">
            Masuk
          </AppButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

// Use a custom layout for auth pages if desired, here just explicit
definePageMeta({
  layout: 'auth'
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  try {
    const res = await authStore.login(email.value, password.value)
    if (res.success) {
      const cartStore = useCartStore()
      await cartStore.fetchCart() // Fetch cart after login
      
      let redirectPath = route.query.redirect as string || '/'
      
      if (authStore.isAdmin && !redirectPath.startsWith('/admin')) {
        redirectPath = '/admin'
      }
      
      router.push(redirectPath)
    }
  } catch (error: any) {
    alert(error?.response?._data?.message || 'Login gagal, periksa email dan password Anda.')
  } finally {
    isLoading.value = false
  }
}
</script>
