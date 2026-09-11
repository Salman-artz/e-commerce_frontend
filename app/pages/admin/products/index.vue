<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-primary">Daftar Produk</h1>
      <AppButton @click="navigateTo('/admin/products/create')">Tambah Produk</AppButton>
    </div>

    <div class="bg-surface rounded-xl border border-border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-page border-b border-border">
              <th class="py-3 px-6 text-sm font-medium text-secondary">Nama Produk</th>
              <th class="py-3 px-6 text-sm font-medium text-secondary">Harga</th>
              <th class="py-3 px-6 text-sm font-medium text-secondary">Stok</th>
              <th class="py-3 px-6 text-sm font-medium text-secondary">Kategori</th>
              <th class="py-3 px-6 text-sm font-medium text-secondary text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pending" class="border-b border-border">
              <td colspan="5" class="py-8 text-center text-secondary">Memuat data...</td>
            </tr>
            <tr v-else-if="!products || products.length === 0" class="border-b border-border">
              <td colspan="5" class="py-8 text-center text-secondary">Tidak ada produk ditemukan.</td>
            </tr>
            <tr v-else v-for="product in products" :key="product.id" class="border-b border-border hover:bg-page/50">
              <td class="py-3 px-6 text-sm text-primary font-medium">{{ product.name }}</td>
              <td class="py-3 px-6 text-sm text-primary">Rp {{ product.price.toLocaleString('id-ID') }}</td>
              <td class="py-3 px-6 text-sm text-primary">{{ product.stock }}</td>
              <td class="py-3 px-6 text-sm text-primary">{{ product.category?.name || '-' }}</td>
              <td class="py-3 px-6 text-sm text-right">
                <NuxtLink :to="`/admin/products/${product.id}`" class="text-brand hover:underline text-sm font-medium">Edit</NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const config = useRuntimeConfig()
const { data: products, pending } = await useFetch<any>('/products', {
  baseURL: config.public.apiBase,
  key: 'admin-products-' + Date.now(),
  transform: (res: any) => res.data || []
})
</script>
