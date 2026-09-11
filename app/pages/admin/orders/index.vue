<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-primary">Daftar Pesanan</h1>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-2">
      <button @click="statusFilter = ''" :class="!statusFilter ? 'bg-primary text-white' : 'bg-surface border border-border text-secondary hover:bg-page'" class="px-4 py-2 rounded-xl text-sm font-medium transition-colors">Semua</button>
      <button @click="statusFilter = 'PENDING'" :class="statusFilter === 'PENDING' ? 'bg-primary text-white' : 'bg-surface border border-border text-secondary hover:bg-page'" class="px-4 py-2 rounded-xl text-sm font-medium transition-colors">Menunggu (Pending)</button>
      <button @click="statusFilter = 'PAID'" :class="statusFilter === 'PAID' ? 'bg-primary text-white' : 'bg-surface border border-border text-secondary hover:bg-page'" class="px-4 py-2 rounded-xl text-sm font-medium transition-colors">Dibayar</button>
      <button @click="statusFilter = 'PROCESSING'" :class="statusFilter === 'PROCESSING' ? 'bg-primary text-white' : 'bg-surface border border-border text-secondary hover:bg-page'" class="px-4 py-2 rounded-xl text-sm font-medium transition-colors">Diproses</button>
      <button @click="statusFilter = 'SHIPPED'" :class="statusFilter === 'SHIPPED' ? 'bg-primary text-white' : 'bg-surface border border-border text-secondary hover:bg-page'" class="px-4 py-2 rounded-xl text-sm font-medium transition-colors">Dikirim</button>
      <button @click="statusFilter = 'COMPLETED'" :class="statusFilter === 'COMPLETED' ? 'bg-primary text-white' : 'bg-surface border border-border text-secondary hover:bg-page'" class="px-4 py-2 rounded-xl text-sm font-medium transition-colors">Selesai</button>
      <button @click="statusFilter = 'CANCELLED'" :class="statusFilter === 'CANCELLED' ? 'bg-primary text-white' : 'bg-surface border border-border text-secondary hover:bg-page'" class="px-4 py-2 rounded-xl text-sm font-medium transition-colors">Dibatalkan</button>
    </div>

    <div class="bg-surface rounded-2xl border border-border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-page border-b border-border">
              <th class="py-3 px-6 text-sm font-medium text-secondary">ID Pesanan</th>
              <th class="py-3 px-6 text-sm font-medium text-secondary">Tanggal</th>
              <th class="py-3 px-6 text-sm font-medium text-secondary">Total</th>
              <th class="py-3 px-6 text-sm font-medium text-secondary">Status</th>
              <th class="py-3 px-6 text-sm font-medium text-secondary text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pending" class="border-b border-border">
              <td colspan="5" class="py-12 text-center text-secondary">
                <div class="flex justify-center"><AppSpinner class="w-6 h-6 text-brand" /></div>
              </td>
            </tr>
            <tr v-else-if="!orders || orders.length === 0" class="border-b border-border">
              <td colspan="5" class="py-12 text-center text-secondary">
                Tidak ada pesanan ditemukan.
              </td>
            </tr>
            <tr v-else v-for="order in orders" :key="order.id" class="border-b border-border hover:bg-page/50">
              <td class="py-4 px-6 text-sm text-primary font-medium">#ORD-{{ order.id }}</td>
              <td class="py-4 px-6 text-sm text-primary">{{ new Date(order.createdAt).toLocaleDateString('id-ID') }}</td>
              <td class="py-4 px-6 text-sm text-primary font-medium">Rp {{ order.totalAmount?.toLocaleString('id-ID') || 0 }}</td>
              <td class="py-4 px-6 text-sm">
                <span :class="getStatusBadgeClass(order.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                  {{ order.status }}
                </span>
              </td>
              <td class="py-4 px-6 text-sm text-right">
                <NuxtLink :to="`/admin/orders/${order.id}`" class="text-brand hover:underline text-sm font-medium px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Detail</NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { api } = useApi()

const statusFilter = ref('')

const { data: response, pending } = await useAsyncData(
  'admin-orders',
  () => {
    let url = '/orders?limit=50'
    if (statusFilter.value) {
      url += `&status=${statusFilter.value}`
    }
    return api.get<any>(url)
  },
  { watch: [statusFilter] }
)

const orders = computed(() => response.value?.data || [])

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-800'
    case 'PAID': return 'bg-blue-100 text-blue-800'
    case 'PROCESSING': return 'bg-indigo-100 text-indigo-800'
    case 'SHIPPED': return 'bg-purple-100 text-purple-800'
    case 'COMPLETED': return 'bg-green-100 text-green-800'
    case 'CANCELLED': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script>
