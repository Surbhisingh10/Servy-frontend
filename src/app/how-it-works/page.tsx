import type { Metadata } from 'next';
import MarketingShell from '@/components/marketing/MarketingShell';
import Reveal from '@/components/marketing/Reveal';
import SectionHeader from '@/components/marketing/SectionHeader';
import { platformStats } from '@/lib/marketing-content';

export const metadata: Metadata = {
  title: 'How It Works | Restaurant SaaS',
  description: 'See how restaurants sign up, launch QR ordering, and manage operations from one dashboard.',
};

const steps = [
  {
    step: '01',
    title: 'Sign up and upload the menu',
    description:
      'Restaurants create an account, configure their outlet, upload categories and items, and generate QR codes for dine-in ordering.',
  },
  {
    step: '02',
    title: 'Customers scan and place orders',
    description:
      'Guests scan the QR, browse the digital menu, and place dine-in or takeaway orders without waiting for manual order taking.',
  },
  {
    step: '03',
    title: 'Manage operations and growth',
    description:
      'Restaurant teams handle all orders, view analytics, track repeat customers, and launch promotions from one unified dashboard.',
  },
];

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeader
          eyebrow="How It Works"
          title="A simple operating loop from setup to repeat revenue."
          description="The platform is built to be easy to launch and practical for daily restaurant operations."
          align="center"
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {steps.map((item, index) => (
            <Reveal
              key={item.step}
              delay={index * 0.08}
              className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_44px_rgba(15,23,42,0.05)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 text-lg font-semibold text-white">
                {item.step}
              </div>
              <h2 className="mt-8 text-2xl font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 rounded-[2.2rem] border border-primary-100 bg-primary-50 p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-700">
                Single System
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900">
                No fragmented tools. No duplicate workflows.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Ordering, CRM, campaigns, aggregator visibility, and reporting all stay connected,
                so restaurants can move faster with less manual follow-up.
              </p>
            </div>

            <div className="rounded-[1.8rem] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ['Setup', 'Menu + QR'],
                  ['Orders', 'Realtime Queue'],
                  ['Growth', 'CRM + Campaigns'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {platformStats.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 0.06}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)]"
            >
              <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
