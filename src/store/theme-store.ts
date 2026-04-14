import { create } from 'zustand';

type ColorMode = 'dark' | 'light';

const STORAGE_KEY = 'servy-color-mode';

interface ThemeStore {
  colorMode: ColorMode;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  colorMode: 'dark',
  toggleColorMode: () =>
    set((state) => {
      const next: ColorMode = state.colorMode === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, next);
        document.documentElement.classList.toggle('dark', next === 'dark');
      }
      return { colorMode: next };
    }),
  setColorMode: (mode) =>
    set(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, mode);
        document.documentElement.classList.toggle('dark', mode === 'dark');
      }
      return { colorMode: mode };
    }),
}));
