import { defineStore } from 'pinia';

interface PaletteItem {
  colors: string[];
  timestamp: number;
  isFavorite: boolean;
}

// Utility functions
function normalizeColor(color: string): string | false {
  if (!color) return false;
  const normalizedColor = color.trim().toUpperCase();
  // Convert 3-digit hex to 6-digit hex
  if (/^#[A-F0-9]{3}$/.test(normalizedColor)) {
    const [_, r, g, b] = normalizedColor.match(/#([A-F0-9])([A-F0-9])([A-F0-9])/) || [];
    return r && g && b ? `#${r}${r}${g}${g}${b}${b}` : false;
  }
  return /^#[A-F0-9]{6}$/.test(normalizedColor) ? normalizedColor : false;
}

function areColorArraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.map((c: string) => normalizeColor(c))
    .every((color, index) => color === normalizeColor(arr2[index]));
}

export const useColorStore = defineStore('colors', {
  state: () => ({
    currentColors: [] as string[],
    history: [] as PaletteItem[],
    favorites: [] as PaletteItem[],
  }),

  getters: {
    shareableUrl(state) {
      // Only generate URL if we have at least one valid color
      const validColors = state.currentColors
        .filter((color: string): color is string => Boolean(color))  // Filter out null/undefined/empty
        .map((color: string) => {
          const normalized = color.trim().toUpperCase();
          // Add debug logging
          console.log('Processing color:', { original: color, normalized });
          return /^#[A-F0-9]{6}$/.test(normalized) ? normalized : null;
        })
        .filter((color: string | null): color is string => Boolean(color));  // Filter out nulls

      // Add debug logging
      console.log('Valid colors:', validColors);

      if (validColors.length === 0) return '';

      const uniqueColors = Array.from(new Set(validColors));
      const colorString = uniqueColors.join(',');
      const base64Colors = btoa(colorString);
      return `${window.location.origin}${window.location.pathname}#${base64Colors}`;
    },

    hasValidColors(state) {
      return state.currentColors.some((color: string) => normalizeColor(color) !== false);
    }
  },

  actions: {
    updateColors(colors: string[], shared: boolean = false) {
      this.currentColors = colors;
      if (shared) {
        this.addToHistory(colors, true);
      }
    },

    addToHistory(colors: string[], shared: boolean = false) {
      // Only add to history if colors were shared or loaded from a share
      if (!shared || colors.length === 0) return;

      const validColors = colors
        .map((color: string) => normalizeColor(color))
        .filter((color: string | false): color is string => color !== false);

      if (validColors.length === 0) return;

      const newItem: PaletteItem = {
        colors: validColors,
        timestamp: Date.now(),
        isFavorite: false
      };

      // Check for duplicates in both history and favorites
      const isDuplicate = this.history.some((historyItem: PaletteItem) =>
        areColorArraysEqual(historyItem.colors, validColors)
      );

      if (!isDuplicate) {
        this.history.unshift(newItem);
        if (this.history.length > 10) {
          this.history.pop();
        }
        this.saveHistory();
      }
    },

    toggleFavorite(item: PaletteItem) {
      item.isFavorite = !item.isFavorite;

      if (item.isFavorite) {
        // Check if already in favorites
        const isDuplicate = this.favorites.some((fav: PaletteItem) =>
          areColorArraysEqual(fav.colors, item.colors)
        );

        if (!isDuplicate) {
          this.favorites.unshift({ ...item });
        }
      } else {
        const index = this.favorites.findIndex((fav: PaletteItem) =>
          areColorArraysEqual(fav.colors, item.colors)
        );
        if (index !== -1) {
          this.favorites.splice(index, 1);
        }
      }

      this.saveFavorites();
    },

    loadFromStorage() {
      const savedHistory = localStorage.getItem('colorHistory');
      const savedFavorites = localStorage.getItem('colorFavorites');

      if (savedHistory) {
        this.history = JSON.parse(savedHistory);
        // Update isFavorite status based on favorites
        if (savedFavorites) {
          const favorites = JSON.parse(savedFavorites) as PaletteItem[];
          this.history = this.history.map((historyItem: PaletteItem) => ({
            ...historyItem,
            isFavorite: favorites.some((fav: PaletteItem) => areColorArraysEqual(fav.colors, historyItem.colors))
          }));
        }
      }

      if (savedFavorites) {
        this.favorites = JSON.parse(savedFavorites);
      }
    },

    saveHistory() {
      localStorage.setItem('colorHistory', JSON.stringify(this.history));
    },

    saveFavorites() {
      localStorage.setItem('colorFavorites', JSON.stringify(this.favorites));
    },

    resetColors() {
      this.currentColors = [];
    },

    clearHistory() {
      this.history = [];
      this.saveHistory();
    },

    importFavorites(favorites: PaletteItem[]) {
      // Replace existing favorites with imported ones
      this.favorites = favorites;
      this.saveFavorites();

      // Update history items to reflect new favorite status
      this.history = this.history.map((historyItem: PaletteItem) => ({
        ...historyItem,
        isFavorite: this.favorites.some((fav: PaletteItem) => areColorArraysEqual(fav.colors, historyItem.colors))
      }));
      this.saveHistory();
    }
  }
});
