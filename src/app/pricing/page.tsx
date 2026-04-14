import type { Metadata } from 'next';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Headphones,
  Receipt,
  Target,
  Users,
  Utensils,
  WifiOff,
  Zap,
} from 'lucide-react';
import MarketingBadge from '@/components/marketing/MarketingBadge';
import MarketingButton from '@/components/marketing/MarketingButton';
import MarketingContainer from '@/components/marketing/MarketingContainer';
import MarketingSection from '@/components/marketing/MarketingSection';
import MarketingShell from '@/components/marketing/MarketingShell';
import Reveal from '@/components/marketing/Reveal';
import FaqAccordion from '@/components/marketing/FaqAccordion';
import RoiCalculator from '@/components/marketing/RoiCalculator';
import { pricingFaqItems, pricingPlans } from '@/lib/marketing-site-content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://servy.app';

export const metadata: Metadata = {
  title: 'Pricing | Servy',
  description: 'Transparent plans for single outlets, growing teams, and multi-location brands.',
  openGraph: {
    title: 'Pricing | Servy',
    description: 'Transparent plans for single outlets, growing teams, and multi-location brands.',
    url: `${SITE_URL}/pricing`,
    siteName: 'Servy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing | Servy',
    description: 'Transparent plans for single outlets, growing teams, and multi-location brands.',
  },
};

const pricingFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: pricingFaqItems.slice(0, 4).map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default function PricingPage() {
  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqSchema) }}
      />
      <main>
        <MarketingSection tone="brand" className="pt-8 lg:pt-12">
          <MarketingContainer>
            <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
              <Reveal>
                <div>
                  <MarketingBadge>Pricing & Demo</MarketingBadge>
                  <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                    Transparent plans for every stage of growth.
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                    Choose the starting point that matches your current structure. Scale into control,
                    reporting, and support when you need it.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {['Starter', 'Growth', 'Scale'].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="rounded-[2.25rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ['Transparent', 'Clear pricing before rollout.'],
                      ['Support SLA', 'Coverage that matches service hours.'],
                      ['Offline mode', 'Billing continues without internet.'],
                      ['Fast onboarding', 'Concierge setup for launch readiness.'],
                    ].map(([title, text]) => (
                      <div key={title} className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                        <p className="text-sm font-semibold text-slate-900">{title}</p>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </MarketingContainer>
        </MarketingSection>

        <MarketingSection>
          <MarketingContainer>
            <div className="grid items-stretch gap-5 lg:grid-cols-3">
              {pricingPlans.map((plan, index) => (
                <Reveal key={plan.name} delay={index * 0.06} className="h-full">
                  <article
                    className={`flex h-full flex-col rounded-[2rem] border p-6 shadow-[0_16px_44px_rgba(15,23,42,0.05)] ${
                      plan.featured
                        ? 'border-emerald-200 bg-[linear-gradient(180deg,rgba(16,185,129,0.06)_0%,#ffffff_56%)]'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700">
                        {plan.name}
                      </p>
                      {plan.featured ? (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Recommended
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-5 flex items-end gap-2">
                      <span className="text-4xl font-semibold tracking-tight text-slate-900">
                        {plan.price}
                      </span>
                      <span className="pb-1 text-sm text-slate-500">/month</span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{plan.description}</p>
                    <div className="mt-6 grid gap-2">
                      {plan.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-3 rounded-[1.35rem] border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700"
                        >
                          <CheckCircle2 size={16} className="mt-0.5 text-emerald-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <MarketingButton
                      href="/contact"
                      variant={plan.featured ? 'primary' : 'secondary'}
                      className="mt-8 w-full"
                    >
                      {plan.name === 'Scale' ? 'Contact sales' : 'Book Demo'}
                      <ArrowRight size={16} />
                    </MarketingButton>
                  </article>
                </Reveal>
              ))}
            </div>
          </MarketingContainer>
        </MarketingSection>

        <MarketingSection tone="muted">
          <MarketingContainer>
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <MarketingBadge>ROI Calculator</MarketingBadge>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Estimate your return before committing.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  Adjust your outlet count, daily orders, and order value to see what the platform can
                  unlock each month.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.06} className="mt-10">
              <RoiCalculator />
            </Reveal>
          </MarketingContainer>
        </MarketingSection>

        <MarketingSection>
          <MarketingContainer>
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <MarketingBadge>What is included</MarketingBadge>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  More than pricing. A complete launch path.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  Higher tiers add more control, reporting depth, and support coverage.
                </p>
              </div>
            </Reveal>
            <div className="mt-10 grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { icon: Utensils, title: 'Recipe precision', text: 'Ingredient-level inventory and item deduction.' },
                { icon: Users, title: 'Customer memory', text: 'CRM, reviews, loyalty, and special-day campaigns.' },
                { icon: Building2, title: 'Multi-outlet control', text: 'Roles, reporting, and branch-level visibility.' },
                { icon: Receipt, title: 'Reconciliation', text: 'Commission, tax, and payout difference tracking.' },
                { icon: Zap, title: 'Fast onboarding', text: 'Clear rollout steps for each outlet.' },
                { icon: Headphones, title: '24/7 support SLA', text: 'Support visibility that feels real, not vague.' },
                { icon: WifiOff, title: 'Offline mode', text: 'Billing remains available during network issues.' },
                { icon: Target, title: 'Audience fit', text: 'Single outlets through large chains.' },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={index * 0.05} className="h-full">
                    <div className="flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(16,185,129,0.10),rgba(15,118,110,0.10))] text-emerald-700">
                        <Icon size={18} />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-2 flex-1 text-sm leading-7 text-slate-600">{item.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </MarketingContainer>
        </MarketingSection>

        <MarketingSection tone="muted">
          <MarketingContainer>
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <MarketingBadge>FAQ</MarketingBadge>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Questions answered before the first call.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  Keep pricing conversations simple and focused so restaurant teams can decide fast.
                </p>
              </div>
            </Reveal>
            <div className="mt-10">
              <FaqAccordion />
            </div>
          </MarketingContainer>
        </MarketingSection>

      </main>
    </MarketingShell>
  );
}
