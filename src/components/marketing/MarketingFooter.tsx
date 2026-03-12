import Link from 'next/link';
import { marketingNavLinks } from '@/lib/marketing-content';

export default function MarketingFooter() {
  return (
    <footer className="border-t border-primary-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary-600">
            Restaurant SaaS
          </p>
          <h3 className="max-w-md text-2xl font-semibold text-slate-900">
            Unified restaurant operations, CRM, and growth in one platform.
          </h3>
          <p className="max-w-lg text-sm leading-7 text-slate-600">
            Built for restaurants that want smoother ordering, stronger repeat business, and less
            operational chaos.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">Explore</p>
          <div className="mt-4 flex flex-col gap-3">
            {marketingNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-slate-600 hover:text-slate-900">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">Product Access</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <Link href="/auth/login" className="hover:text-slate-900">
              Login to Dashboard
            </Link>
            <Link href="/auth/register" className="hover:text-slate-900">
              Start Free Trial
            </Link>
            <Link href="/demo" className="hover:text-slate-900">
              Book a Demo
            </Link>
            <p>hello@restaurantsaas.com</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
