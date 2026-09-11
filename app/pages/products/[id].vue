<template>
  <div class="relative min-h-screen bg-[#FAFAFA] py-8 sm:py-12 overflow-hidden">
    <!-- Decorative Gradients -->
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-200/40 via-indigo-100/30 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none -translate-y-1/3 translate-x-1/4"></div>

    <div class="relative z-10 app-container">
      
      <div v-if="pending" class="py-12 text-center text-gray-500">Memuat produk...</div>
      
      <template v-else-if="product">
        <!-- Breadcrumb -->
        <AppScrollReveal>
          <nav class="mb-8 flex text-sm text-gray-500">
            <NuxtLink to="/" class="hover:text-indigo-700 transition-colors">Home</NuxtLink>
            <span class="mx-2">/</span>
            <NuxtLink to="/products" class="hover:text-indigo-700 transition-colors">Produk</NuxtLink>
            <span class="mx-2">/</span>
            <span class="text-indigo-900 font-medium">{{ product.name }}</span>
          </nav>
        </AppScrollReveal>

        <div class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        <!-- Image Gallery -->
        <div class="mb-10 lg:mb-0">
          <AppScrollReveal :delay="100">
            <div class="group aspect-square w-full overflow-hidden rounded-3xl bg-[#F5F5F5] border border-gray-100/80 shadow-sm relative">
              <div class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
              <img
                :src="currentImage"
                :alt="product.name"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </AppScrollReveal>
          <!-- Thumbnails -->
          <AppScrollReveal :delay="200">
            <div class="mt-4 grid grid-cols-4 gap-4" v-if="product.images?.length > 1">
              <div 
                v-for="(img, index) in product.images" 
                :key="img.id" 
                @click="activeImageIndex = index"
                :class="['aspect-square cursor-pointer overflow-hidden rounded-2xl bg-[#F5F5F5] transition-all duration-300 transform', activeImageIndex === index ? 'ring-2 ring-indigo-600 opacity-100 scale-100 shadow-md' : 'opacity-60 hover:opacity-100 hover:scale-105']"
              >
                <img :src="img.imageUrl" class="h-full w-full object-cover" />
              </div>
            </div>
          </AppScrollReveal>
        </div>

        <!-- Product Info -->
        <div class="flex flex-col">
          <AppScrollReveal :delay="300">
            <div class="mb-6">
              <h2 class="text-sm font-bold tracking-widest text-indigo-500 uppercase">{{ product.category?.name || 'Kategori' }}</h2>
              <h1 class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">{{ product.name }}</h1>
            </div>

          <div class="mb-6 flex items-center justify-between">
            <p class="text-3xl font-bold text-gray-900">{{ formatRupiah(product.price) }}</p>
            <AppBadge :variant="product.stock > 0 ? 'success' : 'danger'" :text="product.stock > 0 ? 'Tersedia' : 'Habis'" />
          </div>

          <div class="mb-8 prose prose-sm text-gray-500">
            <p>{{ product.description }}</p>
          </div>
          </AppScrollReveal>

          <AppScrollReveal :delay="500">
          <div class="mt-auto border-t border-gray-100 pt-8">
            <div class="mb-6 flex items-center gap-4">
              <span class="text-sm font-medium text-gray-700">Jumlah</span>
              <div class="flex items-center rounded-xl border border-gray-200">
                <button @click="quantity > 1 && quantity--" class="px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50" :disabled="quantity <= 1">
                  <div class="i-heroicons-minus h-4 w-4"></div>
                </button>
                <span class="w-12 text-center font-medium">{{ quantity }}</span>
                <button @click="quantity < product.stock && quantity++" class="px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50" :disabled="quantity >= product.stock">
                  <div class="i-heroicons-plus h-4 w-4"></div>
                </button>
              </div>
              <span class="text-sm text-gray-500">Tersisa {{ product.stock }} barang</span>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <AppButton size="lg" variant="secondary" class="w-full shadow-sm hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-md transition-all duration-300" :disabled="product.stock === 0" @click="addToCart">
                Tambah ke Keranjang
              </AppButton>
              <AppButton size="lg" variant="primary" class="w-full shadow-md shadow-indigo-600/20 hover:shadow-xl hover:-translate-y-1 hover:shadow-indigo-600/30 transition-all duration-300" :disabled="product.stock === 0" @click="buyNow">
                Beli Sekarang
              </AppButton>
            </div>
          </div>
          </AppScrollReveal>
        </div>
      </div>
      
        <!-- Reviews Section -->
        <AppScrollReveal>
        <div class="mt-16 border-t border-gray-100 pt-16">
          <h3 class="text-2xl font-bold text-gray-900 mb-8">Ulasan Pelanggan</h3>
          
          <div v-if="!product.reviews || product.reviews.length === 0" class="text-center py-12 bg-white rounded-3xl border border-gray-100">
            <Icon name="ph:chat-teardrop-text" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500">Belum ada ulasan untuk produk ini.</p>
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="review in product.reviews" :key="review.id" class="p-8 bg-white rounded-3xl border border-indigo-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300">
              <div class="flex items-center justify-between mb-5">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-extrabold uppercase shadow-sm">
                    {{ review.user?.name?.charAt(0) || 'U' }}
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900">{{ review.isAnonymous ? formatName(review.user?.name) : (review.user?.name || 'Pengguna') }}</h4>
                    <p class="text-xs font-medium text-gray-400 mt-0.5">{{ formatDate(review.createdAt) }}</p>
                  </div>
                </div>
                <div class="flex gap-1 bg-indigo-50/50 px-3 py-1.5 rounded-full">
                  <span v-for="star in 5" :key="star" class="text-sm" :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-200'">
                    ★
                  </span>
                </div>
              </div>
              <p class="text-gray-600 text-[15px] leading-relaxed">{{ review.comment || 'Tidak ada komentar.' }}</p>
            </div>
          </div>
        </div>
        </AppScrollReveal>
      </template>

      <div v-else class="py-12 text-center text-gray-500">
        Produk tidak ditemukan.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '~/stores/cart'
import { useUiStore } from '~/stores/ui'
import { useApi } from '~/composables/useApi'
import type { Product, ApiResponse } from '~/types'

const route = useRoute()
const quantity = ref(1)
const cartStore = useCartStore()
const uiStore = useUiStore()
const { api } = useApi()

const { data: productResponse, pending } = await useAsyncData(
  `product-${route.params.id}-` + Date.now(),
  () => api.get<ApiResponse<Product>>(`/products/${route.params.id}`)
)

const product = computed(() => productResponse.value?.data || null)

const activeImageIndex = ref(0)
const currentImage = computed(() => {
  if (product.value?.images?.length > 0) {
    return product.value.images[activeImageIndex.value]?.imageUrl || 'https://via.placeholder.com/800'
  }
  return 'https://via.placeholder.com/800'
})

const formatRupiah = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

const formatName = (name: string) => {
  if (!name) return 'Pengguna'
  if (name.length <= 1) return name
  return name.charAt(0) + '*'.repeat(name.length - 1)
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(dateString))
}

const addToCart = async () => {
  if (!product.value) return
  
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    return navigateTo({ path: '/auth/login', query: { redirect: route.path } })
  }
  
  try {
    await cartStore.addItem(product.value.id, quantity.value)
    uiStore.isCartDrawerOpen = true
  } catch (error: any) {
    alert(error?.data?.message || 'Gagal menambahkan produk ke keranjang')
  }
}

const buyNow = async () => {
  if (!product.value) return
  
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    return navigateTo({ path: '/auth/login', query: { redirect: route.path } })
  }
  
  navigateTo({
    path: '/checkout',
    query: {
      productId: product.value.id,
      quantity: quantity.value
    }
  })
}
</script>
