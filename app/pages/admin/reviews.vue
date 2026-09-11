<template>
  <div class="py-6">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-primary">Manajemen Ulasan</h1>
        <p class="text-secondary mt-1">Daftar ulasan dari pelanggan.</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="py-12 flex justify-center">
      <AppSpinner class="w-8 h-8 text-brand" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!reviews || reviews.length === 0" class="py-12 bg-white rounded-2xl border border-border text-center">
      <Icon name="ph:chat-teardrop-slash" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <h3 class="text-lg font-medium text-primary">Belum Ada Ulasan</h3>
      <p class="text-secondary">Saat ini belum ada pelanggan yang memberikan ulasan.</p>
    </div>

    <!-- Reviews Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="review in reviews" :key="review.id" class="bg-white p-6 rounded-2xl border border-border flex flex-col h-full relative">
        
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold uppercase">
              {{ review.user?.name?.charAt(0) || 'U' }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <p class="font-medium text-primary line-clamp-1">{{ review.user?.name || 'Pengguna' }}</p>
                <span v-if="review.isAnonymous" class="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase rounded-md border border-gray-200" title="Pelanggan memilih untuk menyembunyikan namanya di halaman publik">Anonim</span>
              </div>
              <p class="text-xs text-secondary">{{ formatDate(review.createdAt) }}</p>
            </div>
          </div>
          
          <button @click="deleteReview(review.id)" :disabled="isDeleting === review.id" class="text-gray-400 hover:text-red-500 transition-colors p-1" title="Hapus Ulasan">
            <Icon name="ph:trash" class="w-5 h-5" />
          </button>
        </div>
        
        <div class="mb-3">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">PRODUK</span>
          <p class="text-sm font-medium text-accent line-clamp-1">{{ review.product?.name || 'Produk' }}</p>
        </div>
        
        <div class="flex gap-1 mb-3">
          <span v-for="star in 5" :key="star" class="text-lg" :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-200'">
            ★
          </span>
        </div>
        
        <p class="text-sm text-gray-600 flex-grow">{{ review.comment || 'Tidak ada komentar tertulis.' }}</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center">
      <AppPagination :currentPage="currentPage" :totalPages="totalPages" @page-change="onPageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { api } = useApi()
const currentPage = ref(1)

const { data: response, pending, refresh } = await useAsyncData(
  `admin-reviews-${currentPage.value}`,
  () => api.get<any>(`/reviews?page=${currentPage.value}&limit=12`),
  { watch: [currentPage] }
)

const reviews = computed(() => response.value?.data || [])
const totalPages = computed(() => response.value?.pagination?.totalPages || 1)

const onPageChange = (page: number) => {
  currentPage.value = page
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateStr))
}

const isDeleting = ref<number | null>(null)

const deleteReview = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) return;
  
  isDeleting.value = id;
  try {
    await api.delete(`/reviews/${id}`);
    alert('Ulasan berhasil dihapus.');
    await refresh();
  } catch (err: any) {
    console.error(err);
    alert(err?.data?.message || 'Gagal menghapus ulasan.');
  } finally {
    isDeleting.value = null;
  }
}
</script>
