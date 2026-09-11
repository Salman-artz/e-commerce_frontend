<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="flex justify-between items-center mb-8">
      <NuxtLink to="/account/orders" class="inline-flex items-center text-sm font-medium text-secondary hover:text-primary transition-colors">
        <span class="mr-2">←</span> Kembali ke Daftar Pesanan
      </NuxtLink>
      
      <button v-if="order" @click="downloadInvoice" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-primary hover:bg-gray-50 transition-colors">
        <Icon name="ph:download-simple" class="w-4 h-4" />
        Unduh Invoice PDF
      </button>
    </div>

    <div v-if="pending" class="animate-pulse space-y-6">
      <div class="h-32 bg-page rounded-3xl"></div>
      <div class="h-64 bg-page rounded-3xl"></div>
    </div>

    <div v-else-if="!order" class="bg-page rounded-3xl p-12 text-center">
      <p class="text-secondary text-lg">Pesanan tidak ditemukan.</p>
    </div>

    <div v-else class="space-y-8" ref="invoiceContent">
      <div class="bg-page rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6" data-html2canvas-ignore="false">
        <div>
          <h1 class="text-2xl font-bold text-primary mb-2">Detail Pesanan</h1>
          <p class="text-secondary">{{ order.orderNumber || order.id }} • {{ formatDate(order.createdAt) }}</p>
        </div>
        <OrderStatusBadge :status="order.status" class="text-sm px-4 py-1.5" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-8">
          <!-- Order Items -->
          <div class="bg-page rounded-3xl p-8">
            <h2 class="text-xl font-semibold text-primary mb-6">Produk</h2>
            <div class="space-y-6">
              <div v-for="item in order.items" :key="item.id" class="flex gap-6 pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                <img v-if="item.product?.images?.length" :src="item.product.images[0].imageUrl" class="w-24 h-24 object-cover rounded-2xl bg-white" />
                <div class="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400" v-else>
                  <Icon name="ph:image" class="w-8 h-8" />
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-primary text-lg mb-1">{{ item.productNameSnapshot || item.product?.name }}</h3>
                  <p class="text-secondary mb-2">{{ item.quantity }} x {{ formatPrice(item.priceSnapshot) }}</p>
                  <p class="font-semibold text-primary">{{ formatPrice(item.quantity * item.priceSnapshot) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Info -->
          <div class="bg-page rounded-3xl p-8">
            <h2 class="text-xl font-semibold text-primary mb-6">Info Pengiriman</h2>
            <div v-if="order.address" class="space-y-2">
              <div class="font-medium text-primary">{{ order.address.recipientName }}</div>
              <div class="text-secondary">{{ order.address.phone }}</div>
              <div class="text-secondary mt-2 leading-relaxed">
                {{ order.address.fullAddress }}
              </div>
            </div>
            <div v-else class="text-secondary">Informasi pengiriman tidak tersedia.</div>
          </div>
        </div>

        <div class="md:col-span-1">
          <div class="bg-page rounded-3xl p-8 sticky top-24">
            <h2 class="text-xl font-semibold text-primary mb-6">Ringkasan Pembayaran</h2>
            <div class="space-y-4 mb-6">
              <div class="flex justify-between text-secondary">
                <span>Metode</span>
                <span class="text-primary font-medium capitalize">{{ order.payment?.method || '-' }}</span>
              </div>
              <div class="flex justify-between text-secondary">
                <span>Subtotal Produk</span>
                <span>{{ formatPrice(order.totalAmount - (order.shippingCost || 0)) }}</span>
              </div>
              <div class="flex justify-between text-secondary">
                <span>Ongkos Kirim</span>
                <span>{{ formatPrice(order.shippingCost || 0) }}</span>
              </div>
            </div>
            <div class="border-t border-gray-200 pt-4 mb-6">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-primary">Total</span>
                <span class="text-xl font-bold text-primary">{{ formatPrice(order.totalAmount) }}</span>
              </div>
            </div>

            <button v-if="order.status === 'PENDING'" @click="payOrder" data-html2canvas-ignore="true" class="w-full py-4 px-6 bg-accent text-white rounded-2xl font-medium hover:bg-black transition-colors">
              Bayar Sekarang
            </button>
            <button v-else-if="order.status === 'SHIPPED'" @click="completeOrder" :disabled="isCompleting" data-html2canvas-ignore="true" class="w-full py-4 px-6 bg-green-600 text-white rounded-2xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
              {{ isCompleting ? 'Memproses...' : 'Pesanan Diterima' }}
            </button>
            <button v-else-if="order.status === 'COMPLETED' && (!order.reviews || order.reviews.length === 0)" @click="showReviewModal = true" data-html2canvas-ignore="true" class="w-full py-4 px-6 bg-white border-2 border-accent text-accent rounded-2xl font-medium hover:bg-gray-50 transition-colors">
              Beri Ulasan
            </button>
          </div>
        </div>
      </div>
    </div>
    <ReviewModal v-model="showReviewModal" :order="order" @submitted="refresh" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const { api } = useApi() // Assuming this is auto-imported

const orderId = route.params.id

const { data: orderResponse, pending, refresh } = await useAsyncData(`order-${orderId}`, () => 
  api.get<any>(`/orders/${orderId}`)
)

const order = computed(() => orderResponse.value?.data || null)

const formatPrice = (price: number) => {
  if (!price) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date) + ' WIB'
}

const payOrder = () => {
  if (order.value?.paymentUrl) {
    window.location.href = order.value.paymentUrl
  } else {
    alert('Link pembayaran tidak tersedia.')
  }
}

const invoiceContent = ref<HTMLElement | null>(null)

const downloadInvoice = async () => {
  if (!invoiceContent.value || !order.value) return;
  
  try {
    const html2pdf = (await import('html2pdf.js')).default;
    
    const opt = {
      margin: 10,
      filename: `Invoice_${order.value.orderNumber || order.value.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(invoiceContent.value).save();
  } catch (err) {
    console.error('Failed to generate PDF:', err);
    alert('Gagal membuat invoice PDF. Pastikan koneksi stabil.');
  }
}

const isCompleting = ref(false)
const showReviewModal = ref(false)

const completeOrder = async () => {
  if (!order.value || isCompleting.value) return;
  
  if (!confirm('Apakah Anda yakin telah menerima pesanan ini dengan baik?')) return;
  
  isCompleting.value = true;
  try {
    await api.post(`/orders/${order.value.id}/complete`);
    alert('Terima kasih! Pesanan telah diselesaikan.');
    await refresh();
    
    // Open review modal
    showReviewModal.value = true;
  } catch (err: any) {
    console.error(err);
    alert(err?.data?.message || 'Terjadi kesalahan saat menyelesaikan pesanan.');
  } finally {
    isCompleting.value = false;
  }
}
</script>
