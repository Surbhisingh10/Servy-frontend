import type { Metadata } from 'next';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Headphones,
  LayoutDashboard,
  Plug,
  ShieldCheck,
  Store,
  TrendingUp,
  Users,
  Utensils,
  WifiOff,
} from 'lucide-react';
import MarketingBadge from '@/components/marketing/MarketingBadge';
import MarketingButton from '@/components/marketing/MarketingButton';
import MarketingContainer from '@/components/marketing/MarketingContainer';
import MarketingSection from '@/components/marketing/MarketingSection';
import MarketingShell from '@/components/marketing/MarketingShell';
import Reveal from '@/components/marketing/Reveal';
import FaqAccordion from '@/components/marketing/FaqAccordion';
import { finalCta, faqItems } from '@/lib/marketing-site-content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://servy.app';

export const metadata: Metadata = {
  title: 'How It Works | Servy',
  description: 'From menu setup to daily service — a guided, calm path to running your restaurant on one platform.',
  openGraph: {
    title: 'How It Works | Servy',
    description: 'From menu setup to daily service — a guided, calm path to running your restaurant on one platform.',
    url: `${SITE_URL}/how-it-works`,
    siteName: 'Servy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How It Works | Servy',
    description: 'From menu setup to daily service — a guided, calm path to running your restaurant on one platform.',
  },
};

const howItWorksFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.slice(0, 4).map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

const steps = [
  {
    number: '01',
    title: 'Set up your menu and outlets',
    description:
      'Upload your full menu with items, pricing, modifiers, and outlet-specific overrides. Configure table QR codes, add team members with role-based access, and wire in your aggregator channels — all in one guided flow.',
    tags: ['Menu upload', 'QR tables', 'Role setup'],
    icon: Utensils,
  },
  {
    number: '02',
    title: 'Connect every order channel',
    description:
      'Pull Swiggy, Zomato, Dineout, and direct QR orders into a single unified queue. No separate tablets, no missed tickets. Your kitchen sees one live board regardless of where the order came from.',
    tags: ['Aggregator sync', 'Unified queue', 'Live kitchen board'],
    icon: Plug,
  },
  {
    number: '03',
    title: 'Go live with your team',
    description:
      'Our concierge team walks floor staff, kitchen, and admin through one onboarding session. Offline billing is enabled from day one so the front counter keeps running even when the network dips.',
    tags: ['Concierge onboarding', 'Team training', 'Offline billing'],
    icon: Store,
  },
  {
    number: '04',
    title: 'Run service and grow',
    description:
      'Orders flow in, prep is tracked, and billing closes without manual entry. Reports surface your best items, busiest hours, and repeat guests. Add a new outlet or launch a campaign without changing tools.',
    tags: ['Live reporting', 'CRM', 'Multi-outlet'],
    icon: TrendingUp,
  },
];

const guarantees = [
  {
    icon: ShieldCheck,
    title: 'Offline billing',
    description: 'Billing stays live when the network drops. No lost orders at the front counter during peak service.',
  },
  {
    icon: Headphones,
    title: '24/7 support SLA',
    description: 'Real support coverage that matches your service hours — not a ticket system that replies tomorrow.',
  },
  {
    icon: Clock,
    title: 'Fast go-live',
    description: 'Most outlets are live within one concierge session. No weeks of IT setup or complex migrations.',
  },
  {
    icon: LayoutDashboard,
    title: 'One interface for everyone',
    description: 'Floor, kitchen, and admin work from the same system. No app-switching, no conflicting data.',
  },
  {
    icon: Users,
    title: 'Guest memory built in',
    description: 'Every order builds a CRM record. Loyalty, review signals, and repeat-visit campaigns ready from day one.',
  },
  {
    icon: WifiOff,
    title: 'No extra hardware',
    description: 'Runs on existing tablets and phones. Aggregator orders consolidate automatically — no extra devices needed.',
  },
];

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howItWorksFaqSchema) }}
      />
      <main>

        {/* Hero */}
        <MarketingSection tone="brand" className="pt-8 lg:pt-16">
          <MarketingContainer>
            <Reveal>
              <div className="mx-auto max-w-3xl text-center">
                <MarketingBadge>How it works</MarketingBadge>
                <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                  From setup to daily service
                  <br className="hidden sm:block" />
                  <span className="text-emerald-700"> in four steps.</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  A guided, calm rollout designed for restaurant teams — not IT departments. Most outlets
                  are live after a single onboarding session.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <MarketingButton href="/contact">
                    Book a Demo
                    <ArrowRight size={16} />
                  </MarketingButton>
                  <MarketingButton href="/pricing" variant="secondary">
                    View Pricing
                  </MarketingButton>
                </div>
              </div>
            </Reveal>

            {/* Quick stats strip */}
            <Reveal delay={0.1}>
              <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 divide-x divide-slate-200 rounded-[2rem] border border-slate-200 bg-white shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
                {[
                  { value: '1 session', label: 'Average go-live time' },
                  { value: '24/7', label: 'Support coverage' },
                  { value: 'Offline', label: 'Billing always on' },
                ].map(({ value, label }) => (
                  <div key={label} className="flex flex-col items-center px-6 py-5 text-center">
                    <p className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{value}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </MarketingContainer>
        </MarketingSection>

        {/* 4 Steps */}
        <MarketingSection>
          <MarketingContainer>
            <Reveal>
              <div className="mx-auto max-w-xl text-center">
                <MarketingBadge>The process</MarketingBadge>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  A clear path at every stage.
                </h2>
              </div>
            </Reveal>

            <div className="relative mt-12 space-y-4">
              {/* Connector line — decorative, desktop only */}
              <div className="absolute left-[2.125rem] top-16 hidden h-[calc(100%-5rem)] w-px bg-slate-100 lg:block" />

              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Reveal key={step.number} delay={index * 0.07}>
                    <div className="relative grid gap-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_32px_rgba(15,23,42,0.05)] lg:grid-cols-[4.5rem_1fr_auto] lg:items-start lg:gap-8 lg:p-8">
                      {/* Step number */}
                      <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-2xl bg-slate-900 text-white">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-400">
                          Step
                        </span>
                        <span className="text-2xl font-bold leading-none">{step.number}</span>
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                            <Icon size={16} />
                          </div>
                          <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                            {step.title}
                          </h3>
                        </div>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                          {step.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
                        {step.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </MarketingContainer>
        </MarketingSection>

        {/* What you get */}
        <MarketingSection tone="muted">
          <MarketingContainer>
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <MarketingBadge>What you get</MarketingBadge>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Built for service reality, not ideal conditions.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  Every decision in the platform is made for what actually happens during a busy lunch rush —
                  not what a demo environment assumes.
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {guarantees.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={index * 0.05} className="h-full">
                    <div className="flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(16,185,129,0.10),rgba(15,118,110,0.10))] text-emerald-700">
                        <Icon size={18} />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-2 flex-1 text-sm leading-7 text-slate-600">{item.description}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </MarketingContainer>
        </MarketingSection>

        {/* Reliability highlight */}
        <MarketingSection>
          <MarketingContainer>
            <Reveal>
              <div className="overflow-hidden rounded-[2.25rem] border border-emerald-100 bg-[linear-gradient(135deg,rgba(16,185,129,0.06)_0%,rgba(15,118,110,0.04)_100%)]">
                <div className="grid gap-0 lg:grid-cols-2">
                  <div className="p-8 lg:p-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                      <ShieldCheck size={22} />
                    </div>
                    <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                      Offline-first billing.
                      <br />
                      No excuses at the counter.
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      Network outages are not your problem. Billing, order capture, and kitchen routing
                      continue without interruption. When connectivity restores, everything syncs
                      automatically — no manual reconciliation required.
                    </p>
                  </div>
                  <div className="border-t border-emerald-100 p-8 lg:border-l lg:border-t-0 lg:p-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700">
                      Also included
                    </p>
                    <div className="mt-5 space-y-4">
                      {[
                        ['Menu migration', 'We import your existing items, modifiers, and pricing — no manual re-entry.'],
                        ['Aggregator setup', 'Swiggy, Zomato, and Dineout are connected during onboarding, not after.'],
                        ['Role-based access', 'Floor staff, kitchen, and admin each see only what they need.'],
                        ['Recipe inventory', 'Ingredient-level deduction runs automatically against every order.'],
                      ].map(([title, desc]) => (
                        <div key={title} className="flex items-start gap-3">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{title}</p>
                            <p className="mt-0.5 text-sm leading-6 text-slate-600">{desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </MarketingContainer>
        </MarketingSection>

        {/* FAQ */}
        <MarketingSection tone="muted">
          <MarketingContainer>
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <MarketingBadge>FAQ</MarketingBadge>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Clear answers before you begin.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  Common questions from restaurant teams before they switch.
                </p>
              </div>
            </Reveal>
            <div className="mt-10">
              <FaqAccordion />
            </div>
          </MarketingContainer>
        </MarketingSection>

        {/* Final CTA */}
        <MarketingSection tone="brand">
          <MarketingContainer>
            <Reveal>
              <div className="flex flex-col gap-6 rounded-[2.25rem] border border-white/20 bg-[linear-gradient(180deg,rgba(15,23,42,0.95)_0%,rgba(15,118,110,0.95)_100%)] px-6 py-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] lg:flex-row lg:items-center lg:justify-between lg:px-10">
                <div className="max-w-2xl">
                  <MarketingBadge className="border-white/15 bg-white/10 text-emerald-100">
                    {finalCta.title}
                  </MarketingBadge>
                  <p className="mt-4 text-base leading-8 text-slate-200">{finalCta.description}</p>
                </div>
                <MarketingButton href="/contact">
                  Book Demo
                  <ArrowRight size={16} />
                </MarketingButton>
              </div>
            </Reveal>
          </MarketingContainer>
        </MarketingSection>

      </main>
    </MarketingShell>
  );
}
