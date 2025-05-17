<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-6 transition-colors duration-500">
    <!-- Header section with gradient text -->
    <header class="text-center mb-12 pt-8">
      <h1
        class="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
        Batch Color Preview
      </h1>
      <p class="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto">
        Create, manage, and share your color palettes with ease
      </p>
    </header>

    <!-- Main content -->
    <main class="flex-1 flex flex-col items-center w-full">
      <ColorTabs :current-colors="colors" :selectedIndex="activeTab" @change="activeTab = $event" @load="loadPalette">
        <template #palette>
          <div class="w-full max-w-2xl mx-auto">
            <!-- Action Bar with glassmorphism -->
            <div
              class="w-full mb-6 p-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20">
              <div class="flex justify-between items-center">
                <!-- Left Actions -->
                <div class="flex space-x-4">
                  <ButtonComponent @click="addNewColorInput" variant="primary" :icon="PlusIcon">
                    Add Color
                  </ButtonComponent>
                  <ButtonComponent @click="removeLastColorInput" variant="danger" :icon="MinusIcon"
                    :disabled="colors.length === 0">
                    Remove
                  </ButtonComponent>
                </div>

                <!-- Right Actions -->
                <div class="flex space-x-4">
                  <ButtonComponent @click="isResetModelOpen = true" variant="warning" :icon="ArrowPathIcon"
                    :disabled="colors.length === 0">
                    Reset
                  </ButtonComponent>
                  <SharePopover :share-url="shareableUrl" @shared="handleShared">
                    <template #trigger>
                      <ButtonComponent variant="success" :icon="ShareIcon" :disabled="colors.length === 0">
                        Share
                      </ButtonComponent>
                    </template>
                  </SharePopover>
                </div>
              </div>
            </div>

            <!-- Color Inputs with staggered animation -->
            <div class="relative w-full">
              <TransitionGroup name="color-list" tag="div" class="relative space-y-4">
                <ColorInput v-for="(color, index) in colors" :key="index" :color="color"
                  @update:color="updateColor(index, $event)" @remove="removeColor(index)" />
              </TransitionGroup>

              <!-- Empty State -->
              <div v-if="colors.length === 0" class="text-center py-12">
                <p class="text-gray-500 dark:text-gray-400 text-lg">
                  Add some colors to get started!
                </p>
              </div>
            </div>
          </div>
        </template>
      </ColorTabs>
    </main>

    <!-- Reset Confirmation Modal -->
    <DialogComponent :show="isResetModelOpen" @close="isResetModelOpen = false" title-size="large" centered>
      <template #title>Reset Colors</template>
      <p class="text-gray-600 dark:text-gray-400">
        Are you sure you want to reset all colors? This action cannot be undone.
      </p>
      <template #actions>
        <ButtonComponent @click="resetColors" variant="danger">
          Reset
        </ButtonComponent>
        <ButtonComponent @click="isResetModelOpen = false" variant="secondary">
          Cancel
        </ButtonComponent>
      </template>
    </DialogComponent>

    <!-- Footer with enhanced design -->
    <footer class="mt-12 text-center py-6">
      <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
        Created with ❤️ by <a href="https://x.com/Helba_The_AI" target="_blank"
          class="font-semibold hover:text-blue-600 transition-colors">helba_the_ai</a>
      </p>
      <div class="flex justify-center space-x-6"> <a href="https://github.com/toyz/colors" target="_blank"
          class="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
          <svg viewBox="0 0 24 24" class="w-8 h-8 fill-current">
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
        <a href="https://x.com/Helba_The_AI" target="_blank"
          class="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
          <svg viewBox="0 0 24 24" class="w-8 h-8 fill-current">
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon, MinusIcon, PlusIcon, ShareIcon } from '@heroicons/vue/24/outline';
import { computed, inject, onBeforeUnmount, onMounted, provide, ref } from 'vue';
import { useColorStore } from '../stores/colorStore';
import ButtonComponent from './ButtonComponent.vue';
import ColorInput from './ColorInput.vue';
import ColorTabs from './ColorTabs.vue';
import DialogComponent from './DialogComponent.vue';
import SharePopover from './SharePopover.vue';

// State management
const colors = ref<string[]>([]);
const activeTab = ref(0);
const isResetModelOpen = ref(false);
const store = useColorStore();
const shareableUrl = computed(() => store.shareableUrl);

// Get app reference and provide appRef to children
const appRef = inject<{ showPicker: Function }>('appRef');
provide('appRef', appRef);

// Color management functions
const addNewColorInput = () => {
  colors.value.push('');
};

const handleShared = () => {
  store.updateColors(colors.value, true); // Mark colors as shared when share dialog opens
};

const removeLastColorInput = () => {
  if (colors.value.length > 0) {
    colors.value.pop();
  }
};

const updateColor = (index: number, newColor: string) => {
  colors.value[index] = newColor;
  store.updateColors(colors.value);
};

const removeColor = (index: number) => {
  colors.value.splice(index, 1);
  store.updateColors(colors.value);
};

// Color input functions for paste handling

// Paste handling
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pasteData = event.clipboardData?.getData('text/plain') || '';
  const lines = pasteData
    .split(/[\r\n, ]+/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
  for (let line of lines) {
    if (!line.startsWith('#')) {
      line = `#${line}`;
    }
    fillFirstAvailableOrAdd(line);
  }
  store.updateColors(colors.value);
};

const fillFirstAvailableOrAdd = (colorValue: string) => {
  const availableSlotIndex = colors.value.findIndex(color => color === '');
  if (availableSlotIndex !== -1) {
    colors.value[availableSlotIndex] = colorValue;
  } else {
    colors.value.push(colorValue);
  }
};

// Keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.altKey && (event.key === '+' || event.key === '=')) {
    event.preventDefault();
    addNewColorInput();
  } else if (event.altKey && event.key === '-') {
    event.preventDefault();
    removeLastColorInput();
  } else if (event.key === 'Escape') {
    isResetModelOpen.value = false;
  } else if (event.altKey && event.key === 'r') {
    isResetModelOpen.value = true;
  }
};

// Reset functionality
const resetColors = () => {
  colors.value = [];
  store.resetColors();
  isResetModelOpen.value = false;
};

const loadPalette = (newColors: string[]) => {
  colors.value = [...newColors];
  store.updateColors(colors.value, true); // Mark as shared since it's loaded from history/favorites
};

// Lifecycle hooks
onMounted(() => {
  const hash = window.location.hash.slice(1);
  if (hash) {
    try {
      const decodedColors = atob(hash).split(',');
      colors.value = decodedColors;
      store.updateColors(decodedColors, true); // Mark as shared since it's loaded from URL
    } catch (e) {
      console.error('Invalid base64 string');
    }
  }

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('paste', handlePaste);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('paste', handlePaste);
});
</script>

<style scoped>
.color-list-move,
.color-list-enter-active,
.color-list-leave-active {
  transition: all 0.3s ease;
  max-width: 100%;
  overflow: hidden;
}

.color-list-enter-from,
.color-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.color-list-leave-active {
  position: absolute;
  width: 100%;
  visibility: hidden;
}
</style>
