<template>
  <div class="space-y-6 max-w-2xl">
    <div class="flex items-center space-x-4">
      <button @click="navigateTo('/admin/products')" class="text-secondary hover:text-primary transition-colors">
        <div class="i-carbon-arrow-left text-xl"></div>
      </button>
      <h1 class="text-2xl font-semibold text-primary">Tambah Produk</h1>
    </div>

    <div class="bg-surface rounded-xl border border-border p-6 shadow-sm">
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

        <!-- Multiple Images Upload -->
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-primary">Gambar Produk (Bisa lebih dari 1)</label>
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
            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Produk' }}
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { api } = useApi()
const isSubmitting = ref(false)
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

const { data: categoriesResponse } = await useAsyncData('categories', () => api.get<any>('/categories'))
const categories = computed(() => categoriesResponse.value?.data || [])

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
  // Reset input so the same file can be selected again if needed
  target.value = '';
}

const removeImage = (index: number) => {
  selectedFiles.value.splice(index, 1);
  URL.revokeObjectURL(imagePreviewUrls.value[index]);
  imagePreviewUrls.value.splice(index, 1);
}

const submitProduct = async () => {
  isSubmitting.value = true
  try {
    const res = await api.post<any>('/products', form)
    const productId = res.data?.id
    
    // Upload images if any
    if (productId && selectedFiles.value.length > 0) {
      const formData = new FormData();
      selectedFiles.value.forEach(file => {
        formData.append('images', file);
      });
      
      const config = useRuntimeConfig();
      const authStore = useAuthStore();
      
      // Use native fetch for multipart/form-data to let browser set correct boundary
      await $fetch(`/products/${productId}/images`, {
        baseURL: config.public.apiBase as string,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`
        },
        body: formData
      });
    }
    
    navigateTo('/admin/products')
  } catch (error) {
    console.error('Failed to create product:', error)
    alert('Gagal menambahkan produk. Silakan coba lagi.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
