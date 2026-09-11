<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-400">
      <div v-if="icon" :class="[icon, 'h-10 w-10']"></div>
      <div v-else class="i-heroicons-inbox-20-solid h-10 w-10"></div>
    </div>
    <h3 class="mb-2 text-lg font-bold text-gray-900">{{ title }}</h3>
    <p class="mb-6 max-w-md text-sm text-gray-500">{{ description }}</p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>
