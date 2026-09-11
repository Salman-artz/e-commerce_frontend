<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity ease-linear duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity ease-linear duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="uiStore.isCartDrawerOpen" class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" @click="close"></div>
    </Transition>

    <Transition
      enter-active-class="transition ease-in-out duration-300 transform"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition ease-in-out duration-300 transform"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div v-if="uiStore.isCartDrawerOpen" class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-xl">
        <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 class="text-lg font-bold text-gray-900">Keranjang Belanja</h2>
          <button @click="close" class="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <div class="i-heroicons-x-mark h-5 w-5"></div>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-6 py-2">
          <div v-if="cartStore.cartItems.length > 0" class="flex flex-col">
            <div class="flex items-center gap-2 py-3 border-b border-gray-100 pl-2">
              <input 
                type="checkbox" 
                :checked="cartStore.selectedItemIds.length === cartStore.cartItems.length && cartStore.cartItems.length > 0"
                @change="e => cartStore.selectAllItems((e.target as HTMLInputElement).checked)"
                class="h-5 w-5 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
              />
              <span class="text-sm font-medium text-gray-700">Pilih Semua</span>
            </div>
            <CartItem
              v-for="item in cartStore.cartItems"
              :key="item.id"
              :item="item"
              :selected="cartStore.selectedItemIds.includes(item.id.toString())"
              @toggle-select="cartStore.toggleSelectItem($event)"
              @update-quantity="updateQuantity(item.id, $event)"
              @remove="removeItem(item.id)"
            />
          </div>
          <div v-else class="flex h-full flex-col items-center justify-center">
            <AppEmptyState
              icon="i-heroicons-shopping-cart"
              title="Keranjang Kosong"
              description="Anda belum menambahkan produk apapun ke keranjang."
            >
              <template #action>
                <AppButton @click="goToProducts" variant="primary">Mulai Belanja</AppButton>
              </template>
            </AppEmptyState>
          </div>
        </div>

        <div v-if="cartStore.cartItems.length > 0" class="border-t border-gray-100 bg-gray-50 px-6 py-4">
          <div class="mb-4 flex items-center justify-between text-base font-bold text-gray-900">
            <p>Total ({{ cartStore.selectedItemIds.length }} produk)</p>
            <p>{{ formatRupiah(cartStore.selectedTotal) }}</p>
          </div>
          <AppButton class="w-full" size="lg" @click="checkout" :disabled="cartStore.selectedItemIds.length === 0">
            Checkout Sekarang
          </AppButton>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCartStore } from '~/stores/cart'
import { useUiStore } from '~/stores/ui'

const router = useRouter()
const cartStore = useCartStore()
const uiStore = useUiStore()

const close = () => {
  uiStore.isCartDrawerOpen = false
}

const updateQuantity = async (id: string, quantity: number) => {
  if (quantity > 0) {
    await cartStore.updateItem(id, quantity)
  }
}

const removeItem = async (id: string) => {
  await cartStore.removeItem(id)
}

const goToProducts = () => {
  close()
  router.push('/products')
}

const checkout = () => {
  close()
  router.push('/checkout')
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
