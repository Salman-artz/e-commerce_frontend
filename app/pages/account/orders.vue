<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Sidebar -->
      <div class="w-full md:w-64 shrink-0">
        <AccountSidebar />
      </div>
      
      <!-- Content -->
      <div class="flex-1">
        <h1 class="text-2xl font-bold text-primary mb-8">Pesanan Saya</h1>
        
        <div v-if="pending" class="space-y-6">
          <div v-for="i in 3" :key="i" class="animate-pulse bg-page h-48 rounded-3xl"></div>
        </div>
        
        <div v-else-if="!orders || orders.length === 0" class="bg-page rounded-3xl p-12 text-center">
          <p class="text-secondary mb-6">Belum ada pesanan.</p>
          <NuxtLink to="/products" class="inline-block px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-black transition-colors">Mulai Belanja</NuxtLink>
        </div>
        
        <div v-else class="space-y-6">
          <div v-for="order in orders" :key="order.id" class="bg-page rounded-3xl p-6 transition-all hover:bg-gray-100">
            <div class="flex flex-wrap justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div class="flex items-center gap-4">
                <span class="text-sm font-medium text-secondary">{{ formatDate(order.createdAt) }}</span>
                <span class="text-sm text-secondary">|</span>
                <span class="text-sm font-medium text-primary">{{ order.orderNumber || order.id }}</span>
              </div>
              <OrderStatusBadge :status="order.status" />
            </div>
            
            <div class="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div class="flex-1 flex gap-4 w-full">
                <img v-if="order.items[0]?.product?.images?.length" :src="order.items[0].product.images[0].imageUrl" class="w-20 h-20 object-cover rounded-2xl bg-white shrink-0" />
                <div class="w-20 h-20 bg-gray-200 rounded-2xl shrink-0 flex items-center justify-center text-gray-400" v-else>
                  <Icon name="ph:image" class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="font-semibold text-primary line-clamp-1">{{ order.items[0]?.productNameSnapshot || order.items[0]?.product?.name }}</h3>
                  <p class="text-sm text-secondary mt-1">{{ order.items[0]?.quantity }} barang x {{ formatPrice(order.items[0]?.priceSnapshot) }}</p>
                  <p v-if="order.items.length > 1" class="text-sm text-secondary mt-2">+ {{ order.items.length - 1 }} produk lainnya</p>
                </div>
              </div>
              
              <div class="w-full md:w-auto md:text-right border-t md:border-t-0 border-gray-200 pt-4 md:pt-0">
                <div class="text-sm text-secondary mb-1">Total Belanja</div>
                <div class="text-lg font-bold text-primary">{{ formatPrice(order.totalAmount) }}</div>
              </div>
            </div>
            
            <div class="mt-6 pt-4 flex justify-end gap-3 border-t border-gray-200">
              <NuxtLink :to="`/orders/${order.id}`" class="px-5 py-2.5 bg-white text-primary rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors text-sm">Lihat Detail</NuxtLink>
              <button v-if="order.status === 'PENDING'" @click="payOrder(order)" class="px-5 py-2.5 bg-accent text-white rounded-2xl font-medium hover:bg-black transition-colors text-sm">Bayar Sekarang</button>
              <button v-else-if="order.status === 'SHIPPED'" @click="completeOrder(order)" :disabled="isCompleting === order.id" class="px-5 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors text-sm disabled:opacity-50">
                {{ isCompleting === order.id ? 'Memproses...' : 'Pesanan Diterima' }}
              </button>
              <button v-else-if="order.status === 'COMPLETED' && (!order.reviews || order.reviews.length === 0)" @click="openReviewModal(order)" class="px-5 py-2.5 bg-white text-accent border border-accent rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm">
                Beri Ulasan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <ReviewModal v-model="showReviewModal" :order="selectedOrderForReview" @submitted="refresh" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { api } = useApi() // Assuming this is auto-imported

const { data: ordersResponse, pending, refresh } = await useAsyncData('orders', () => 
  api.get<any>('/orders')
)

onMounted(() => {
  refresh()
})

const orders = computed(() => {
  if (Array.isArray(ordersResponse.value?.data)) {
    return ordersResponse.value.data
  }
  return ordersResponse.value?.data?.items || []
})

const formatPrice = (price: number) => {
  if (!price) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }).format(date)
}

const payOrder = (order: any) => {
  if (order.paymentUrl) {
    window.location.href = order.paymentUrl
  } else {
    // Fallback if no payment url exists
    alert('Metode pembayaran tidak tersedia.')
  }
}

const isCompleting = ref<number | null>(null)
const showReviewModal = ref(false)
const selectedOrderForReview = ref<any>(null)

const completeOrder = async (order: any) => {
  if (isCompleting.value) return;
  
  if (!confirm('Apakah Anda yakin telah menerima pesanan ini dengan baik?')) return;
  
  isCompleting.value = order.id;
  try {
    await api.post(`/orders/${order.id}/complete`);
    alert('Terima kasih! Pesanan telah diselesaikan.');
    await refresh();
    
    // Open review modal for this order
    selectedOrderForReview.value = order;
    showReviewModal.value = true;
  } catch (err: any) {
    console.error(err);
    alert(err?.data?.message || 'Terjadi kesalahan saat menyelesaikan pesanan.');
  } finally {
    isCompleting.value = null;
  }
}

const openReviewModal = (order: any) => {
  selectedOrderForReview.value = order;
  showReviewModal.value = true;
}
</script>
