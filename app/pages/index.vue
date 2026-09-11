<template>
  <div class="relative min-h-screen bg-[#FAFAFA] overflow-hidden">
    <!-- Decorative Background Gradients (Uniform Indigo) -->
    <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-400/30 to-transparent blur-3xl pointer-events-none"></div>
    <div class="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-indigo-300/30 to-transparent blur-3xl pointer-events-none"></div>
    
    <div class="relative z-10 app-container py-12 md:py-20">
      <!-- Hero Section -->
      <AppScrollReveal animation="blur-in">
        <section class="mb-20 text-center">
          <h1 class="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl/tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 via-indigo-700 to-indigo-500 drop-shadow-sm">
            TEMUKAN PRODUK<br class="hidden sm:block" />YANG KAMU CARI
          </h1>
          <p class="mx-auto mb-10 max-w-2xl text-base text-gray-500 font-medium sm:text-lg">
            Koleksi premium dengan desain elegan untuk gaya hidup modern Anda.
          </p>
        
        <div class="mx-auto max-w-xl">
          <div class="relative flex items-center w-full">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <div class="i-heroicons-magnifying-glass w-5 h-5"></div>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari sepatu, pakaian, atau aksesoris..."
              class="block w-full rounded-full border border-indigo-100/80 bg-white/90 backdrop-blur-md py-4 pl-12 pr-28 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 hover:shadow-md hover:border-indigo-200"
              @keyup.enter="handleSearch"
            />
            <AppButton class="absolute right-2 h-auto py-2 px-6 rounded-full shadow-sm hover:scale-105 transition-transform" @click="handleSearch">
              Cari
            </AppButton>
          </div>
        </div>
        
        <AppScrollReveal animation="zoom-in" :delay="200">
          <div class="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
            <button v-for="cat in categories" :key="cat" class="rounded-full bg-white/90 backdrop-blur-sm px-6 py-2.5 text-sm font-bold text-indigo-800 shadow-sm border border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-indigo-500/10">
              {{ cat }}
            </button>
          </div>
        </AppScrollReveal>
        </section>
      </AppScrollReveal>

      <!-- Latest Products -->
      <AppScrollReveal animation="fade-up" :delay="100">
        <section class="mb-24">
        <div class="mb-8 flex items-center justify-between">
          <h2 class="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Produk Terbaru</h2>
          <NuxtLink to="/products" class="group flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            Lihat Semua <Icon name="ph:arrow-right-bold" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
        </div>
        
          <ProductGrid :products="latestProducts" />
        </section>
      </AppScrollReveal>

      <!-- Trust Badges -->
      <section class="relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl shadow-indigo-900/5 border border-indigo-50 sm:p-14">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/30 pointer-events-none"></div>
        <div class="relative grid grid-cols-1 gap-8 md:grid-cols-3 text-center sm:gap-12">
          
          <AppScrollReveal animation="fade-right" :delay="200" class="flex flex-col items-center group">
              <div class="mb-5 flex h-20 w-20 items-center justify-center rounded-[20px] bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-indigo-600/30">
                <div class="i-heroicons-shield-check-20-solid h-9 w-9"></div>
              </div>
              <h3 class="mb-3 text-xl font-bold tracking-tight text-gray-900">Aman & Terpercaya</h3>
              <p class="text-sm font-medium text-gray-500 leading-relaxed">Pembayaran dijamin aman dengan berbagai metode terverifikasi.</p>
          </AppScrollReveal>
          
          <AppScrollReveal animation="zoom-in" :delay="400" class="flex flex-col items-center group">
            <div class="mb-5 flex h-20 w-20 items-center justify-center rounded-[20px] bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:-rotate-6 transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-indigo-600/30">
                <div class="i-heroicons-truck-20-solid h-9 w-9"></div>
              </div>
              <h3 class="mb-3 text-xl font-bold tracking-tight text-gray-900">Gratis Ongkir</h3>
              <p class="text-sm font-medium text-gray-500 leading-relaxed">Nikmati pengiriman gratis ke seluruh Indonesia tanpa syarat.</p>
          </AppScrollReveal>
          
          <AppScrollReveal animation="fade-left" :delay="600" class="flex flex-col items-center group">
            <div class="mb-5 flex h-20 w-20 items-center justify-center rounded-[20px] bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-indigo-600/30">
                <div class="i-heroicons-chat-bubble-left-right-20-solid h-9 w-9"></div>
              </div>
              <h3 class="mb-3 text-xl font-bold tracking-tight text-gray-900">Support 24/7</h3>
              <p class="text-sm font-medium text-gray-500 leading-relaxed">Tim kami siap membantu Anda kapanpun Anda butuhkan.</p>
          </AppScrollReveal>
          
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { PaginatedResponse, Product } from '~/types'

const router = useRouter()
const config = useRuntimeConfig()
const searchQuery = ref('')

const categories = ['Pakaian', 'Sepatu', 'Aksesoris', 'Elektronik']

const handleSearch = () => {
  if (searchQuery.value) {
    router.push({ path: '/products', query: { q: searchQuery.value } })
  }
}

const { data: productData } = await useAsyncData('latestProducts-' + Date.now(), () =>
  $fetch<PaginatedResponse<Product>>('/products', {
    baseURL: config.public.apiBase as string,
    query: { limit: 5, sort: 'newest' }
  })
)

const latestProducts = computed(() => {
  return (productData.value?.data || []).map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    stock: p.stock,
    category: p.category?.name || 'Uncategorized',
    image: p.images?.[0]?.imageUrl || ''
  }))
})
</script>
