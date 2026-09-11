<template>
  <div class="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
    <div class="flex items-center justify-center pl-2">
      <input 
        type="checkbox" 
        :checked="selected"
        @change="$emit('toggle-select', item.id)"
        class="h-5 w-5 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
      />
    </div>
    <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
      <img :src="item.product.images?.[0]?.imageUrl || 'https://via.placeholder.com/80'" :alt="item.product.name" class="h-full w-full object-cover" />
    </div>
    
    <div class="flex flex-1 flex-col">
      <div class="flex justify-between">
        <h4 class="text-sm font-medium text-gray-900 line-clamp-2 pr-4">{{ item.product.name }}</h4>
        <button @click="$emit('remove')" class="shrink-0 text-gray-400 hover:text-red-500 transition-colors">
          <div class="i-heroicons-trash h-4 w-4"></div>
        </button>
      </div>
      
      <div class="mt-1 text-sm text-gray-500">{{ item.product.category?.name || 'Kategori' }}</div>
      
      <div class="mt-2 flex items-center justify-between">
        <span class="font-semibold text-gray-900">{{ formatRupiah(item.product.price) }}</span>
        
        <div class="flex items-center rounded-lg border border-gray-200">
          <button @click="$emit('update-quantity', item.quantity - 1)" class="px-2 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50" :disabled="item.quantity <= 1">
            <div class="i-heroicons-minus h-3 w-3"></div>
          </button>
          <span class="w-8 text-center text-sm font-medium">{{ item.quantity }}</span>
          <button @click="$emit('update-quantity', item.quantity + 1)" class="px-2 py-1 text-gray-600 hover:bg-gray-50">
            <div class="i-heroicons-plus h-3 w-3"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  item: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update-quantity', 'remove', 'toggle-select'])

const formatRupiah = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}
</script>
