<template>
  <div class="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      @add-to-cart="$emit('add-to-cart', $event)"
    />
  </div>
  <div v-if="products.length === 0" class="col-span-full py-12">
    <AppEmptyState
      icon="i-heroicons-magnifying-glass"
      title="Produk tidak ditemukan"
      description="Coba gunakan kata kunci lain atau ubah filter pencarian."
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  }
})

defineEmits(['add-to-cart'])
</script>
