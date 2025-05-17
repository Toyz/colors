<template>
  <div
    class="flex items-center justify-between p-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
    <div class="flex flex-col gap-2 min-w-0">
      <div class="group relative overflow-hidden rounded-lg">
        <!-- Navigation Arrows -->
        <button v-if="hasScroll && !isAtStart" @click="scrollToNextPage('left')"
          class="absolute left-0 top-0 w-8 h-8 rounded-lg bg-gray-900/50 dark:bg-gray-900/70 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 
                 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-900/60 dark:hover:bg-gray-900/80 z-10 flex items-center justify-center">
          <ChevronLeftIcon class="w-5 h-5 text-white/90 dark:text-white/90" />
        </button>
        <button v-if="hasScroll && !isAtEnd" @click="scrollToNextPage('right')"
          class="absolute right-0 top-0 w-8 h-8 rounded-lg bg-gray-900/50 dark:bg-gray-900/70 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 
                 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-900/60 dark:hover:bg-gray-900/80 z-10 flex items-center justify-center">
          <ChevronRightIcon class="w-5 h-5 text-white/90 dark:text-white/90" />
        </button>

        <div
          class="flex items-center space-x-2 overflow-x-auto no-scrollbar relative scroll-smooth max-w-[calc(100vw-16rem)] rounded-lg overflow-hidden"
          ref="container" @scroll="checkScroll">
          <div v-for="color in colors" :key="color"
            class="w-8 h-8 rounded-lg border border-white/20 dark:border-gray-700/20 flex-shrink-0 group/color cursor-pointer"
            :style="{ backgroundColor: color }">
            <div
              class="hidden group-hover/color:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap">
              {{ color }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center text-xs text-gray-500/80 dark:text-gray-400/80">
        <div class="flex items-center">
          <SwatchIcon class="w-3.5 h-3.5 mr-1 inline-block" />
          <span>{{ colors.length }} colors</span>
        </div>
        <span class="mx-1.5">·</span>
        <div class="flex items-center">
          <component :is="icon" class="w-3.5 h-3.5 mr-1 inline-block" />
          <span>{{ formattedDate }}</span>
        </div>
      </div>
    </div>
    <div class="flex items-center space-x-4 ml-4">
      <button @click="$emit('load', colors)"
        class="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
        <ArrowPathIcon class="w-5 h-5" />
      </button>
      <button @click="$emit('toggleFavorite')"
        class="p-2 text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors">
        <component :is="isFavorite ? StarIconSolid : StarIcon" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, StarIcon, SwatchIcon } from '@heroicons/vue/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/vue/24/solid';
import { computed, onMounted, onUnmounted, ref } from 'vue';

interface Props {
  colors: string[];
  timestamp: number;
  isFavorite: boolean;
  type: 'history' | 'favorite';
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'load', colors: string[]): void;
  (e: 'toggleFavorite'): void;
}>();

const container = ref<HTMLElement | null>(null);
const hasScroll = ref(false);
const isAtStart = ref(true);
const isAtEnd = ref(false);

const checkScroll = () => {
  if (container.value) {
    const el = container.value;
    hasScroll.value = el.scrollWidth > el.clientWidth;
    isAtStart.value = el.scrollLeft <= 0;
    isAtEnd.value = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;
  }
};

const scrollToNextPage = (direction: 'left' | 'right') => {
  if (!container.value) return;

  const el = container.value;
  const scrollAmount = el.clientWidth - 40; // Leave a bit of overlap
  const targetScroll = el.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);

  el.scrollTo({
    left: targetScroll,
    behavior: 'smooth'
  });
};

onMounted(() => {
  checkScroll();
  window.addEventListener('resize', checkScroll);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScroll);
});

const icon = computed(() => props.type === 'history' ? ClockIcon : StarIcon);

const formattedDate = computed(() => {
  const date = new Date(props.timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
});
</script>
