<template>
  <div ref="target" :class="['transition-all duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)]', isVisible ? visibleClass : hiddenClass, delayClass]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps({
  delay: {
    type: Number,
    default: 0
  },
  animation: {
    type: String as () => 'fade-up' | 'fade-left' | 'fade-right' | 'zoom-in' | 'blur-in',
    default: 'fade-up'
  }
})

const target = ref<HTMLElement | null>(null)
const isVisible = ref(false)

const delayClass = computed(() => {
  if (props.delay === 100) return 'delay-100'
  if (props.delay === 200) return 'delay-200'
  if (props.delay === 300) return 'delay-300'
  if (props.delay === 400) return 'delay-[400ms]'
  if (props.delay === 500) return 'delay-500'
  if (props.delay === 600) return 'delay-[600ms]'
  if (props.delay === 700) return 'delay-700'
  return 'delay-0'
})

const visibleClass = computed(() => {
  return 'opacity-100 translate-x-0 translate-y-0 scale-100 blur-0'
})

const hiddenClass = computed(() => {
  switch (props.animation) {
    case 'fade-up': return 'opacity-0 translate-y-16'
    case 'fade-left': return 'opacity-0 translate-x-16'
    case 'fade-right': return 'opacity-0 -translate-x-16'
    case 'zoom-in': return 'opacity-0 scale-[0.85] translate-y-8'
    case 'blur-in': return 'opacity-0 blur-xl scale-95'
    default: return 'opacity-0 translate-y-12'
  }
})

useIntersectionObserver(target, ([entry]) => {
  if (entry.isIntersecting) {
    isVisible.value = true
  }
}, { threshold: 0.1 })
</script>
