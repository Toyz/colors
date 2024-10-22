<template>
  <div class="flex items-center space-x-4 p-3 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg w-full relative">
    <!-- Color Preview Box that toggles the popover -->
    <div class="relative">
      <div class="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600"
        :style="{ backgroundColor: colorValue }"></div>
    </div>

    <!-- Color HEX Display -->
    <input type="text" v-model="colorValue"
      class="p-2 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm w-full uppercase placeholder:normal-case"
      placeholder="Enter HEX (e.g., #FF5733)" />

    <!-- Remove Button -->
    <button @click="onRemove" class="text-red-500 hover:text-red-700 p-3">
      <i class="fas fa-trash text-xl"></i> <!-- Font Awesome Icon -->
    </button>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

// Props for the component
interface Props {
  color: string; // The color value passed as HEX
  onRemove: () => void; // Callback function for removing the input
}

const props = defineProps<Props>();
const emit = defineEmits(['update:color']); // Emit an event when the color is updated

// Color picker and HEX value states
const colorPickerValue = ref(props.color);
const colorValue = ref<string>(props.color);
const showPicker = ref(false); // Toggles the visibility of the color picker popover

// Watch for changes in the props.color and update the local value
watch(() => props.color, (newColor) => {
  colorValue.value = newColor;
  colorPickerValue.value = newColor; // Sync with the color picker
});

// Emit the updated color when the color picker changes
watch(colorPickerValue, (newColor) => {
  colorValue.value = newColor;
  emit('update:color', colorValue.value); // Emit the updated HEX value
});

// Emit the updated color when the text input changes
watch(colorValue, (newColor) => {
  colorPickerValue.value = newColor; // Sync with the picker
});

// Close color picker when clicked outside
const closePickerOnOutsideClick = (event: MouseEvent) => {
  const colorPickerElement = document.querySelector('.relative');
  if (colorPickerElement && !colorPickerElement.contains(event.target as Node)) {
    showPicker.value = false; // Hide the picker
  }
};

// Set up event listeners for detecting clicks outside the color picker
onMounted(() => {
  document.addEventListener('click', closePickerOnOutsideClick);
});

// Remove the event listener before component unmounts
onBeforeUnmount(() => {
  document.removeEventListener('click', closePickerOnOutsideClick);
});
</script>

<style scoped>
/* Optional styles */
</style>
