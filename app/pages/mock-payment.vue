<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
    <div class="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center">
      <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="ph:credit-card-fill" class="w-8 h-8" />
      </div>
      
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Simulasi Payment Gateway</h1>
      <p class="text-gray-500 mb-8">Anda diarahkan ke halaman ini karena sistem menggunakan mode simulasi untuk pembayaran.</p>
      
      <div v-if="order" class="mb-8 p-6 bg-gray-50 rounded-2xl text-left border border-gray-100">
        <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
          <p class="text-sm text-gray-500">Order ID</p>
          <p class="font-bold text-gray-900">#{{ order.id }}</p>
        </div>
        
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-500">Total Pembayaran</p>
          <p class="font-bold text-2xl text-primary">{{ formatPrice(order.totalAmount) }}</p>
        </div>
      </div>
      
      <div v-else-if="pending" class="mb-8 p-6 bg-gray-50 rounded-2xl animate-pulse h-32"></div>
      
      <div v-else class="mb-8 p-6 bg-red-50 rounded-2xl text-red-500">
        Data pesanan tidak ditemukan.
      </div>
      
      <button 
        @click="simulateSuccess" 
        :disabled="loading || !order" 
        class="w-full bg-accent text-white py-4 rounded-xl font-medium mb-3 hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
      >
        <Icon v-if="loading" name="ph:spinner-gap-bold" class="animate-spin w-5 h-5 mr-2" />
        {{ loading ? 'Memproses Pembayaran...' : 'Simulasikan Pembayaran Berhasil' }}
      </button>
      
      <button 
        @click="goBack" 
        class="w-full text-gray-500 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors"
      >
        Batalkan & Kembali
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'auth', // Use auth layout to hide header/footer
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { api } = useApi()

const orderId = route.query.orderId as string
const loading = ref(false)

// Fetch order details for display
const { data: orderResponse, pending } = await useAsyncData(`order-${orderId}`, () => 
  orderId ? api.get<any>(`/orders/${orderId}`) : Promise.resolve(null)
)

const order = computed(() => orderResponse.value?.data || null)

const formatPrice = (price: number) => {
  if (!price) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)
}

const simulateSuccess = async () => {
  if (!orderId) return
  
  loading.value = true
  try {
    await api.post(`/orders/${orderId}/simulate-payment`)
    alert('Pembayaran Berhasil Dikonfirmasi!')
    router.push(`/orders/${orderId}`)
  } catch (error) {
    console.error('Payment simulation failed', error)
    alert('Gagal mensimulasikan pembayaran.')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  if (orderId) {
    router.push(`/orders/${orderId}`)
  } else {
    router.push('/')
  }
}
</script>
