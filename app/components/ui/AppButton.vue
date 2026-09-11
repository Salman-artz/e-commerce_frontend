<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses[size],
      variantClasses[variant],
      { 'pointer-events-none opacity-80': loading }
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <AppSpinner v-if="loading" class="mr-2" :class="spinnerClasses[variant]" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String as () => 'primary' | 'secondary' | 'ghost' | 'danger',
    default: 'primary'
  },
  size: {
    type: String as () => 'sm' | 'md' | 'lg',
    default: 'md'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

const variantClasses = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-600/30 active:scale-95 shadow-md shadow-indigo-600/20',
  secondary: 'bg-white text-indigo-700 border-2 border-indigo-100 hover:border-indigo-200 hover:bg-indigo-50 active:scale-95 shadow-sm',
  ghost: 'bg-transparent text-indigo-700 hover:bg-indigo-50 active:scale-95',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95 shadow-sm'
}

const spinnerClasses = {
  primary: 'text-white border-t-white',
  secondary: 'text-indigo-600 border-t-indigo-600',
  ghost: 'text-indigo-600 border-t-indigo-600',
  danger: 'text-white border-t-white'
}
</script>
