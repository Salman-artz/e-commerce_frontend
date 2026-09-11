<template>
  <nav class="flex items-center justify-center space-x-1" aria-label="Pagination">
    <button
      @click="prevPage"
      :disabled="currentPage === 1"
      class="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-50 transition-colors"
    >
      <span class="sr-only">Previous</span>
      <div class="i-heroicons-chevron-left-20-solid h-5 w-5"></div>
    </button>
    
    <div class="flex space-x-1">
      <button
        v-for="page in pages"
        :key="page"
        @click="goToPage(page)"
        :class="[
          'inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-colors',
          page === currentPage 
            ? 'bg-[#18181B] text-white shadow-sm' 
            : 'text-gray-700 hover:bg-gray-100'
        ]"
      >
        {{ page }}
      </button>
    </div>

    <button
      @click="nextPage"
      :disabled="currentPage === totalPages"
      class="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-50 transition-colors"
    >
      <span class="sr-only">Next</span>
      <div class="i-heroicons-chevron-right-20-solid h-5 w-5"></div>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['page-change'])

const pages = computed(() => {
  const range = []
  for (let i = 1; i <= props.totalPages; i++) {
    range.push(i)
  }
  return range
})

const goToPage = (page: number) => {
  if (page !== props.currentPage) {
    emit('page-change', page)
  }
}

const prevPage = () => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1)
  }
}

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1)
  }
}
</script>
