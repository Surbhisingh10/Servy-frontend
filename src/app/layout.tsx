import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import PlatformThemeProvider from '@/components/theme/PlatformThemeProvider';
import ColorModeProvider from '@/components/theme/ColorModeProvider';
import { resolvePlatformTheme } from '@/lib/platform-theme';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://servy.app';

export const metadata: Metadata = {
  title: {
    default: 'Servy',
    template: '%s',
  },
  description: 'Modern restaurant SaaS for QR ordering, CRM, promotions, and unified order management.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: 'Servy',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@servy',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultTheme = resolvePlatformTheme(process.env.NEXT_PUBLIC_PLATFORM_THEME);

  return (
    <html lang="en" data-platform-theme={defaultTheme} suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var key = 'servy-platform-theme';
                  var saved = localStorage.getItem(key);
                  var theme = ['pastel-blue', 'emerald-green', 'saffron'].includes(saved) ? saved : '${defaultTheme}';
                  document.documentElement.dataset.platformTheme = theme;
                } catch (e) {}
                try {
                  var colorMode = localStorage.getItem('servy-color-mode');
                  if (colorMode !== 'light') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans">
        <ColorModeProvider>
          <PlatformThemeProvider>{children}</PlatformThemeProvider>
        </ColorModeProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
