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
        Buat Akun Baru
      </h2>
      <p class="mt-2 text-center text-sm text-gray-500">
        Sudah punya akun?
        <NuxtLink to="/auth/login" class="font-medium text-[#18181B] hover:underline">
          Masuk di sini
        </NuxtLink>
      </p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 shadow-sm border border-gray-100 sm:rounded-3xl sm:px-12">
        <form class="space-y-6" @submit.prevent="handleRegister">
          <AppInput
            v-model="name"
            label="Nama Lengkap"
            placeholder="John Doe"
            required
          />

          <AppInput
            v-model="email"
            label="Email"
            type="email"
            placeholder="nama@email.com"
            required
          />

          <AppInput
            v-model="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
          />
          
          <AppInput
            v-model="confirmPassword"
            label="Konfirmasi Password"
            type="password"
            placeholder="••••••••"
            required
          />

          <AppButton type="submit" size="lg" class="w-full" :loading="isLoading">
            Daftar Sekarang
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

definePageMeta({
  layout: 'auth'
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Password tidak cocok')
    return
  }
  
  isLoading.value = true
  try {
    const res = await authStore.register(name.value, email.value, password.value)
    if (res.success) {
      const cartStore = useCartStore()
      await cartStore.fetchCart() // Fetch cart after registration
      
      const redirectPath = route.query.redirect as string || '/'
      router.push(redirectPath)
    }
  } catch (error: any) {
    const errorData = error?.response?._data
    if (errorData?.errors && Array.isArray(errorData.errors)) {
      const messages = errorData.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join('\n')
      alert(`Pendaftaran gagal:\n${messages}`)
    } else {
      alert(errorData?.message || 'Pendaftaran gagal.')
    }
  } finally {
    isLoading.value = false
  }
}
</script>
