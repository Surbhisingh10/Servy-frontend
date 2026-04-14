import Link from 'next/link';
import type { ReactNode } from 'react';

export default function MarketingButton({
  href,
  children,
  variant = 'primary',
  className = '',
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-200 active:scale-[0.97]';
  const styles =
    variant === 'primary'
      ? 'bg-[linear-gradient(135deg,#10b981_0%,#0f766e_100%)] text-white shadow-[0_12px_28px_rgba(16,185,129,0.22)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(16,185,129,0.30)]'
      : 'border border-emerald-200 bg-white text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/60 hover:shadow-[0_6px_16px_rgba(15,23,42,0.08)]';

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
