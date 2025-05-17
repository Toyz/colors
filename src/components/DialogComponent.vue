<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="$emit('close')"
      :class="['relative', { 'z-50': priority === 'high', 'z-10': priority === 'normal' }]">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4" :class="{ 'text-center': centered }">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-md bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20"
              :class="{ 'text-left': !centered }">
              <div :class="[{ 'flex justify-between items-center': showClose }, 'mb-4']">
                <DialogTitle :class="[
                  'text-gray-900 dark:text-gray-100',
                  titleSize === 'large' ? 'text-2xl font-semibold' : 'text-lg font-medium leading-6'
                ]">
                  <slot name="title" />
                </DialogTitle>
                <button v-if="showClose" @click="$emit('close')"
                  class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>

              <div :class="{ 'mt-2': !showClose, 'mb-6': hasActions }">
                <slot />
              </div>

              <div v-if="$slots.actions" :class="[
                'flex',
                actionsAlign === 'right' ? 'justify-end' : 'justify-start',
                { 'gap-3': !spaceButtons, 'space-x-4': spaceButtons }
              ]">
                <slot name="actions" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

interface Props {
  show: boolean;
  titleSize?: 'normal' | 'large';
  showClose?: boolean;
  centered?: boolean;
  priority?: 'normal' | 'high';
  actionsAlign?: 'left' | 'right';
  spaceButtons?: boolean;
  hasActions?: boolean;
}

withDefaults(defineProps<Props>(), {
  titleSize: 'normal',
  showClose: false,
  centered: false,
  priority: 'normal',
  actionsAlign: 'right',
  spaceButtons: true,
  hasActions: true
});

defineEmits<{
  (e: 'close'): void;
}>();
</script>
