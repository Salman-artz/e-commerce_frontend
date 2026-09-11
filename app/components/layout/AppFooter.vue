<script setup lang="ts">
</script>

<template>
  <footer class="bg-surface border-t border-border mt-auto">
    <div class="app-container py-12">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        
        <!-- Brand -->
        <div class="col-span-1 md:col-span-4 lg:col-span-5">
          <h3 class="text-lg font-bold text-accent mb-4">ArtzShop</h3>
          <p class="text-sm text-textSecondary leading-relaxed max-w-sm">
            Solusi belanja online terbaik untuk kebutuhan sehari-hari Anda dengan desain yang minimalis dan elegan.
          </p>
        </div>

        <!-- Links Container -->
        <div class="col-span-1 md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <!-- Links 1 -->
          <div>
            <h4 class="text-sm font-semibold text-textPrimary mb-4">Belanja</h4>
            <ul class="space-y-3">
              <li><NuxtLink to="/products" class="text-sm text-textSecondary hover:text-accent transition-colors">Semua Produk</NuxtLink></li>
              <li><NuxtLink to="/products" class="text-sm text-textSecondary hover:text-accent transition-colors">Kategori</NuxtLink></li>
              <li><a href="#" @click.prevent class="text-sm text-textSecondary hover:text-accent transition-colors">Promo Spesial</a></li>
            </ul>
          </div>

          <!-- Links 2 -->
          <div>
            <h4 class="text-sm font-semibold text-textPrimary mb-4">Dukungan</h4>
            <ul class="space-y-3">
              <li><a href="#" @click.prevent class="text-sm text-textSecondary hover:text-accent transition-colors">Pusat Bantuan</a></li>
              <li><a href="#" @click.prevent class="text-sm text-textSecondary hover:text-accent transition-colors">Info Pengiriman</a></li>
              <li><a href="#" @click.prevent class="text-sm text-textSecondary hover:text-accent transition-colors">Pengembalian Dana</a></li>
            </ul>
          </div>

          <!-- Links 3 -->
          <div class="col-span-2 sm:col-span-1">
            <h4 class="text-sm font-semibold text-textPrimary mb-4">Perusahaan</h4>
            <ul class="space-y-3">
              <li><a href="#" @click.prevent class="text-sm text-textSecondary hover:text-accent transition-colors">Tentang Kami</a></li>
              <li><a href="#" @click.prevent class="text-sm text-textSecondary hover:text-accent transition-colors">Hubungi Kami</a></li>
              <li><a href="#" @click.prevent class="text-sm text-textSecondary hover:text-accent transition-colors">Karir</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between">
        <p class="text-sm text-textSecondary">
          &copy; {{ new Date().getFullYear() }} ArtzShop. Hak Cipta Dilindungi.
        </p>
        <div class="flex gap-4 mt-4 md:mt-0">
          <a href="#" class="text-textSecondary hover:text-accent transition-colors"><Icon name="ph:instagram-logo" class="w-5 h-5" /></a>
          <a href="#" class="text-textSecondary hover:text-accent transition-colors"><Icon name="ph:twitter-logo" class="w-5 h-5" /></a>
          <a href="#" class="text-textSecondary hover:text-accent transition-colors"><Icon name="ph:facebook-logo" class="w-5 h-5" /></a>
        </div>
      </div>
    </div>
  </footer>
</template>
