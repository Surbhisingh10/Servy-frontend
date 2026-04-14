'use client';

import { useEffect, type ReactNode } from 'react';
import { useThemeStore } from '@/store/theme-store';

const STORAGE_KEY = 'servy-color-mode';

export default function ColorModeProvider({ children }: { children: ReactNode }) {
  const { setColorMode } = useThemeStore();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as 'dark' | 'light' | null;
    const resolved: 'dark' | 'light' = saved === 'light' ? 'light' : 'dark';
    setColorMode(resolved);
  }, [setColorMode]);

  return <>{children}</>;
}
