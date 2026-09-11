<template>
  <div class="group relative flex flex-col overflow-hidden rounded-[24px] bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-gray-100/80">
    <NuxtLink :to="`/products/${product.id}`" class="relative block aspect-[4/5] overflow-hidden bg-[#F5F5F5]">
      <img
        :src="product.image || 'https://via.placeholder.com/400'"
        :alt="product.name"
        class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      
      <!-- Out of Stock Overlay -->
      <div v-if="product.stock === 0" class="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
        <div class="bg-black text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider transform -rotate-12 border-2 border-white shadow-sm">
          Habis
        </div>
      </div>
    </NuxtLink>
    
    <div class="flex flex-1 flex-col p-5">
      <div class="mb-1.5 text-xs font-semibold text-indigo-500 uppercase tracking-widest">{{ product.category }}</div>
      <NuxtLink :to="`/products/${product.id}`" class="mb-3 line-clamp-2 text-[15px] leading-snug font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
        {{ product.name }}
      </NuxtLink>
      <div class="mt-auto flex items-center justify-between">
        <span class="text-base sm:text-lg font-extrabold text-gray-900 truncate pr-2">{{ formatRupiah(product.price) }}</span>
        <button
          v-if="product.stock > 0"
          @click.prevent="handleAddToCart"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-all duration-300 hover:bg-indigo-600 hover:text-white sm:opacity-0 sm:group-hover:opacity-100 shadow-sm hover:shadow-indigo-500/40 hover:scale-110"
          aria-label="Tambah ke keranjang"
        >
          <div class="i-heroicons-shopping-bag-20-solid h-4 w-4"></div>
        </button>
        <div v-else class="text-xs font-bold text-red-500 uppercase tracking-wide">
          HABIS
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import { useUiStore } from '~/stores/ui'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const authStore = useAuthStore()
const cartStore = useCartStore()
const uiStore = useUiStore()
const route = useRoute()

const handleAddToCart = async () => {
  if (!authStore.isAuthenticated) {
    return navigateTo({ path: '/auth/login', query: { redirect: route.path } })
  }
  
  try {
    await cartStore.addItem(props.product.id, 1)
    uiStore.isCartDrawerOpen = true
  } catch (error: any) {
    alert(error?.data?.message || 'Gagal menambahkan produk ke keranjang')
  }
}

const formatRupiah = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}
</script>
