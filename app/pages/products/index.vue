<template>
  <div class="relative min-h-screen bg-[#FAFAFA] py-8 overflow-hidden">
    <!-- Decorative Gradients -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-indigo-300/40 via-indigo-200/30 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
    <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-200/40 via-indigo-100/30 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none translate-y-1/3 -translate-x-1/4"></div>
    
    <div class="relative z-10 app-container py-8">
      
      <!-- Header & Search -->
      <AppScrollReveal>
        <div class="mb-12">
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors mb-6 group">
            <div class="i-heroicons-arrow-left-20-solid w-4 h-4 group-hover:-translate-x-1 transition-transform"></div>
            Kembali ke Beranda
          </NuxtLink>
          <h1 class="mb-8 text-4xl font-extrabold tracking-tight text-indigo-950 md:text-5xl">Katalog Produk</h1>
        <div class="relative">
          <AppInput
            v-model="search"
            placeholder="Cari produk..."
            class="max-w-2xl"
          >
            <template #icon>
              <div class="i-heroicons-magnifying-glass"></div>
            </template>
          </AppInput>
        </div>
      </div>

      <!-- Filters & Sort -->
      <div class="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <!-- Categories (Scrollable horizontally) -->
        <div class="flex overflow-x-auto pb-2 scrollbar-hide space-x-3 w-full sm:w-auto mask-fade-edges">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="activeCategory = cat.id"
            :class="[
              'whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 shadow-sm border',
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-indigo-700 to-indigo-500 text-white border-transparent shadow-indigo-500/30 shadow-md scale-105'
                : 'bg-white/80 backdrop-blur-sm text-indigo-700 border-indigo-100 hover:bg-indigo-50 hover:text-indigo-900 hover:border-indigo-300 hover:-translate-y-0.5'
            ]"
          >
            {{ cat.name }}
          </button>
        </div>

        <!-- Sort -->
        <div class="shrink-0">
          <select
            v-model="sortBy"
            class="block w-full rounded-2xl border border-indigo-100 bg-white/80 backdrop-blur-sm px-5 py-2.5 pr-10 text-sm font-medium text-indigo-900 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 hover:border-indigo-300 transition-all shadow-sm"
          >
            <option value="newest">Terbaru</option>
            <option value="price_asc">Harga: Rendah ke Tinggi</option>
            <option value="price_desc">Harga: Tinggi ke Rendah</option>
          </select>
        </div>
      </div>
      </AppScrollReveal>

      <!-- Grid -->
      <AppScrollReveal :delay="200">
        <div class="mb-12">
          <ProductGrid :products="products" />
        </div>
      </AppScrollReveal>

      <!-- Pagination -->
      <div v-if="products.length > 0" class="flex justify-center">
        <AppPagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="currentPage = $event"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import type { ApiResponse, PaginatedResponse, Product, Category } from '~/types'

const route = useRoute()
const router = useRouter()
const { api } = useApi()
const config = useRuntimeConfig()

const search = ref((route.query.q as string) || '')
const activeCategory = ref((route.query.category as string) || 'all')
const sortBy = ref((route.query.sort as string) || 'newest')
const currentPage = ref(Number(route.query.page) || 1)

// Fetch Categories
const { data: categoryData } = await useAsyncData('categories', () =>
  $fetch<ApiResponse<Category[]>>('/categories', { baseURL: config.public.apiBase as string })
)
const categories = computed(() => {
  const cats = categoryData.value?.data || []
  return [{ id: 'all', name: 'Semua Produk' }, ...cats]
})

// Fetch Products
const { data: productData, refresh } = await useAsyncData('products-' + Date.now(), () =>
  $fetch<PaginatedResponse<Product>>('/products', {
    baseURL: config.public.apiBase as string,
    query: {
      page: currentPage.value,
      limit: 12,
      search: search.value || undefined,
      categoryId: activeCategory.value !== 'all' ? activeCategory.value : undefined,
    }
  }),
  { watch: [currentPage] } // only auto-watch page. We handle others manually to reset page to 1
)

const products = computed(() => {
  // Map backend format to component expectations if needed (e.g. image url)
  return (productData.value?.data || []).map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    stock: p.stock,
    category: p.category?.name || 'Uncategorized',
    image: p.images?.[0]?.imageUrl || ''
  }))
})
const totalPages = computed(() => productData.value?.pagination?.totalPages || 1)

// Sync state to URL and fetch
watch([search, activeCategory, sortBy], () => {
  currentPage.value = 1 // reset to page 1 on filter change
  router.push({
    query: {
      ...route.query,
      q: search.value || undefined,
      category: activeCategory.value !== 'all' ? activeCategory.value : undefined,
      sort: sortBy.value !== 'newest' ? sortBy.value : undefined,
      page: undefined // hide page=1 from url
    }
  })
  refresh()
})

watch(currentPage, () => {
  router.push({
    query: {
      ...route.query,
      page: currentPage.value > 1 ? currentPage.value : undefined
    }
  })
})
</script>
