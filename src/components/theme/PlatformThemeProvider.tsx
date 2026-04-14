'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  PLATFORM_THEME_STORAGE_KEY,
  resolvePlatformTheme,
  type PlatformTheme,
} from '@/lib/platform-theme';
import { useRef } from 'react';

type PlatformThemeContextValue = {
  theme: PlatformTheme;
  setTheme: (theme: PlatformTheme) => void;
};

const PlatformThemeContext = createContext<PlatformThemeContextValue | undefined>(undefined);

function applyTheme(theme: PlatformTheme) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.platformTheme = theme;
}

export default function PlatformThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<PlatformTheme>('pastel-blue');
  const hydratedRef = useRef(false);

  useEffect(() => {
    const storedTheme = resolvePlatformTheme(localStorage.getItem(PLATFORM_THEME_STORAGE_KEY));
    setThemeState(storedTheme);
    applyTheme(storedTheme);
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    applyTheme(theme);
    localStorage.setItem(PLATFORM_THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== PLATFORM_THEME_STORAGE_KEY) return;
      const nextTheme = resolvePlatformTheme(event.newValue);
      setThemeState(nextTheme);
      applyTheme(nextTheme);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme: setThemeState,
    }),
    [theme],
  );

  return <PlatformThemeContext.Provider value={value}>{children}</PlatformThemeContext.Provider>;
}

export function usePlatformTheme() {
  const context = useContext(PlatformThemeContext);

  if (!context) {
    throw new Error('usePlatformTheme must be used within PlatformThemeProvider');
  }

  return context;
}
