<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import { useUiStore } from '~/stores/ui'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const uiStore = useUiStore()

const searchQuery = ref('')
const isMobileMenuOpen = ref(false)

const cartItemCount = computed(() => cartStore.cartCount)
const isLoggedIn = computed(() => authStore.isAuthenticated)

const handleSearch = () => {
  if (searchQuery.value) {
    router.push({ path: '/products', query: { q: searchQuery.value } })
    searchQuery.value = ''
  }
}
</script>

<template>
  <header class="h-[72px] bg-white/70 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-50 transition-all duration-300">
    <div class="app-container h-full flex items-center justify-between">
      
      <!-- Logo & Main Nav -->
      <div class="flex items-center gap-8">
        <NuxtLink to="/" class="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 shrink-0">
          ArtzShop
        </NuxtLink>
        
        <nav class="hidden md:flex gap-6">
          <NuxtLink to="/products" class="text-sm font-medium text-textSecondary hover:text-accent transition-colors">
            Katalog
          </NuxtLink>
        </nav>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-4">
        <button @click="uiStore.isCartDrawerOpen = true" class="relative p-2 text-textSecondary hover:text-accent transition-colors">
          <Icon name="ph:shopping-cart" class="w-6 h-6" />
          <span v-if="cartItemCount > 0" class="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
            {{ cartItemCount }}
          </span>
        </button>

        <div class="hidden md:flex items-center gap-2.5">
          <NuxtLink v-if="authStore.isAdmin" to="/admin" class="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold hover:bg-indigo-100 hover:scale-105 transition-all duration-300">
            Dasbor Admin
          </NuxtLink>
          <NuxtLink v-if="!isLoggedIn" to="/auth/login" class="px-5 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-300">
            Masuk
          </NuxtLink>
          <NuxtLink v-else to="/account" class="p-2 flex items-center text-gray-500 hover:text-indigo-600 transition-colors">
            <Icon name="ph:user-circle" class="w-6 h-6" />
          </NuxtLink>
        </div>

        <button class="md:hidden p-2 text-textSecondary hover:text-accent" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <Icon :name="isMobileMenuOpen ? 'ph:x' : 'ph:list'" class="w-6 h-6" />
        </button>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-b border-gray-200 absolute w-full px-4 py-4 space-y-4 shadow-sm">
      <NuxtLink to="/products" class="block text-base font-medium text-gray-900" @click="isMobileMenuOpen = false">Katalog</NuxtLink>
      <div class="pt-4 border-t border-gray-100">
        <NuxtLink v-if="authStore.isAdmin" to="/admin" class="block w-full text-center bg-gray-100 text-gray-800 py-2 rounded-xl text-sm font-medium mb-3" @click="isMobileMenuOpen = false">Dasbor Admin</NuxtLink>
        <NuxtLink v-if="!isLoggedIn" to="/auth/login" class="block w-full text-center bg-black text-white py-2 rounded-xl text-sm font-medium" @click="isMobileMenuOpen = false">Masuk</NuxtLink>
        <NuxtLink v-else to="/account" class="block text-base font-medium text-gray-900" @click="isMobileMenuOpen = false">Akun Saya</NuxtLink>
      </div>
    </div>
  </header>
</template>
