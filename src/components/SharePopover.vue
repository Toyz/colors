<template>
  <div>
    <div @click="handleClick">
      <slot name="trigger" />
    </div>

    <DialogComponent :show="isOpen" @close="isOpen = false" title-size="large" priority="high" show-close>
      <template #title>Share Colors</template>
      <div class="space-y-4">
        <!-- Share URL Input Group -->
        <div class="relative">
          <div
            class="relative flex overflow-hidden rounded-xl border border-white/20 dark:border-gray-700/20 bg-white/50 dark:bg-gray-900/50">
            <input ref="urlInput" :value="props.shareUrl" readonly class="flex-1 px-4 py-2.5 text-sm font-mono bg-transparent
                text-gray-800 dark:text-gray-200 
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                transition-all duration-300" />
            <button @click="copyToClipboard" class="flex items-center gap-2 px-4 bg-white/10 dark:bg-gray-800/10 hover:bg-white/20 dark:hover:bg-gray-800/20 
                text-sm font-medium text-gray-900 dark:text-gray-100
                border-l border-white/20 dark:border-gray-700/20
                transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
              <component :is="copied ? CheckIcon : ClipboardIcon" class="w-4 h-4"
                :class="{ 'text-emerald-500 dark:text-emerald-400': copied }" />
              <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
            </button>
          </div>
        </div>

        <!-- Info Message -->
        <div class="flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200">
          <ShareIcon class="w-4 h-4" />
          <span>Anyone with the link can view these colors</span>
        </div>
      </div>
    </DialogComponent>
  </div>
</template>

<script setup lang="ts">
import { ClipboardIcon, ShareIcon } from '@heroicons/vue/24/outline';
import { CheckIcon } from '@heroicons/vue/24/solid';
import { nextTick, ref, watch } from 'vue';
import DialogComponent from './DialogComponent.vue';

const props = defineProps<{
  shareUrl: string;
}>();

const emit = defineEmits<{
  (e: 'shared'): void;
}>();

const isOpen = ref(false);
const copied = ref(false);
const urlInput = ref<HTMLInputElement | null>(null);

const handleClick = () => {
  if (props.shareUrl) {
    isOpen.value = true;
    emit('shared');
  }
};

// Prevent opening if no URL
watch(() => props.shareUrl, (newUrl) => {
  if (!newUrl && isOpen.value) {
    isOpen.value = false;
  }
});

// Watch for changes in share URL
watch(() => props.shareUrl, (newUrl) => {
  console.log('Share URL changed:', newUrl);
});

// Add a watcher to autofocus the input when the modal opens
watch(isOpen, (newValue) => {
  if (newValue && urlInput.value) {
    nextTick(() => {
      urlInput.value?.focus();
    });
  }
});

const copyToClipboard = async () => {
  if (!urlInput.value) return;

  try {
    await navigator.clipboard.writeText(props.shareUrl);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    // Fallback for browsers that don't support clipboard API
    urlInput.value.select();
    document.execCommand('copy');
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
};
</script>
