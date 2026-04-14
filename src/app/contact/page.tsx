import type { Metadata } from 'next';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  PlayCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import MarketingBadge from '@/components/marketing/MarketingBadge';
import MarketingButton from '@/components/marketing/MarketingButton';
import MarketingContainer from '@/components/marketing/MarketingContainer';
import MarketingSection from '@/components/marketing/MarketingSection';
import MarketingShell from '@/components/marketing/MarketingShell';
import Reveal from '@/components/marketing/Reveal';
import ContactForm from '@/components/marketing/ContactForm';
import { finalCta } from '@/lib/marketing-site-content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://servy.app';

export const metadata: Metadata = {
  title: 'Contact Us | Servy',
  description:
    'Talk to the Servy team. Request a guided demo, ask about pricing, or get onboarding guidance for your restaurant.',
  openGraph: {
    title: 'Contact Us | Servy',
    description:
      'Talk to the Servy team. Request a guided demo, ask about pricing, or get onboarding guidance for your restaurant.',
    url: `${SITE_URL}/contact`,
    siteName: 'Servy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Servy',
    description:
      'Talk to the Servy team. Request a guided demo, ask about pricing, or get onboarding guidance for your restaurant.',
  },
};

const DEMO_TOPICS = [
  'POS and floor service flow',
  'QR scan-order-pay experience',
  'Inventory and recipe management',
  'Reports and revenue reconciliation',
  'Multi-outlet control and analytics',
  'Support, rollout, and onboarding expectations',
];

const NEXT_STEPS = [
  {
    step: '01',
    title: 'We review your setup',
    description:
      'We read your message and map the demo to your outlet type and service flow — no generic tour.',
  },
  {
    step: '02',
    title: 'We schedule a call',
    description:
      'A short calendar link arrives within one business day. Pick a time that works for your team.',
  },
  {
    step: '03',
    title: 'You see the platform',
    description:
      'A focused walkthrough built around your operation — billing, floor, inventory, and reporting.',
  },
];

export default function ContactPage() {
  return (
    <MarketingShell>
      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <MarketingSection tone="brand" className="pt-8 lg:pt-14">
          <MarketingContainer>
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <Reveal>
                <div>
                  <MarketingBadge>Contact &amp; Demo</MarketingBadge>
                  <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-[3.25rem] lg:leading-tight">
                    Let&apos;s build your<br className="hidden lg:block" /> operation together.
                  </h1>
                  <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                    Whether you want a live product walkthrough, pricing clarity, or guidance on
                    rolling out across locations — we get back to you within one business day.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {['Guided demo', 'Pricing questions', 'Multi-outlet setup', 'Onboarding support'].map(
                      (chip) => (
                        <div
                          key={chip}
                          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
                        >
                          <CheckCircle2 size={14} className="text-emerald-600" />
                          {chip}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="grid gap-4">
                  {/* Email card */}
                  <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
                        <Mail size={16} className="text-emerald-700" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Direct email
                      </p>
                    </div>
                    <p className="mt-3 text-xl font-semibold text-slate-900">
                      business@servyworld.com
                    </p>
                  </div>

                  {/* Response time card */}
                  <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.97)_0%,rgba(15,118,110,0.95)_100%)] p-6 text-white shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                        <Clock size={16} className="text-emerald-200" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                        Response time
                      </p>
                    </div>
                    <p className="mt-3 text-base leading-7 text-slate-200">
                      Product and sales requests are answered within{' '}
                      <span className="font-semibold text-white">one business day</span>.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </MarketingContainer>
        </MarketingSection>

        {/* ── What happens next ────────────────────────────── */}
        <MarketingSection tone="muted">
          <MarketingContainer>
            <Reveal>
              <div className="max-w-2xl">
                <MarketingBadge>What happens next</MarketingBadge>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  A clear path from first message to live operation.
                </h2>
              </div>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {NEXT_STEPS.map((item, i) => (
                <Reveal key={item.step} delay={i * 0.07}>
                  <div className="h-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
                    <p className="text-4xl font-semibold tracking-tight text-emerald-100">
                      {item.step}
                    </p>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </MarketingContainer>
        </MarketingSection>

        {/* ── Form + info ──────────────────────────────────── */}
        <MarketingSection>
          <MarketingContainer>
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              {/* Info column */}
              <Reveal>
                <div className="grid gap-5">
                  <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
                    <div className="flex items-center gap-2">
                      <PlayCircle size={18} className="text-emerald-700" />
                      <h3 className="text-lg font-semibold text-slate-900">What the demo covers</h3>
                    </div>
                    <ul className="mt-5 space-y-3">
                      {DEMO_TOPICS.map((topic) => (
                        <li key={topic} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.96)_0%,rgba(15,118,110,0.94)_100%)] p-6 text-white shadow-[0_16px_40px_rgba(15,23,42,0.14)]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-emerald-300" />
                      <h3 className="text-lg font-semibold text-white">Support promise</h3>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      Guided rollout. Concierge onboarding. No scripts — just the parts of the
                      platform that matter to your operation.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Form column */}
              <Reveal delay={0.08}>
                <div className="rounded-[2.25rem] border border-slate-200 bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.07)] lg:p-8">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-emerald-700" />
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                      Send us a message
                    </h2>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Fill in your details and we will shape the next step around your restaurant.
                  </p>
                  <div className="mt-6">
                    <ContactForm />
                  </div>
                </div>
              </Reveal>
            </div>
          </MarketingContainer>
        </MarketingSection>

        {/* ── CTA strip ────────────────────────────────────── */}
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
                <MarketingButton href="/features">
                  Explore Platform
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
