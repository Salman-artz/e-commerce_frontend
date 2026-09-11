<template>
  <div class="space-y-6 max-w-2xl">
    <div class="flex items-center space-x-4">
      <button @click="navigateTo('/admin/products')" class="text-secondary hover:text-primary transition-colors">
        <div class="i-carbon-arrow-left text-xl"></div>
      </button>
      <h1 class="text-2xl font-semibold text-primary">Edit Produk</h1>
    </div>

    <div v-if="pending" class="bg-surface rounded-xl border border-border p-6 shadow-sm flex justify-center py-12">
      <AppSpinner class="w-8 h-8 text-brand" />
    </div>
    
    <div v-else-if="!product" class="bg-surface rounded-xl border border-border p-6 shadow-sm text-center py-12 text-secondary">
      Produk tidak ditemukan.
    </div>

    <div v-else class="bg-surface rounded-xl border border-border p-6 shadow-sm">
      <form @submit.prevent="submitProduct" class="space-y-4">
        <AppInput
          v-model="form.name"
          label="Nama Produk"
          placeholder="Masukkan nama produk"
          required
        />
        
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-primary">Deskripsi</label>
          <textarea
            v-model="form.description"
            class="w-full px-4 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all min-h-[100px]"
            placeholder="Masukkan deskripsi produk"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AppInput
            v-model.number="form.price"
            type="number"
            label="Harga (Rp)"
            placeholder="0"
            required
          />
          
          <AppInput
            v-model.number="form.stock"
            type="number"
            label="Stok"
            placeholder="0"
            required
          />
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-primary">Kategori</label>
          <select 
            v-model.number="form.categoryId"
            class="w-full px-4 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
            required
          >
            <option value="" disabled>Pilih Kategori</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-primary">Status</label>
          <select 
            v-model="form.status"
            class="w-full px-4 py-2 border border-border rounded-lg bg-surface text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
            required
          >
            <option value="ACTIVE">Aktif</option>
            <option value="OUT_OF_STOCK">Stok Habis</option>
            <option value="DISCONTINUED">Dihentikan</option>
          </select>
        </div>

        <div class="space-y-1.5" v-if="product && product.images && product.images.length > 0">
          <label class="block text-sm font-medium text-primary">Gambar Produk Saat Ini</label>
          <div class="grid grid-cols-4 gap-4 mt-2">
            <div v-for="img in product.images" :key="img.id" class="relative group">
              <img :src="img.imageUrl" class="h-24 w-full object-cover rounded-xl border border-border" />
              <button type="button" @click.prevent="deleteExistingImage(img.id)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity" title="Hapus Gambar">
                <Icon name="ph:x" class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <!-- Append New Images -->
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-primary">Tambah Gambar Baru</label>
          <input 
            type="file" 
            multiple 
            accept="image/*"
            @change="handleFileChange"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-brand hover:file:bg-gray-100"
          />
          <div v-if="imagePreviewUrls.length" class="mt-4 grid grid-cols-4 gap-4">
            <div v-for="(url, index) in imagePreviewUrls" :key="index" class="relative group">
              <img :src="url" class="h-24 w-full object-cover rounded-xl border border-border" />
              <button @click.prevent="removeImage(index)" class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="ph:x" class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div class="pt-4 flex justify-end">
          <AppButton type="submit" :disabled="isSubmitting" class="w-full md:w-auto">
            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { api } = useApi()
const route = useRoute()
const router = useRouter()
const isSubmitting = ref(false)
const productId = route.params.id

const selectedFiles = ref<File[]>([])
const imagePreviewUrls = ref<string[]>([])

const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  categoryId: '' as unknown as number,
  status: 'ACTIVE'
})

// Fetch Categories
const { data: categoriesResponse } = await useAsyncData('categories', () => api.get<any>('/categories'))
const categories = computed(() => categoriesResponse.value?.data || [])

// Fetch Product Details
const { data: productResponse, pending } = await useAsyncData(`product-${productId}`, () => api.get<any>(`/products/${productId}`))
const product = computed(() => productResponse.value?.data)

// Watch and populate form
if (product.value) {
  form.name = product.value.name
  form.description = product.value.description
  form.price = product.value.price
  form.stock = product.value.stock
  form.categoryId = product.value.categoryId
  form.status = product.value.status
}

watch(product, (newVal) => {
  if (newVal) {
    form.name = newVal.name
    form.description = newVal.description
    form.price = newVal.price
    form.stock = newVal.stock
    form.categoryId = newVal.categoryId
    form.status = newVal.status
  }
})

watch(() => form.stock, (newStock) => {
  if (newStock === 0 && form.status === 'ACTIVE') {
    form.status = 'OUT_OF_STOCK'
  } else if (newStock > 0 && form.status === 'OUT_OF_STOCK') {
    form.status = 'ACTIVE'
  }
})

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    const newFiles = Array.from(target.files);
    selectedFiles.value.push(...newFiles);
    
    newFiles.forEach(file => {
      imagePreviewUrls.value.push(URL.createObjectURL(file));
    });
  }
  target.value = '';
}

const removeImage = (index: number) => {
  selectedFiles.value.splice(index, 1);
  URL.revokeObjectURL(imagePreviewUrls.value[index]);
  imagePreviewUrls.value.splice(index, 1);
}

const deleteExistingImage = async (imageId: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus gambar ini?')) return;
  try {
    await api.delete(`/products/${productId}/images/${imageId}`);
    // Update local state without full refresh
    if (productResponse.value && productResponse.value.data) {
      productResponse.value.data.images = productResponse.value.data.images.filter((img: any) => img.id !== imageId);
    }
  } catch (error) {
    console.error('Failed to delete image:', error);
    alert('Gagal menghapus gambar.');
  }
}

const submitProduct = async () => {
  isSubmitting.value = true
  try {
    await api.patch(`/products/${productId}`, form)
    
    // Upload new appended images if any
    if (selectedFiles.value.length > 0) {
      const formData = new FormData();
      selectedFiles.value.forEach(file => {
        formData.append('images', file);
      });
      
      const config = useRuntimeConfig();
      const authStore = useAuthStore();
      
      await $fetch(`/products/${productId}/images`, {
        baseURL: config.public.apiBase as string,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        },
        body: formData
      });
    }
    
    router.push('/admin/products')
  } catch (error) {
    console.error('Failed to update product:', error)
    alert('Gagal memperbarui produk. Silakan coba lagi.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
