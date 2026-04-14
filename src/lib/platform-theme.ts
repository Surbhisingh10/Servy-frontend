export const PLATFORM_THEME_STORAGE_KEY = 'servy-platform-theme';

export const platformThemes = ['pastel-blue', 'emerald-green', 'saffron'] as const;

export type PlatformTheme = (typeof platformThemes)[number];

export type PlatformThemeConfig = {
  label: string;
  description: string;
  accent: string;
};

export const platformThemeConfig: Record<PlatformTheme, PlatformThemeConfig> = {
  'pastel-blue': {
    label: 'Pastel Blue',
    description: 'Soft, airy, and calm.',
    accent: '#3b82f6',
  },
  'emerald-green': {
    label: 'Emerald Green',
    description: 'Fresh, premium, and grounded.',
    accent: '#10b981',
  },
  saffron: {
    label: 'Saffron',
    description: 'Warm, bold, and familiar.',
    accent: '#ff4500',
  },
};

export function isPlatformTheme(value: string | null | undefined): value is PlatformTheme {
  return Boolean(value && platformThemes.includes(value as PlatformTheme));
}

export function resolvePlatformTheme(value: string | null | undefined): PlatformTheme {
  return isPlatformTheme(value) ? value : 'pastel-blue';
}
