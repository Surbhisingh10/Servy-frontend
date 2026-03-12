'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { marketingNavLinks } from '@/lib/marketing-content';

export default function MarketingNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-primary-100/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-500 text-sm font-bold text-white shadow-[0_14px_30px_rgba(255,69,0,0.2)]">
            RS
          </div>
          <div>
            <p className="font-semibold text-slate-900">Restaurant SaaS</p>
            <p className="text-xs uppercase tracking-[0.32em] text-primary-600">Growth OS</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {marketingNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${
                pathname === link.href ? 'text-primary-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/auth/login"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(255,69,0,0.22)] transition hover:bg-primary-600"
          >
            Start Free Trial
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-primary-100 bg-white px-6 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {marketingNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-sm font-medium ${
                  pathname === link.href ? 'text-primary-700' : 'text-slate-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3">
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="rounded-full border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setOpen(false)}
                className="rounded-full bg-primary-500 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
