<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <NuxtLink to="/admin/orders" class="text-secondary hover:text-primary transition-colors">
          <Icon name="ph:arrow-left" class="w-6 h-6" />
        </NuxtLink>
        <h1 class="text-2xl font-semibold text-primary">Detail Pesanan #{{ order?.id || '...' }}</h1>
      </div>
      <div v-if="order" class="flex items-center gap-3">
        <select v-model="selectedStatus" class="px-4 py-2 bg-white border border-border rounded-xl text-sm focus:ring-accent focus:border-accent">
          <option value="PENDING">Pending (Belum Dibayar)</option>
          <option value="PAID">Paid (Sudah Dibayar)</option>
          <option value="PROCESSING">Processing (Sedang Diproses)</option>
          <option value="SHIPPED">Shipped (Dikirim)</option>
          <option value="COMPLETED">Completed (Selesai)</option>
          <option value="CANCELLED">Cancelled (Dibatalkan)</option>
        </select>
        <button @click="updateStatus" :disabled="isUpdating || selectedStatus === order.status" class="px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:bg-black transition-colors disabled:opacity-50">
          {{ isUpdating ? 'Menyimpan...' : 'Perbarui Status' }}
        </button>
      </div>
    </div>

    <div v-if="pending" class="animate-pulse bg-surface h-64 rounded-xl border border-border"></div>
    <div v-else-if="!order" class="bg-surface rounded-xl border border-border p-8 text-center text-secondary">
      Pesanan tidak ditemukan.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-2 space-y-6">
        <div class="bg-surface rounded-xl border border-border p-6">
          <h2 class="text-lg font-medium text-primary mb-4">Produk yang Dipesan</h2>
          <div class="space-y-4">
            <div v-for="item in order.items" :key="item.id" class="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
              <div class="flex-1">
                <h3 class="font-medium text-primary">{{ item.productNameSnapshot || item.product?.name }}</h3>
                <p class="text-sm text-secondary">{{ item.quantity }} x Rp {{ item.priceSnapshot?.toLocaleString('id-ID') }}</p>
              </div>
              <div class="font-medium text-primary">Rp {{ (item.quantity * item.priceSnapshot)?.toLocaleString('id-ID') }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-6">
        <div class="bg-surface rounded-xl border border-border p-6">
          <h2 class="text-lg font-medium text-primary mb-4">Ringkasan</h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-secondary">Subtotal Produk</span>
              <span class="text-primary font-medium">Rp {{ (order.totalAmount - (order.shippingCost || 0))?.toLocaleString('id-ID') }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-secondary">Ongkos Kirim</span>
              <span class="text-primary font-medium">Rp {{ order.shippingCost?.toLocaleString('id-ID') || 0 }}</span>
            </div>
            <div class="border-t border-border pt-3 flex justify-between">
              <span class="font-medium text-primary">Total Pembayaran</span>
              <span class="font-bold text-accent">Rp {{ order.totalAmount?.toLocaleString('id-ID') }}</span>
            </div>
          </div>
        </div>

        <div class="bg-surface rounded-xl border border-border p-6">
          <h2 class="text-lg font-medium text-primary mb-4">Pelanggan</h2>
          <div class="space-y-2 text-sm">
            <div>
              <span class="block text-secondary text-xs">Nama</span>
              <span class="text-primary">{{ order.user?.name }}</span>
            </div>
            <div>
              <span class="block text-secondary text-xs">Email</span>
              <span class="text-primary">{{ order.user?.email }}</span>
            </div>
            <div v-if="order.address" class="pt-2 border-t border-border">
              <span class="block text-secondary text-xs mb-1">Alamat Pengiriman</span>
              <span class="block text-primary font-medium">{{ order.address.recipientName }} ({{ order.address.phone }})</span>
              <span class="block text-primary">{{ order.address.fullAddress }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const route = useRoute()
const { api } = useApi()

const { data: response, pending, refresh } = await useAsyncData(`admin-order-${route.params.id}`, () =>
  api.get<any>(`/orders/${route.params.id}`)
)

const order = computed(() => response.value?.data || null)
const selectedStatus = ref(order.value?.status || 'PENDING')
const isUpdating = ref(false)

watch(() => order.value?.status, (newStatus) => {
  if (newStatus) {
    selectedStatus.value = newStatus
  }
}, { immediate: true })

const updateStatus = async () => {
  if (!order.value || isUpdating.value) return
  isUpdating.value = true
  try {
    await api.patch(`/orders/${order.value.id}/status`, {
      status: selectedStatus.value
    })
    alert('Status pesanan berhasil diperbarui!')
    await refresh()
  } catch (error: any) {
    console.error(error)
    alert(error?.data?.message || 'Gagal memperbarui status pesanan')
    selectedStatus.value = order.value.status // reset back
  } finally {
    isUpdating.value = false
  }
}
</script>
