<template>
  <div class="space-y-2">
    <NuxtLink v-if="authStore.isAdmin" to="/admin" class="block px-4 py-3 rounded-xl text-blue-600 hover:bg-page font-medium transition-colors">Dasbor Admin</NuxtLink>
    <NuxtLink to="/" class="block px-4 py-3 rounded-xl text-primary hover:bg-page transition-colors">Kembali ke Beranda</NuxtLink>
    
    <div class="my-4 border-t border-gray-100"></div>

    <NuxtLink to="/account" class="block px-4 py-3 rounded-xl text-primary hover:bg-page transition-colors" active-class="bg-page font-medium" exact>Profil</NuxtLink>
    <NuxtLink to="/account/orders" class="block px-4 py-3 rounded-xl text-primary hover:bg-page transition-colors" active-class="bg-page font-medium">Pesanan Saya</NuxtLink>
    <button @click="logout" class="w-full text-left px-4 py-3 rounded-xl text-danger hover:bg-red-50 transition-colors">Keluar</button>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const logout = async () => {
  await authStore.logout()
  router.push('/auth/login')
}
</script>
