<template>
  <AppModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <div class="sm:flex sm:items-start">
      <div
        class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
        :class="iconBgClass"
      >
        <div :class="[iconClass, 'h-6 w-6']"></div>
      </div>
      <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
        <h3 class="text-base font-semibold leading-6 text-gray-900">
          {{ title }}
        </h3>
        <div class="mt-2">
          <p class="text-sm text-gray-500">
            {{ message }}
          </p>
        </div>
      </div>
    </div>
    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
      <AppButton
        :variant="variant === 'danger' ? 'danger' : 'primary'"
        class="w-full sm:w-auto"
        @click="$emit('confirm')"
      >
        {{ confirmText }}
      </AppButton>
      <AppButton
        variant="secondary"
        class="mt-3 w-full sm:mt-0 sm:w-auto"
        @click="$emit('update:modelValue', false)"
      >
        {{ cancelText }}
      </AppButton>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Konfirmasi'
  },
  cancelText: {
    type: String,
    default: 'Batal'
  },
  variant: {
    type: String as () => 'danger' | 'warning' | 'info',
    default: 'danger'
  }
})

defineEmits(['update:modelValue', 'confirm'])

const iconBgClass = computed(() => {
  switch (props.variant) {
    case 'danger': return 'bg-red-100'
    case 'warning': return 'bg-yellow-100'
    default: return 'bg-blue-100'
  }
})

const iconClass = computed(() => {
  switch (props.variant) {
    case 'danger': return 'i-heroicons-exclamation-triangle text-red-600'
    case 'warning': return 'i-heroicons-exclamation-circle text-yellow-600'
    default: return 'i-heroicons-information-circle text-blue-600'
  }
})
</script>
