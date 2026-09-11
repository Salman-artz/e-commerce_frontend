<script setup lang="ts">
import { onMounted } from 'vue'
import { Toaster } from 'vue-sonner'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()

onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      await authStore.fetchMe()
      await cartStore.fetchCart()
    } catch (error) {
      console.error('Failed to initialize session data', error)
    }
  }
})
</script>

<template>
  <div class="overflow-x-hidden min-h-screen w-full flex flex-col">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <CartDrawer />
    <Toaster position="top-right" richColors />
  </div>
</template>
