import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import Reveal from './Reveal';
import { pricingPlans } from '@/lib/marketing-content';

export default function PricingCards() {
  return (
    <div className="grid items-stretch gap-5 lg:grid-cols-3">
      {pricingPlans.map((plan, index) => (
        <Reveal key={plan.name} delay={index * 0.07} className="h-full">
          <article
            className={`group flex h-full flex-col rounded-[2rem] border p-8 transition duration-300 hover:-translate-y-1.5 ${
              plan.featured
                ? 'border-emerald-300 bg-[linear-gradient(180deg,rgba(236,253,245,0.95)_0%,rgba(255,255,255,1)_100%)] shadow-[0_28px_65px_rgba(4,57,39,0.16)] hover:shadow-[0_36px_80px_rgba(4,57,39,0.22)]'
                : 'border-slate-200 bg-white shadow-[0_18px_44px_rgba(15,23,42,0.06)] hover:border-emerald-200 hover:shadow-[0_24px_56px_rgba(15,23,42,0.10)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">
                {plan.name}
              </p>
              {plan.featured ? (
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  Most popular
                </span>
              ) : null}
            </div>

            <div className="mt-6 flex items-end gap-1">
              <span className="text-5xl font-semibold tracking-tight text-slate-900">{plan.price}</span>
              <span className="pb-2 text-sm text-slate-500">{plan.cadence}</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{plan.description}</p>

            <div className="mt-8 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-emerald-500"
                  />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Link
              href={plan.href}
              className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 active:scale-[0.97] ${
                plan.featured
                  ? 'bg-[linear-gradient(135deg,#10b981_0%,#0f766e_100%)] text-white shadow-[0_10px_28px_rgba(16,185,129,0.22)] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(16,185,129,0.30)]'
                  : 'border border-emerald-200 bg-white text-slate-900 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/60'
              }`}
            >
              {plan.cta}
            </Link>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
