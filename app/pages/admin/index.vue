<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold text-primary">Dasbor Admin</h1>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-surface p-6 rounded-xl border border-border shadow-sm">
        <h3 class="text-secondary text-sm font-medium">Total Pendapatan (Bulan Ini)</h3>
        <p class="text-2xl font-bold mt-2 text-primary">Rp {{ totalRevenue.toLocaleString('id-ID') }}</p>
      </div>
      <div class="bg-surface p-6 rounded-xl border border-border shadow-sm">
        <h3 class="text-secondary text-sm font-medium">Total Pesanan</h3>
        <p class="text-2xl font-bold mt-2 text-primary">{{ totalOrdersCount }}</p>
      </div>
      <div class="bg-surface p-6 rounded-xl border border-border shadow-sm">
        <h3 class="text-secondary text-sm font-medium">Pesanan Selesai</h3>
        <p class="text-2xl font-bold mt-2 text-primary">{{ completedOrdersCount }}</p>
      </div>
    </div>

    <!-- Latest Orders -->
    <div class="bg-surface rounded-xl border border-border overflow-hidden">
      <div class="p-6 border-b border-border flex justify-between items-center">
        <h2 class="text-lg font-semibold text-primary">Pesanan Terbaru</h2>
        <NuxtLink to="/admin/orders" class="text-sm text-brand hover:underline">Lihat Semua</NuxtLink>
      </div>
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
              <td colspan="5" class="py-8 text-center text-secondary">Memuat data...</td>
            </tr>
            <tr v-else-if="!orders || orders.length === 0" class="border-b border-border">
              <td colspan="5" class="py-8 text-center text-secondary">Tidak ada pesanan terbaru.</td>
            </tr>
            <tr v-else v-for="order in recentOrders" :key="order.id" class="border-b border-border hover:bg-page/50">
              <td class="py-3 px-6 text-sm text-primary font-medium">#ORD-{{ order.id }}</td>
              <td class="py-3 px-6 text-sm text-primary">{{ new Date(order.createdAt).toLocaleDateString('id-ID') }}</td>
              <td class="py-3 px-6 text-sm text-primary">Rp {{ order.totalAmount?.toLocaleString('id-ID') || 0 }}</td>
              <td class="py-3 px-6 text-sm">
                <span class="px-2 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium">{{ order.status || 'Menunggu' }}</span>
              </td>
              <td class="py-3 px-6 text-sm text-right">
                <NuxtLink :to="`/admin/orders/${order.id}`" class="text-brand hover:underline text-sm font-medium">Detail</NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { api } = useApi()

const { data: response, pending } = await useAsyncData('dashboard-orders-' + Date.now(), () =>
  api.get<any>('/orders') // getting all orders (recent first by default)
)

const orders = computed(() => response.value?.data || [])
const recentOrders = computed(() => orders.value.slice(0, 5))

const totalOrdersCount = computed(() => orders.value.length)
const completedOrdersCount = computed(() => orders.value.filter((o: any) => o.status === 'COMPLETED').length)
const totalRevenue = computed(() => {
  return orders.value
    .filter((o: any) => ['PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED'].includes(o.status))
    .reduce((sum: number, o: any) => sum + Number(o.totalAmount || 0), 0)
})
</script>
