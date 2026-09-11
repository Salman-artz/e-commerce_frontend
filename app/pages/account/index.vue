<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Sidebar -->
      <div class="w-full md:w-64 shrink-0">
        <AccountSidebar />
      </div>
      
      <!-- Content -->
      <div class="flex-1">
        <h1 class="text-2xl font-bold text-primary mb-8">Profil Saya</h1>
        
        <div class="bg-page rounded-3xl p-8 mb-8">
          <div class="flex items-center gap-6 mb-8">
            <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl text-secondary">
              {{ userInitial }}
            </div>
            <div>
              <h2 class="text-xl font-semibold text-primary">{{ user?.name || 'Pengguna' }}</h2>
              <p class="text-secondary">{{ user?.email }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm text-secondary mb-2">Nama Lengkap</label>
              <div class="p-4 bg-white rounded-xl border border-transparent">{{ user?.name || '-' }}</div>
            </div>
            <div>
              <label class="block text-sm text-secondary mb-2">Email</label>
              <div class="p-4 bg-white rounded-xl border border-transparent">{{ user?.email || '-' }}</div>
            </div>
            <div>
              <label class="block text-sm text-secondary mb-2">Nomor Telepon</label>
              <div class="p-4 bg-white rounded-xl border border-transparent">{{ defaultAddress?.phone || '-' }}</div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-primary">Daftar Alamat</h2>
          <AppButton 
            v-if="addresses.length < 5" 
            @click="openAddModal" 
            size="sm"
          >
            Tambah Alamat ({{ addresses.length }}/5)
          </AppButton>
          <div v-else class="text-sm text-secondary">Batas maksimal 5 alamat tercapai</div>
        </div>
        
        <div v-if="pending" class="animate-pulse bg-page h-32 rounded-3xl"></div>
        <div v-else-if="addresses.length > 0" class="space-y-4">
          <div v-for="address in addresses" :key="address.id" class="bg-page rounded-3xl p-6 border border-transparent transition-all" :class="{'border-accent': address.isDefault}">
            <div class="flex justify-between items-start mb-4">
              <div>
                <div class="font-medium text-primary text-lg">{{ address.recipientName }}</div>
                <div class="text-secondary mt-1">{{ address.phone }}</div>
              </div>
              <span v-if="address.isDefault" class="bg-accent text-white text-xs px-3 py-1 rounded-full">Utama</span>
              <div v-if="!address.cityId" class="text-xs text-red-500 bg-red-50 px-2 py-1 rounded ml-2">Perlu diperbarui (hapus & buat baru)</div>
            </div>
            <p class="text-secondary leading-relaxed">
              {{ address.fullAddress }}
            </p>
            <div class="mt-4 flex gap-4">
              <button v-if="!address.isDefault" @click="setAsDefault(address.id)" class="text-sm font-medium text-brand hover:underline">Jadikan Utama</button>
              <button @click="openEditModal(address)" class="text-sm font-medium text-brand hover:underline">Ubah</button>
              <button @click="deleteAddress(address.id)" class="text-sm font-medium text-red-500 hover:underline">Hapus</button>
            </div>
          </div>
        </div>
        <div v-else class="bg-page rounded-3xl p-8 text-center">
          <p class="text-secondary mb-4">Belum ada alamat yang ditambahkan.</p>
          <AppButton @click="openAddModal">Tambah Alamat</AppButton>
        </div>
      </div>
    </div>
    
    <AddressModal v-model="showAddressModal" :editData="addressToEdit" @saved="handleAddressSaved" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const { api } = useApi() // Assuming this is auto-imported

const userInitial = computed(() => {
  return user.value?.name ? user.value.name.charAt(0).toUpperCase() : 'U'
})

const { data: addressesResponse, pending } = await useAsyncData('addresses-' + Date.now(), () => 
  api.get<any>('/addresses')
)

const addresses = computed(() => addressesResponse.value?.data || [])

const defaultAddress = computed(() => {
  if (addresses.value.length === 0) return null
  return addresses.value.find((a: any) => a.isDefault) || addresses.value[0]
})

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

const refreshAddresses = async () => {
  const res = await api.get<any>('/addresses')
  addressesResponse.value = res
}

const handleAddressSaved = async () => {
  await refreshAddresses()
  alert('Alamat berhasil ditambahkan!')
}

const deleteAddress = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus alamat ini?')) return;
  try {
    await api.delete(`/addresses/${id}`);
    await refreshAddresses();
  } catch (error) {
    console.error('Failed to delete address', error);
    alert('Gagal menghapus alamat.');
  }
}

const setAsDefault = async (id: number) => {
  try {
    await api.patch(`/addresses/${id}`, { isDefault: true });
    await refreshAddresses();
  } catch (error) {
    console.error('Failed to set default address', error);
    alert('Gagal mengatur alamat utama.');
  }
}
</script>
