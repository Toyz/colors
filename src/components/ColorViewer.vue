<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-6">
    <!-- Title -->
    <h1 class="text-4xl font-bold mb-6 text-gray-200">Batch Color Preview</h1>

    <!-- Action Buttons -->
    <div class="flex justify-between items-center mb-2 w-full max-w-lg">
      <!-- Left - Add and Remove Icons -->
      <div class="flex space-x-4 relative">
        <div class="relative group">
          <button @click="addNewColorInput" class="bg-transparent">
            <i class="fas fa-plus text-blue-600 text-2xl cursor-pointer"></i>
          </button>
          <span
            class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
            Add Color
          </span>
        </div>

        <div class="relative group">
          <button v-if="colors.length > 0" @click="removeLastColorInput" class="bg-transparent">
            <i class="fas fa-minus text-red-600 text-2xl cursor-pointer"></i>
          </button>
          <span
            class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
            Remove Color
          </span>
        </div>
      </div>

      <!-- Right - Share Icon -->
      <div class="relative group">
        <button @click="openShareModal" class="bg-transparent">
          <i class="fas fa-share-alt text-green-600 text-2xl cursor-pointer"></i>
        </button>
        <span
          class="absolute right-full mr-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
          Share Colors
        </span>
      </div>
    </div>

    <!-- Color Inputs -->
    <div class="space-y-2 w-full max-w-lg" @paste="handlePaste">
      <ColorInput v-for="(color, index) in colors" :key="index" :color="color"
        @update:color="updateColor(index, $event)" @remove="removeColor(index)" />
    </div>

    <!-- Share Modal -->
    <div v-if="isShareModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Shareable URL</h2>

        <!-- Shareable URL Input Field -->
        <div class="relative mb-4">
          <input :value="shareableUrl" readonly
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 shadow-sm focus:outline-none cursor-pointer" />
        </div>

        <div class="mt-4 flex justify-end space-x-2">
          <button @click="copyShareableUrl"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow focus:outline-none">
            Copy
          </button>
          <button @click="closeShareModal"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow focus:outline-none">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-12 text-center">
      <p class="text-gray-500 dark:text-gray-400 text-sm mb-2">Created by <span
          class="font-semibold">helba_the_ai</span></p>
      <div class="flex justify-center space-x-4">
        <a href="https://github.com/toyz/colors" target="_blank" class="text-blue-500 hover:text-blue-700">
          <i class="fab fa-github fa-2x"></i>
        </a>
        <a href="https://x.com/Helba_The_AI" target="_blank" class="text-blue-500 hover:text-blue-700">
          <i class="fab fa-x-twitter fa-2x"></i>
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import ColorInput from './ColorInput.vue';

// Color list, starts with one empty input
const colors = ref<string[]>(['']);
const isShareModalOpen = ref(false); // Modal visibility
const shareableUrl = ref('');

// Function to add a new color input
const addNewColorInput = () => {
  colors.value.push('');
};

// Function to remove the last color input
const removeLastColorInput = () => {
  if (colors.value.length > 0) {
    colors.value.pop();
  }

  if (colors.value.length === 0) {
    colors.value.push('');
  }
};

// Function to update the color input when the value is changed
const updateColor = (index: number, newColor: string) => {
  colors.value[index] = newColor;
};

// Function to remove a color input by index
const removeColor = (index: number) => {
  colors.value.splice(index, 1);

  if (colors.value.length === 0) {
    colors.value.push('');
  }
};

// Open Share Modal
const openShareModal = () => {
  const uniqueColors = Array.from(new Set(colors.value.filter(isValidHex)));
  if (uniqueColors.length === 0) {
    alert('No valid colors to share.');
    return;
  }
  const colorString = uniqueColors.join(',');
  const base64Colors = btoa(colorString);
  shareableUrl.value = `${window.location.origin}${window.location.pathname}#${base64Colors}`;
  isShareModalOpen.value = true;
};

// Close Share Modal
const closeShareModal = () => {
  isShareModalOpen.value = false;
};

// Copy shareable URL to clipboard
const copyShareableUrl = () => {
  navigator.clipboard.writeText(shareableUrl.value).then(() => {
    alert('URL copied to clipboard!');
  });
};

// Helper function to check if a hex color is valid
const isValidHex = (hex: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
};

// Handle paste event, reading the lines and filling inputs
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pasteData = event.clipboardData?.getData('text/plain') || '';
  const lines = pasteData.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0);

  // Process each line, check for mode or handle as HEX if detected
  for (const element of lines) {
    const line = element;

    // Check if it's a valid HEX color or matches current mode
    if (isValidHex(line)) {
      fillFirstAvailableOrAdd(line);
    }
  }
};

// Fill first available empty input or add new input
const fillFirstAvailableOrAdd = (colorValue: string) => {
  let availableSlotIndex = colors.value.findIndex(color => color === '');

  if (availableSlotIndex !== -1) {
    colors.value[availableSlotIndex] = colorValue;  // Fill empty slot
  } else {
    colors.value.push(colorValue);  // Add new input if no empty slots
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  console.log(event.key);
  if (event.altKey && (event.key === '+' || event.key === '=')) {
    event.preventDefault();
    addNewColorInput();
  } else if (event.altKey && event.key === '-') {
    event.preventDefault();
    removeLastColorInput();
  } // else if escape key, close modal
  else if (event.key === 'Escape') {
    closeShareModal();
  }
};

// Add event listeners on mount and remove them before unmount
onMounted(() => {
  const hash = window.location.hash.slice(1); // Remove the `#`
  if (hash) {
    try {
      const decodedColors = atob(hash).split(','); // Decode base64 and split by comma
      if (decodedColors.every(isValidHex)) {
        colors.value = decodedColors;
      } else {
        console.warn('Invalid colors in the hash');
      }
    } catch (e) {
      console.error('Invalid base64 string');
    }
  }

  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
/* No custom CSS, all handled with Tailwind */
</style>
