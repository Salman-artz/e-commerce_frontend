<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-page py-12 px-4 sm:px-6 lg:px-8 relative">
    
    <NuxtLink to="/" class="absolute top-6 left-6 sm:top-10 sm:left-10 flex items-center gap-2 text-sm font-medium text-textSecondary hover:text-accent transition-colors">
      <Icon name="ph:arrow-left" class="w-5 h-5" />
      Kembali ke Beranda
    </NuxtLink>

    <div class="max-w-md w-full space-y-8 z-10">
      <slot />
    </div>
  </div>
</template>
