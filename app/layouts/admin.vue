<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex bg-page">
    <LayoutAdminSidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-16 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
        <h1 class="text-xl font-semibold text-textPrimary">Panel Admin</h1>
        <NuxtLink to="/" class="text-sm text-textSecondary hover:text-textPrimary transition-colors">
          Kembali ke ArtzShop
        </NuxtLink>
      </header>
      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
