import type { Metadata } from 'next';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Heart,
  Package,
  QrCode,
  ShieldCheck,
  Users,
} from 'lucide-react';
import MarketingBadge from '@/components/marketing/MarketingBadge';
import MarketingButton from '@/components/marketing/MarketingButton';
import MarketingContainer from '@/components/marketing/MarketingContainer';
import MarketingSection from '@/components/marketing/MarketingSection';
import MarketingShell from '@/components/marketing/MarketingShell';
import Reveal from '@/components/marketing/Reveal';
import PlatformCapabilitiesSection from '@/components/marketing/PlatformCapabilitiesSection';
import SupportedFormatsSection from '@/components/marketing/SupportedFormatsSection';
import IntegrationsSection from '@/components/marketing/IntegrationsSection';
import { finalCta } from '@/lib/marketing-site-content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://servy.app';

export const metadata: Metadata = {
  title: 'Features | Servy',
  description: 'Billing, orders, inventory, guest experience, and multi-outlet control — all in one platform built for restaurant teams.',
  openGraph: {
    title: 'Features | Servy',
    description: 'Billing, orders, inventory, guest experience, and multi-outlet control — all in one platform built for restaurant teams.',
    url: `${SITE_URL}/features`,
    siteName: 'Servy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Features | Servy',
    description: 'Billing, orders, inventory, guest experience, and multi-outlet control — all in one platform built for restaurant teams.',
  },
};

const featuresSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Servy',
  applicationCategory: 'BusinessApplication',
  featureList: [
    'POS and table management',
    'QR code ordering and payments',
    'Recipe-based inventory management',
    'Multi-outlet reporting and reconciliation',
    'CRM, loyalty, and campaign management',
    'Aggregator order integration',
  ],
};

const featureSections = [
  {
    badge: 'Billing & Orders',
    icon: ClipboardList,
    title: 'One queue for every order that comes in.',
    description:
      'Dine-in, takeaway, Swiggy, Zomato, and Dineout — all land in one live order board. The kitchen sees a unified ticket feed, billing closes without manual entry, and the front counter stays offline-capable when the network dips.',
    bullets: [
      'POS with table and section mapping',
      'Aggregator orders auto-imported, no extra tablets',
      'Offline billing — syncs when connectivity restores',
      'Split bills, modifiers, and item-level discounts',
      'Kitchen display with prep-stage tracking',
    ],
    stats: [
      { label: 'Order sources unified', value: '4+' },
      { label: 'Billing uptime', value: '100%' },
    ],
    accent: 'emerald',
    flip: false,
  },
  {
    badge: 'Inventory & Kitchen',
    icon: Package,
    title: 'Ingredient-level control without the spreadsheets.',
    description:
      'Every item sold deducts ingredients from stock in real time. Recipes define exact portions, so wastage is tracked, low-stock alerts fire before service, and the central kitchen can supply outlets without manual coordination.',
    bullets: [
      'Recipe-linked inventory deduction per order',
      'Low-stock alerts before service starts',
      'Central kitchen supply flow for multi-outlet groups',
      'Modifier-level ingredient tracking',
      'Daily consumption report vs. theoretical usage',
    ],
    stats: [
      { label: 'Stock accuracy', value: 'Real-time' },
      { label: 'Recipe depth', value: 'Ingredient level' },
    ],
    accent: 'slate',
    flip: true,
  },
  {
    badge: 'Guest Experience',
    icon: QrCode,
    title: 'QR ordering, loyalty, and reviews — all connected.',
    description:
      'Guests scan, order, and pay without flagging down staff. Every transaction builds a CRM record — visit history, preferences, and review signals. Loyalty points, birthday campaigns, and win-back offers run automatically from those profiles.',
    bullets: [
      'QR scan-order-pay at the table',
      'Digital bills sent to WhatsApp or email',
      'CRM profiles built from every order',
      'Loyalty points and tiered reward programs',
      'Review collection and response workflow',
    ],
    stats: [
      { label: 'Avg repeat rate uplift', value: '+18%' },
      { label: 'Guest profile data', value: 'Auto-built' },
    ],
    accent: 'emerald',
    flip: false,
  },
  {
    badge: 'Reporting & Control',
    icon: BarChart3,
    title: 'The numbers owners actually need, without the noise.',
    description:
      'Revenue by outlet, item performance, shift summaries, and aggregator reconciliation — all in one view. Role-based access means floor staff see orders, managers see their outlet, and owners see everything.',
    bullets: [
      'Real-time revenue and order dashboards',
      'Aggregator commission and payout reconciliation',
      'Staff performance and shift summaries',
      'Multi-outlet roll-up with branch-level drill-down',
      'Role permissions — floor, kitchen, manager, owner',
    ],
    stats: [
      { label: 'Report types', value: '12+' },
      { label: 'Outlet visibility', value: 'Unified' },
    ],
    accent: 'slate',
    flip: true,
  },
];

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(featuresSchema) }}
      />
      <main>

        {/* Hero */}
        <MarketingSection tone="brand" className="pt-8 lg:pt-16">
          <MarketingContainer>
            <Reveal>
              <div className="mx-auto max-w-3xl text-center">
                <MarketingBadge>Platform features</MarketingBadge>
                <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                  Every tool your team
                  <br className="hidden sm:block" />
                  <span className="text-emerald-700"> actually uses daily.</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Billing, orders, inventory, guest experience, and outlet control — built into one calm
                  interface so teams stop switching between disconnected tools.
                </p>

              </div>
            </Reveal>

            {/* Feature pillars strip */}
            <Reveal delay={0.1}>
              <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: ClipboardList, label: 'Billing & Orders' },
                  { icon: Package, label: 'Inventory' },
                  { icon: QrCode, label: 'Guest Experience' },
                  { icon: BarChart3, label: 'Reporting' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <Icon size={16} />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </MarketingContainer>
        </MarketingSection>

        {/* Feature deep-dives */}
        {featureSections.map((section, index) => {
          const Icon = section.icon;
          const isFlipped = section.flip;

          const textBlock = (
            <Reveal delay={0.04}>
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon size={18} />
                  </div>
                  <MarketingBadge>{section.badge}</MarketingBadge>
                </div>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  {section.title}
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">{section.description}</p>
                <ul className="mt-6 space-y-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );

          const visualBlock = (
            <Reveal delay={0.1}>
              <div className="rounded-[2.25rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div className="grid grid-cols-2 gap-3">
                  {section.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[1.5rem] border border-slate-200 bg-white p-5"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                        {stat.label}
                      </p>
                      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-[1.75rem] border border-emerald-100 bg-emerald-50/60 p-5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-700" />
                    <p className="text-sm font-semibold text-slate-900">Built for real service</p>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Every feature in this module is designed around what actually happens during a busy
                    lunch or dinner service — not a demo environment.
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {section.bullets.slice(0, 3).map((bullet) => (
                    <span
                      key={bullet}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {bullet}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          );

          return (
            <MarketingSection key={section.badge} tone={index % 2 === 0 ? undefined : 'muted'}>
              <MarketingContainer>
                <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                  {isFlipped ? (
                    <>
                      {visualBlock}
                      {textBlock}
                    </>
                  ) : (
                    <>
                      {textBlock}
                      {visualBlock}
                    </>
                  )}
                </div>
              </MarketingContainer>
            </MarketingSection>
          );
        })}


        {/* Interactive capabilities */}
        <PlatformCapabilitiesSection />

        {/* Supported formats */}
        <SupportedFormatsSection />

        {/* Integrations */}
        <IntegrationsSection />

        {/* Final CTA */}
        <MarketingSection tone="brand">
          <MarketingContainer>
            <Reveal>
              <div className="flex flex-col gap-6 rounded-[2.25rem] border border-white/20 bg-[linear-gradient(180deg,rgba(15,23,42,0.95)_0%,rgba(15,118,110,0.95)_100%)] px-6 py-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] lg:flex-row lg:items-center lg:justify-between lg:px-10">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-emerald-400" />
                    <Heart size={14} className="text-emerald-400" />
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                    {finalCta.title}
                  </h2>
                  <p className="mt-3 text-base leading-8 text-slate-200">{finalCta.description}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end xl:flex-row">
                  <MarketingButton href="/contact">
                    Book Demo
                    <ArrowRight size={16} />
                  </MarketingButton>
                  <MarketingButton href="/pricing" variant="secondary">
                    View Pricing
                    <ChevronRight size={16} />
                  </MarketingButton>
                </div>
              </div>
            </Reveal>
          </MarketingContainer>
        </MarketingSection>

      </main>
    </MarketingShell>
  );
}
