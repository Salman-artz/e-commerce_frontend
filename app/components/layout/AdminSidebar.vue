<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const isCollapsed = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const links = [
  { name: 'Dashboard', path: '/admin', icon: 'ph:squares-four' },
  { name: 'Produk', path: '/admin/products', icon: 'ph:package' },
  { name: 'Pesanan', path: '/admin/orders', icon: 'ph:shopping-cart' },
  { name: 'Ulasan', path: '/admin/reviews', icon: 'ph:star' }
]

const handleLogout = async () => {
  await authStore.logout()
  router.push('/auth/login')
}
</script>

<template>
  <aside :class="['bg-surface border-r border-border transition-all duration-300 flex flex-col', isCollapsed ? 'w-20' : 'w-64']">
    <div class="h-16 flex items-center justify-between px-4 border-b border-border">
      <h2 v-if="!isCollapsed" class="font-bold text-lg text-accent truncate">ArtzShop Admin</h2>
      <button @click="isCollapsed = !isCollapsed" class="p-2 text-textSecondary hover:text-accent rounded-md hover:bg-page transition-colors mx-auto">
        <Icon :name="isCollapsed ? 'ph:list' : 'ph:caret-left'" class="w-5 h-5" />
      </button>
    </div>

    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <NuxtLink 
        v-for="link in links" :key="link.path" 
        :to="link.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-textSecondary hover:text-accent hover:bg-page transition-colors"
        active-class="bg-page !text-brand"
        :title="link.name"
      >
        <Icon :name="link.icon" class="w-5 h-5 shrink-0" />
        <span v-if="!isCollapsed" class="truncate">{{ link.name }}</span>
      </NuxtLink>
    </nav>
    
    <div class="p-4 border-t border-border">
      <button @click="handleLogout" class="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-danger hover:bg-red-50 transition-colors" title="Keluar">
        <Icon name="ph:sign-out" class="w-5 h-5 shrink-0" />
        <span v-if="!isCollapsed">Keluar</span>
      </button>
    </div>
  </aside>
</template>
