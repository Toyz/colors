<template>
  <div>
    <div @click="handleClick">
      <slot name="trigger" />
    </div>

    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" @close="isOpen = false" class="relative z-50">
        <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0 backdrop-blur-none"
          enter-to="opacity-100 backdrop-blur-sm" leave="duration-200 ease-in" leave-from="opacity-100 backdrop-blur-sm"
          leave-to="opacity-0 backdrop-blur-none">
          <div class="fixed inset-0 bg-black/30 transition-all duration-300" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-md">
                <div class="overflow-hidden rounded-xl shadow-xl">
                  <div
                    class="relative bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 p-6">
                    <div class="flex justify-between items-center mb-4">
                      <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Share Colors
                      </DialogTitle>
                      <button @click="isOpen = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
                        transition-colors duration-200">
                        <XMarkIcon class="w-5 h-5" />
                      </button>
                    </div>
                    <div class="relative group">
                      <div class="relative">
                        <input ref="urlInput" :value="props.shareUrl" readonly class="w-full px-4 py-3 pr-24 rounded-lg text-sm font-mono bg-white/50 dark:bg-gray-900/50 
                          border border-white/20 dark:border-gray-700/20 
                          text-gray-800 dark:text-gray-200 
                          focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                          transition-all duration-300" />
                        <ButtonComponent @click="copyToClipboard" variant="primary" size="sm"
                          class="absolute right-1.5 top-1.5">
                          {{ copied ? 'Copied!' : 'Copy' }}
                        </ButtonComponent>
                      </div>
                    </div>
                    <div class="mt-4 flex items-center gap-3 text-sm text-gray-800 dark:text-gray-200">
                      <ShareIcon class="w-4 h-4" />
                      <span>Anyone with the link can view these colors</span>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { ShareIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { nextTick, ref, watch } from 'vue';
import ButtonComponent from './ButtonComponent.vue';

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
