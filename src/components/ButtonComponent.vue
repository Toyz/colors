<template>
  <button :class="[
    // Base styles
    'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
    // Size variants
    size === 'sm' ? 'text-sm' : 'text-base',
    // Disabled state
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    // Variant styles
    variantStyles[variant],
  ]" :disabled="disabled" @click="$emit('click', $event)">
    <component v-if="icon" :is="icon" :class="[
      // Icon sizes
      size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
      loading ? 'animate-spin' : '',
    ]" />
    <span v-if="$slots.default">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'danger' | 'warning' | 'success' | 'secondary';
  size?: 'sm' | 'base';
  icon?: Component;
  disabled?: boolean;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'base',
  disabled: false,
  loading: false,
});

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const variantStyles = computed(() => ({
  primary: 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-blue-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600 focus:ring-red-500',
  warning: 'bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-500 dark:hover:bg-amber-600 focus:ring-amber-500',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 focus:ring-emerald-500',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 focus:ring-gray-500',
}));
</script>
