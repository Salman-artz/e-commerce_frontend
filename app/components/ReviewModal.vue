<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-bold text-primary mb-2">Beri Nilai Produk</h2>
      <p class="text-secondary mb-6">Terima kasih telah berbelanja! Silakan beri penilaian untuk produk yang Anda beli.</p>
      
      <div class="space-y-6 mb-8">
        <div v-for="(item, index) in reviewsData" :key="item.productId" class="p-4 border border-border rounded-2xl">
          <div class="flex gap-4 items-center mb-4">
            <img v-if="item.product?.images?.length" :src="item.product.images[0].imageUrl" class="w-16 h-16 object-cover rounded-xl bg-gray-100" />
            <div v-else class="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
              <Icon name="ph:image" class="w-6 h-6" />
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-primary">{{ item.product?.name || 'Produk' }}</h3>
            </div>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-secondary mb-2">Penilaian</label>
            <div class="flex gap-2">
              <button v-for="star in 5" :key="star" @click="item.rating = star" class="text-2xl transition-colors focus:outline-none" :class="star <= item.rating ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-200'">
                ★
              </button>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-secondary mb-2">Ulasan (Opsional)</label>
            <textarea v-model="item.comment" rows="2" class="w-full px-4 py-3 bg-page border border-border rounded-xl text-sm focus:ring-accent focus:border-accent" placeholder="Bagaimana kualitas produk ini?"></textarea>
          </div>
          
          <div class="mt-4 flex items-center gap-2">
            <input type="checkbox" :id="'anon-' + index" v-model="item.isAnonymous" class="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent">
            <label :for="'anon-' + index" class="text-sm text-gray-600 cursor-pointer">Sembunyikan nama saya (Tampilkan secara anonim)</label>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end gap-3">
        <button @click="close" class="px-5 py-2.5 bg-gray-100 text-secondary rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm">Nanti Saja</button>
        <button @click="submit" :disabled="isSubmitting" class="px-5 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-black transition-colors text-sm disabled:opacity-50">
          {{ isSubmitting ? 'Mengirim...' : 'Kirim Penilaian' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean;
  order: any;
}>()

const emit = defineEmits(['update:modelValue', 'submitted'])

const { api } = useApi()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const reviewsData = ref<any[]>([])
const isSubmitting = ref(false)

watch(() => props.order, (newOrder) => {
  if (newOrder && newOrder.items) {
    reviewsData.value = newOrder.items.map((item: any) => ({
      productId: item.productId,
      product: { name: item.productNameSnapshot, images: item.product?.images },
      rating: 5,
      comment: '',
      isAnonymous: false
    }))
  }
}, { immediate: true })

const close = () => {
  isOpen.value = false
}

const submit = async () => {
  if (!props.order || isSubmitting.value) return;
  
  isSubmitting.value = true;
  try {
    const payload = {
      reviews: reviewsData.value.map(r => ({
        productId: r.productId,
        rating: r.rating,
        comment: r.comment || undefined,
        isAnonymous: r.isAnonymous
      }))
    };
    
    await api.post(`/orders/${props.order.id}/reviews`, payload);
    alert('Penilaian Anda berhasil dikirim. Terima kasih!');
    emit('submitted');
    close();
  } catch (err: any) {
    console.error(err);
    alert(err?.data?.message || 'Gagal mengirim penilaian.');
  } finally {
    isSubmitting.value = false;
  }
}
</script>
