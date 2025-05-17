<template>
  <div class="w-full">
    <TabGroup :selectedIndex="props.selectedIndex" @change="emit('change', $event)">
      <div class="w-full mb-8">
        <TabList
          class="flex space-x-1 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg p-1 border border-white/20 dark:border-gray-700/20 max-w-md mx-auto">
          <Tab v-for="tab in tabs" :key="tab.name" v-slot="{ selected }" as="template">
            <button :class="[
              'w-full rounded-lg py-2.5 text-sm font-medium leading-5 px-6',
              'outline-none focus:outline-none focus:ring-0',
              selected
                ? [
                  'bg-white dark:bg-gray-700 shadow',
                  tab.activeColor
                ]
                : [
                  'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] dark:hover:bg-gray-700/[0.12]'
                ]
            ]">
              <div class="flex items-center justify-center space-x-2">
                <component :is="tab.icon" class="w-5 h-5" />
                <span>{{ tab.name }}</span>
              </div>
            </button>
          </Tab>
        </TabList>
      </div>
      <TabPanels class="w-full">
        <TabPanel>
          <slot name="palette"></slot>
        </TabPanel>
        <TabPanel>
          <div class="max-w-2xl mx-auto space-y-4">
            <!-- History Action Bar -->
            <div
              class="flex justify-end p-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20">
              <ButtonComponent @click="isHistoryClearDialogOpen = true" variant="danger" :icon="TrashIcon"
                :disabled="!history.length">
                Clear History
              </ButtonComponent>
            </div>

            <div v-if="history.length === 0"
              class="text-center py-12 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl">
              <p class="text-gray-500 dark:text-gray-400">No history yet</p>
            </div>
            <div v-else class="space-y-4">
              <ColorPaletteItem v-for="(item, index) in history" :key="index" :colors="item.colors"
                :timestamp="item.timestamp" :isFavorite="item.isFavorite" type="history" @load="loadPalette"
                @toggle-favorite="toggleFavorite(item)" />
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div class="max-w-2xl mx-auto space-y-4">
            <!-- Favorites Action Bar -->
            <div
              class="flex justify-end gap-4 p-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20">
              <input type="file" ref="fileInput" accept=".json" class="hidden" @change="handleFileSelect" />
              <ButtonComponent @click="$refs.fileInput.click()" variant="primary" :icon="ArrowUpTrayIcon">
                Import
              </ButtonComponent>
              <ButtonComponent @click="exportFavorites" variant="success" :icon="ArrowDownTrayIcon"
                :disabled="!favorites.length">
                Export
              </ButtonComponent>
            </div>

            <div v-if="favorites.length === 0"
              class="text-center py-12 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl">
              <p class="text-gray-500 dark:text-gray-400">No favorites yet</p>
            </div>
            <div v-else class="space-y-4">
              <ColorPaletteItem v-for="(item, index) in favorites" :key="index" :colors="item.colors"
                :timestamp="item.timestamp" :isFavorite="item.isFavorite" type="favorite" @load="loadPalette"
                @toggle-favorite="toggleFavorite(item)" />
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>

    <!-- History Clear Confirmation Dialog -->
    <DialogComponent :show="isHistoryClearDialogOpen" @close="isHistoryClearDialogOpen = false" title-size="large"
      priority="high">
      <template #title>Clear History</template>
      <p class="text-gray-600 dark:text-gray-400">
        Are you sure you want to clear your history? This action cannot be undone.
      </p>
      <template #actions>
        <ButtonComponent @click="confirmClearHistory" variant="danger" :icon="TrashIcon">
          Clear
        </ButtonComponent>
        <ButtonComponent @click="isHistoryClearDialogOpen = false" variant="secondary">
          Cancel
        </ButtonComponent>
      </template>
    </DialogComponent>

    <!-- Favorites Import Confirmation Dialog -->
    <DialogComponent :show="isImportDialogOpen" @close="isImportDialogOpen = false" title-size="large" priority="high">
      <template #title>Import Favorites</template>
      <p class="text-gray-600 dark:text-gray-400">
        This will replace all your existing favorites. Are you sure you want to continue?
      </p>
      <template #actions>
        <ButtonComponent @click="confirmImport" variant="primary" :icon="ArrowUpTrayIcon">
          Import
        </ButtonComponent>
        <ButtonComponent @click="isImportDialogOpen = false" variant="secondary">
          Cancel
        </ButtonComponent>
      </template>
    </DialogComponent>

    <!-- Error Dialog -->
    <DialogComponent :show="!!errorMessage" @close="errorMessage = ''" title-size="large" priority="high" show-close>
      <template #title>Error</template>
      <p class="text-gray-600 dark:text-gray-400">
        {{ errorMessage }}
      </p>
      <template #actions>
        <ButtonComponent @click="errorMessage = ''" variant="secondary">
          Close
        </ButtonComponent>
      </template>
    </DialogComponent>

    <!-- Reset Confirmation Dialog -->
    <DialogComponent :show="isOpen" @close="closeModal" centered>
      <template #title>Reset Confirmation</template>
      <p class="text-sm text-gray-700 dark:text-gray-300">
        Are you sure you want to reset all colors? This action cannot be undone.
      </p>
      <template #actions>
        <button type="button"
          class="inline-flex justify-center rounded-lg bg-white/10 dark:bg-gray-800/10 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-white/20 dark:hover:bg-gray-800/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 transition-colors duration-200"
          @click="closeModal">
          Cancel
        </button>
        <button type="button"
          class="inline-flex justify-center rounded-lg bg-red-600/80 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/75 transition-colors duration-200"
          @click="confirmReset">
          Reset
        </button>
      </template>
    </DialogComponent>
  </div>
</template>

<script setup lang="ts">
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, ClockIcon, StarIcon, SwatchIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { computed, onMounted, ref, watch } from 'vue';
import { useColorStore } from '../stores/colorStore';
import ButtonComponent from './ButtonComponent.vue';
import ColorPaletteItem from './ColorPaletteItem.vue';
import DialogComponent from './DialogComponent.vue';

interface PaletteItem {
  colors: string[];
  timestamp: number;
  isFavorite: boolean;
}

interface Props {
  currentColors: string[];
  selectedIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  selectedIndex: 0
});

const emit = defineEmits<{
  (e: 'load', colors: string[]): void;
  (e: 'change', index: number): void;
}>();

const store = useColorStore();

const tabs = [
  {
    name: 'Palette',
    icon: SwatchIcon,
    ringColor: 'ring-blue-400/50 dark:ring-blue-500/50',
    activeColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    name: 'History',
    icon: ClockIcon,
    ringColor: 'ring-purple-400/50 dark:ring-purple-500/50',
    activeColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    name: 'Favorites',
    icon: StarIcon,
    ringColor: 'ring-yellow-400/50 dark:ring-yellow-500/50',
    activeColor: 'text-yellow-600 dark:text-yellow-400'
  }
];

// Dialog state
const isHistoryClearDialogOpen = ref(false);
const isImportDialogOpen = ref(false);
const isOpen = ref(false);  // Added for reset dialog
const errorMessage = ref('');
const fileInput = ref<HTMLInputElement>();
const importData = ref<PaletteItem[]>();

watch(() => props.currentColors, (newColors: string[]) => {
  if (newColors.length === 0) return;
  store.updateColors(newColors);
});

onMounted(() => {
  store.loadFromStorage();
});

const toggleFavorite = (item: PaletteItem) => {
  store.toggleFavorite(item);
};

const loadPalette = (colors: string[]) => {
  emit('load', colors);
  emit('change', 0); // Switch to palette tab after loading colors
};

// Use store's state
const history = computed(() => store.history);
const favorites = computed(() => store.favorites);

const showError = (message: string) => {
  errorMessage.value = message;
};

const confirmClearHistory = () => {
  store.clearHistory();
  isHistoryClearDialogOpen.value = false;
};

const exportFavorites = () => {
  const dataStr = JSON.stringify(favorites.value, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'favorites.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const handleFileSelect = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);

    // Validate the imported data
    if (!Array.isArray(data)) throw new Error('Invalid format: expected an array');

    for (const item of data) {
      if (!Array.isArray(item.colors) || !item.colors.every((c: any) => typeof c === 'string')) {
        throw new Error('Invalid format: colors should be an array of strings');
      }
      if (typeof item.timestamp !== 'number') {
        throw new Error('Invalid format: timestamp should be a number');
      }
      if (typeof item.isFavorite !== 'boolean') {
        throw new Error('Invalid format: isFavorite should be a boolean');
      }
    }

    importData.value = data;

    // Only show confirmation if there are existing favorites
    if (favorites.value.length > 0) {
      isImportDialogOpen.value = true;
    } else {
      confirmImport();
    }
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Invalid file format');
  } finally {
    // Reset the file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

const confirmImport = () => {
  if (importData.value) {
    store.importFavorites(importData.value);
    isImportDialogOpen.value = false;
    importData.value = undefined;
  }
};

// Reset dialog methods
const closeModal = () => {
  isOpen.value = false;
};

const confirmReset = () => {
  // Emit to parent to handle the reset action
  emit('load', []);
  closeModal();
};
</script>
