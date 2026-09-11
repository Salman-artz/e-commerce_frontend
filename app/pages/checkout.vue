<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold text-primary mb-8">Checkout</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-5 gap-12">
      <!-- Left side: 60% (col-span-3) -->
      <div class="md:col-span-3 space-y-10">
        <!-- Shipping Address -->
        <section>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-primary">Alamat Pengiriman</h2>
            <button @click="openAddModal" class="text-sm font-medium text-brand hover:underline">Tambah Alamat</button>
          </div>
          
          <div v-if="pendingAddresses" class="animate-pulse bg-page h-24 rounded-2xl"></div>
          <div v-else-if="!addresses || addresses.length === 0" class="p-6 bg-page rounded-2xl text-center text-secondary">
            Belum ada alamat pengiriman.
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="address in addresses" 
              :key="address.id"
              @click="selectedAddress = address.id"
              :class="['p-5 rounded-2xl cursor-pointer transition-all', selectedAddress === address.id ? 'bg-accent text-white' : 'bg-page hover:bg-gray-100']"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-medium mb-1">{{ address.recipientName }}</div>
                  <div class="text-sm opacity-90">{{ address.fullAddress }}</div>
                  <div class="text-sm opacity-90 mt-2">{{ address.phone }}</div>
                </div>
                <div class="flex gap-2">
                  <button @click.stop="openEditModal(address)" class="text-xs font-medium text-brand hover:underline p-2">Ubah</button>
                  <button @click.stop="deleteAddress(address.id)" class="text-xs font-medium text-red-500 hover:underline p-2">Hapus</button>
                </div>
              </div>
              <div v-if="!address.cityId" class="mt-2 text-xs text-red-500 bg-red-50 p-2 rounded">
                Alamat ini perlu diperbarui (tidak ada info kota). Silakan hapus dan buat baru.
              </div>
            </div>
          </div>
        </section>
        
        <!-- Payment Method -->
        <section>
          <h2 class="text-xl font-semibold text-primary mb-4">Metode Pembayaran</h2>
          <div class="space-y-4">
            <label class="flex items-center p-5 rounded-2xl bg-page cursor-pointer hover:bg-gray-100 transition-colors">
              <input type="radio" v-model="paymentMethod" value="MIDTRANS" class="w-5 h-5 text-accent border-gray-300 focus:ring-accent" />
              <span class="ml-4 font-medium text-primary">Midtrans (Virtual Account, Gopay, dll)</span>
            </label>
            <label class="flex items-center p-5 rounded-2xl bg-page cursor-pointer hover:bg-gray-100 transition-colors">
              <input type="radio" v-model="paymentMethod" value="XENDIT" class="w-5 h-5 text-accent border-gray-300 focus:ring-accent" />
              <span class="ml-4 font-medium text-primary">Xendit (Transfer Bank, E-Wallet)</span>
            </label>
          </div>
        </section>

        <!-- Shipping Calculation -->
        <section>
          <h2 class="text-xl font-semibold text-primary mb-4">Pilih Kurir</h2>
          <div class="bg-page p-6 rounded-2xl space-y-4">
            <div v-if="!selectedAddressObj" class="text-sm text-secondary">
              Silakan pilih atau tambah alamat pengiriman terlebih dahulu.
            </div>
            <div v-else>
              <label class="block text-sm font-medium text-secondary mb-1">Kurir Pengiriman</label>
              <select v-model="selectedCourier" @change="calculateShipping" class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 focus:ring-accent focus:border-accent">
                <option value="jne">JNE (Jalur Nugraha Ekakurir)</option>
                <option value="pos">POS Indonesia</option>
                <option value="tiki">TIKI (Citra Van Titipan Kilat)</option>
                <option value="jnt">J&T Express</option>
                <option value="sicepat">SiCepat Ekspres</option>
                <option value="ninja">Ninja Xpress</option>
                <option value="anteraja">AnterAja</option>
                <option value="ide">ID Express</option>
                <option value="lion">Lion Parcel</option>
                <option value="wahana">Wahana Prestasi Logistik</option>
                <option value="rpx">RPX Holding</option>
                <option value="sap">SAP Express</option>
                <option value="jet">JET Express</option>
                <option value="indah">Indah Logistik</option>
                <option value="rex">REX Express</option>
                <option value="sentral">Sentral Cargo</option>
                <option value="first">First Logistics</option>
              </select>
            </div>
            
            <div v-if="calculatingShipping" class="text-sm text-brand flex items-center">
              <Icon name="ph:spinner-gap-bold" class="animate-spin w-4 h-4 mr-2" /> Menghitung ongkir...
            </div>
          </div>
        </section>
      </div>
      
      <!-- Right side: 40% (col-span-2) -->
      <div class="md:col-span-2">
        <div class="bg-page p-8 rounded-3xl sticky top-24">
          <h2 class="text-xl font-semibold text-primary mb-6">Ringkasan Pesanan</h2>
          
          <div class="space-y-4 mb-6 max-h-64 overflow-y-auto">
            <div v-for="item in checkoutItems" :key="item.id" class="flex items-center gap-4">
              <img v-if="item.product.images && item.product.images.length > 0" :src="item.product.images[0].imageUrl" class="w-16 h-16 object-cover rounded-xl bg-white" />
              <div v-else class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                <Icon name="ph:image" class="w-6 h-6 text-gray-400" />
              </div>
              <div class="flex-1">
                <div class="font-medium text-primary line-clamp-1">{{ item.product.name }}</div>
                <div class="text-sm text-secondary">{{ item.quantity }} x {{ formatPrice(item.product.price) }}</div>
              </div>
              <div class="font-medium text-primary">{{ formatPrice(item.quantity * item.product.price) }}</div>
            </div>
          </div>
          
          <div class="border-t border-border pt-4 mb-6">
            <div class="flex justify-between mb-2">
              <span class="text-secondary">Subtotal</span>
              <span class="font-medium text-primary">{{ formatPrice(checkoutTotal) }}</span>
            </div>
            <div class="flex justify-between mb-4">
              <span class="text-secondary">Ongkos Kirim (dari Malang)</span>
              <span class="font-medium text-primary">{{ formatPrice(shippingCost) }}</span>
            </div>
            <div class="border-t border-border pt-4 mt-4 flex justify-between items-end">
              <div>
                <span class="text-sm text-secondary">Total Pembayaran</span>
                <p class="text-2xl font-bold text-accent">{{ formatPrice(checkoutTotal + shippingCost) }}</p>
              </div>
            </div>
          </div>
          
          <button 
            @click="processCheckout" 
            :disabled="!isReadyToPay || isLoading"
            :class="['w-full py-4 px-6 rounded-2xl font-medium text-white transition-all', isReadyToPay && !isLoading ? 'bg-accent hover:bg-black' : 'bg-gray-300 cursor-not-allowed']"
          >
            {{ isLoading ? 'Memproses...' : 'Bayar Sekarang' }}
          </button>
        </div>
      </div>
    </div>
    
    <AddressModal v-model="showAddressModal" :editData="addressToEdit" @saved="handleAddressSaved" />
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { computed, ref } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const cartStore = useCartStore()
const { api } = useApi() // Assuming useApi is auto-imported
const router = useRouter()
const route = useRoute()

const directPurchaseProductId = route.query.productId as string
const directPurchaseQuantity = parseInt(route.query.quantity as string) || 1

const { data: directProductResponse } = await useAsyncData(`direct-product-${directPurchaseProductId}`, () => {
  if (!directPurchaseProductId) return Promise.resolve(null)
  return api.get<any>(`/products/${directPurchaseProductId}`)
})

const directProduct = computed(() => directProductResponse.value?.data || null)

const checkoutItems = computed(() => {
  if (directProduct.value) {
    return [{
      id: 'direct',
      quantity: directPurchaseQuantity,
      product: directProduct.value
    }]
  }
  return cartStore.selectedItems
})

const checkoutTotal = computed(() => {
  if (directProduct.value) {
    return directProduct.value.price * directPurchaseQuantity
  }
  return cartStore.selectedTotal
})

const selectedAddress = ref<number | null>(null)
const paymentMethod = ref<string>('MIDTRANS')
const isLoading = ref(false)
const shippingCost = ref(0) // Default 0

// Computed selected address object
const selectedCourier = ref('jne')
const calculatingShipping = ref(false)

const selectedAddressObj = computed(() => {
  return addresses.value.find((a: any) => a.id === selectedAddress.value)
})

const calculateShipping = async () => {
  if (!selectedAddressObj.value || !selectedAddressObj.value.cityId || !selectedCourier.value) {
    shippingCost.value = 0
    return
  }
  
  calculatingShipping.value = true
  try {
    const res = await $fetch('/api/rajaongkir/cost', {
      method: 'POST',
      body: {
        origin: 256, // Malang
        destination: selectedAddressObj.value.cityId,
        weight: 1000, // 1kg default
        courier: selectedCourier.value
      }
    })
    
    // Get the first service cost
    const costs = res.rajaongkir.results[0].costs
    if (costs && costs.length > 0) {
      shippingCost.value = costs[0].cost[0].value
    } else {
      shippingCost.value = 0
      alert('Layanan kurir tidak tersedia untuk tujuan ini.')
    }
  } catch (error) {
    console.error('Failed to calculate shipping', error)
    shippingCost.value = 0
    alert('Gagal menghitung ongkos kirim')
  } finally {
    calculatingShipping.value = false
  }
}

// Fetch addresses
const { data: addressesResponse, pending: pendingAddresses } = await useAsyncData('addresses', () => 
  api.get<any>('/addresses')
)

const addresses = computed(() => addressesResponse.value?.data || [])

// Auto select first address if available
watchEffect(() => {
  if (addresses.value && addresses.value.length > 0 && !selectedAddress.value) {
    selectedAddress.value = addresses.value[0].id
  }
})

// Recalculate shipping when address changes
watch(selectedAddress, () => {
  calculateShipping()
}, { immediate: true })

const isReadyToPay = computed(() => {
  return selectedAddress.value !== null && 
         paymentMethod.value !== '' && 
         checkoutItems.value.length > 0 && 
         shippingCost.value > 0
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)
}

const processCheckout = async () => {
  if (!isReadyToPay.value) return
  
  isLoading.value = true
  try {
    const payload: any = {
      addressId: selectedAddress.value,
      paymentMethod: paymentMethod.value,
      shippingCost: shippingCost.value,
    }
    
    if (directProduct.value) {
      payload.directPurchase = {
        productId: directProduct.value.id,
        quantity: directPurchaseQuantity
      }
    } else {
      payload.cartItemIds = cartStore.selectedItemIds.map(id => Number(id))
    }

    const response = await api.post<any>('/orders', payload)
    
    const responseData = response.data || response;

    // Assuming response contains paymentUrl or redirectUrl
    if (responseData.paymentUrl) {
      window.location.href = responseData.paymentUrl
    } else if (responseData.orderId || responseData.id) {
      router.push(`/orders/${responseData.orderId || responseData.id}`)
    } else {
      router.push('/account/orders')
    }
    
    // Refresh cart after successful checkout (to get remaining items)
    if (cartStore.fetchCart) {
      await cartStore.fetchCart()
      cartStore.selectedItemIds = []
    }
  } catch (error) {
    console.error('Checkout failed:', error)
    alert('Terjadi kesalahan saat checkout. Silakan coba lagi.')
  } finally {
    isLoading.value = false
  }
}

const showAddressModal = ref(false)
const addressToEdit = ref<any>(null)

const openAddModal = () => {
  addressToEdit.value = null
  showAddressModal.value = true
}

const openEditModal = (address: any) => {
  addressToEdit.value = address
  showAddressModal.value = true
}

const handleAddressSaved = async () => {
  const res = await api.get<any>('/addresses')
  addressesResponse.value = res
  if (res.data && res.data.length > 0) {
    selectedAddress.value = res.data[res.data.length - 1].id;
  }
}

const deleteAddress = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus alamat ini?')) return;
  try {
    await api.delete(`/addresses/${id}`);
    const res = await api.get<any>('/addresses');
    addressesResponse.value = res;
    if (selectedAddress.value === id) {
      selectedAddress.value = res.data && res.data.length > 0 ? res.data[0].id : null;
    }
  } catch (error) {
    console.error('Failed to delete address', error);
    alert('Gagal menghapus alamat.');
  }
}
</script>
