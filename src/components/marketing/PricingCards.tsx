import Link from 'next/link';
import { pricingPlans } from '@/lib/marketing-content';

export default function PricingCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {pricingPlans.map((plan) => (
        <article
          key={plan.name}
          className={`rounded-[2rem] border p-8 ${
            plan.featured
              ? 'border-primary-300 bg-primary-50 shadow-[0_28px_65px_rgba(4,57,39,0.16)]'
              : 'border-slate-200 bg-white shadow-[0_18px_44px_rgba(15,23,42,0.06)]'
          }`}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-600">
            {plan.name}
          </p>
          <div className="mt-6 flex items-end gap-1">
            <span className="text-5xl font-semibold tracking-tight text-slate-900">{plan.price}</span>
            <span className="pb-2 text-sm text-slate-500">{plan.cadence}</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600">{plan.description}</p>

          <div className="mt-8 space-y-3">
            {plan.features.map((feature) => (
              <div key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="mt-2 h-2 w-2 rounded-full bg-primary-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <Link
            href={plan.href}
            className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
              plan.featured
                ? 'bg-primary-500 text-white hover:bg-primary-600'
                : 'border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {plan.cta}
          </Link>
        </article>
      ))}
    </div>
  );
}
