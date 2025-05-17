<template>
  <div
    class="group flex items-center bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 w-full relative transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:z-[1] overflow-hidden">
    <!-- Color Preview Box with gradient overlay -->
    <div class="flex items-center relative">
      <div class="w-16 h-16 relative overflow-hidden">
        <div class="absolute inset-0" :style="{ backgroundColor: colorValue }"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 rounded-l-xl"></div>
      </div>
    </div>

    <!-- Color HEX Display with improved input -->
    <div class="flex-1">
      <input type="text" v-model="colorValue" @input="validateAndUpdateColor" :class="[
        'p-4 h-16 text-lg font-mono tracking-wide bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-100 w-full uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300',
        'border-x border-y border-white/20 dark:border-gray-700/20'
      ]" placeholder="Enter HEX (e.g., #FF5733)" />
    </div>

    <!-- Remove Button -->
    <button :class="[
      'h-16 w-[72px] inline-flex items-center justify-center rounded-r-xl',
      'bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700',
      'transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500 disabled:dark:hover:bg-red-600',
    ]" @click="props.onRemove">
      <TrashIcon class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
import { ref, watch } from 'vue';

const props = defineProps<{
  color: string;
  onRemove: () => void;
}>();

const emit = defineEmits<{
  'update:color': [color: string]
}>();

const colorValue = ref(props.color || '#000000');

const validateAndUpdateColor = (event: Event): void => {
  const input = (event.target as HTMLInputElement).value;
  let color = input.toUpperCase();

  if (color && !color.startsWith('#')) {
    color = '#' + color;
  }

  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
    colorValue.value = color;
    emit('update:color', color);
  } else {
    colorValue.value = input;
  }
};

watch(() => props.color, (newColor: string) => {
  if (newColor) {
    colorValue.value = newColor;
  }
});
</script>

<style scoped></style>
