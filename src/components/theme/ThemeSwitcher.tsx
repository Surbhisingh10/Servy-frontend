'use client';

import { ChevronDown } from 'lucide-react';
import { platformThemeConfig, platformThemes, type PlatformTheme } from '@/lib/platform-theme';
import { usePlatformTheme } from './PlatformThemeProvider';

export default function ThemeSwitcher({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  const { theme, setTheme } = usePlatformTheme();
  const activeConfig = platformThemeConfig[theme];

  if (compact) {
    return (
      <div className="relative w-full">
        <span
          className="pointer-events-none absolute left-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: activeConfig.accent }}
        />
        <select
          value={theme}
          onChange={(event) => setTheme(event.target.value as PlatformTheme)}
          className={`w-full appearance-none rounded-2xl border py-3 pl-9 pr-10 text-sm font-semibold shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 ${
            dark
              ? 'border-white/10 bg-white/5 text-slate-100 focus:ring-white/10'
              : 'border-slate-200 bg-white text-slate-800 focus:ring-primary-100'
          }`}
        >
          {platformThemes.map((themeKey) => {
            const config = platformThemeConfig[themeKey];
            return (
              <option key={themeKey} value={themeKey}>
                {config.label}
              </option>
            );
          })}
        </select>
        <ChevronDown
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${
            dark ? 'text-slate-400' : 'text-slate-400'
          }`}
          size={16}
        />
      </div>
    );
  }

  return (
    <div className="min-w-[230px]">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
        Theme
      </label>
      <div className="relative">
        <span
          className="pointer-events-none absolute left-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: activeConfig.accent }}
        />
        <select
          value={theme}
          onChange={(event) => setTheme(event.target.value as PlatformTheme)}
          className={`w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-9 pr-10 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 ${
            compact ? 'min-w-0' : ''
          }`}
        >
          {platformThemes.map((themeKey) => {
            const config = platformThemeConfig[themeKey];
            return (
              <option key={themeKey} value={themeKey}>
                {config.label}
              </option>
            );
          })}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">{activeConfig.description}</p>
    </div>
  );
}
