import type { ReactNode } from 'react';

export default function MarketingSection({
  children,
  className = '',
  tone = 'default',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'muted' | 'brand';
}) {
  const toneClasses =
    tone === 'muted'
      ? 'bg-[linear-gradient(180deg,rgba(236,253,245,0.55)_0%,rgba(255,253,248,0.96)_55%,rgba(240,253,244,0.45)_100%)]'
      : tone === 'brand'
        ? 'bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.1),transparent_42%)]'
        : '';

  return <section className={`py-20 lg:py-24 ${toneClasses} ${className}`}>{children}</section>;
}
