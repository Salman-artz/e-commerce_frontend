<template>
  <span :class="['px-3 py-1 rounded-full text-xs font-semibold', statusClasses]">
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: string
}>()

const statusMap: Record<string, { label: string, classes: string }> = {
  pending: { label: 'Menunggu Pembayaran', classes: 'bg-warning/10 text-warning' },
  processing: { label: 'Diproses', classes: 'bg-brand/10 text-brand' },
  shipped: { label: 'Dikirim', classes: 'bg-brand/10 text-brand' },
  completed: { label: 'Selesai', classes: 'bg-success/10 text-success' },
  cancelled: { label: 'Dibatalkan', classes: 'bg-danger/10 text-danger' },
}

const statusLabel = computed(() => statusMap[props.status?.toLowerCase()]?.label || props.status)
const statusClasses = computed(() => statusMap[props.status?.toLowerCase()]?.classes || 'bg-gray-100 text-gray-600')
</script>
