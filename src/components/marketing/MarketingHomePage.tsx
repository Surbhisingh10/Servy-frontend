'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import MarketingBadge from './MarketingBadge';
import MarketingButton from './MarketingButton';
import MarketingContainer from './MarketingContainer';
import MarketingSection from './MarketingSection';
import MarketingShell from './MarketingShell';
import Reveal from './Reveal';
import ResourceCards from './ResourceCards';
import {
  paymentIntegrationLogos,
  otherIntegrationLogos,
} from '@/lib/marketing-site-content';

type FormatKey = 'fine_dine' | 'qsr_bakery' | 'multi_outlet' | 'brewery';

const formatMarquee = [
  'Fine Dine',
  'QSR',
  'Cloud Kitchen',
  'Brewery',
  'Bakery',
  'Multi-Outlet',
  'Cafe',
  'Food Court',
];

const onboardingSteps = [
  { step: '01', title: 'Consult', description: 'Map your menu, channels, and outlet structure.' },
  { step: '02', title: 'Migrate', description: 'Import menus, branches, users, and recipes.' },
  { step: '03', title: 'Train', description: 'Concierge onboarding for floor, kitchen, and admin teams.' },
  { step: '04', title: 'Go-Live', description: 'Launch with offline billing and live support coverage.' },
];

const formatTabs: Record<
  FormatKey,
  {
    label: string;
    title: string;
    description: string;
    benefits: string[];
    note: string;
  }
> = {
  fine_dine: {
    label: 'Fine Dining',
    title: 'Reservations, guest history, and table service with precision.',
    description:
      'Fine dining teams need calm handoffs, guest context, and a floor that feels orchestrated rather than rushed.',
    benefits: ['Reservations', 'Guest history', 'Table service', 'High-touch flow'],
    note: 'Designed for hospitality teams that measure precision in service moments.',
  },
  qsr_bakery: {
    label: 'QSR & Bakery',
    title: 'Speed, timed menus, and repeat ordering for high-volume counters.',
    description:
      'For quick service and fresh-batch businesses, the system stays narrow, fast, and easy to learn.',
    benefits: ['Timed menus', 'Rush-hour queues', 'Simple modifiers', 'Fast checkout'],
    note: 'Optimized for throughput, repeatability, and minimal staff friction.',
  },
  multi_outlet: {
    label: 'Multi-Outlet Chains',
    title: 'Global analytics with local outlet mastery.',
    description:
      'Chain operators can compare performance, control access, and keep supply and reporting aligned across locations.',
    benefits: ['Global analytics', 'Supply visibility', 'Outlet controls', 'Role governance'],
    note: 'Built to help one vision scale into a consistent brand network.',
  },
  brewery: {
    label: 'Brewery',
    title: 'Craft beer and taproom operations built for tab and tasting flow.',
    description:
      'Manage guest tabs, tasting flights, and event-driven service in one system — from the bar to the back office.',
    benefits: ['Tab management', 'Tasting flights', 'Table service', 'Event campaigns'],
    note: 'Designed for craft taprooms that run high-engagement, experience-first service.',
  },
};

const commandCards = [
  {
    eyebrow: 'The Floor',
    title: 'POS speed, table heatmaps, and a unified live queue.',
    description:
      'One queue for dine-in and aggregators keeps the floor calm while service stays fast.',
    icon: ClipboardList,
    stats: [
      { label: 'Bill time', value: '32 sec' },
      { label: 'Open tables', value: '24' },
      { label: 'Channel mix', value: '4 feeds' },
    ],
    chips: ['Dine-in', 'Swiggy', 'Zomato', 'Table heatmap'],
  },
  {
    eyebrow: 'The Engine',
    title: 'Recipe-based inventory with ingredient-level precision.',
    description:
      'Track raw material usage from recipes so prep, store, and central kitchen stay aligned.',
    icon: Package,
    stats: [
      { label: 'Recipes', value: '85' },
      { label: 'Low stock', value: '08' },
      { label: 'Waste down', value: '14%' },
    ],
    chips: ['Recipes', 'Consumption', 'Central kitchen', 'Menu sync'],
  },
  {
    eyebrow: 'The Intelligence',
    title: 'Automated reconciliation, multi-outlet reporting, and role control.',
    description:
      'See revenue leaks, commissions, taxes, cancellations, payout differences, and outlet performance together.',
    icon: BarChart3,
    stats: [
      { label: 'Outlets', value: '12' },
      { label: 'Leakage', value: '-26%' },
      { label: 'Roles', value: '8' },
    ],
    chips: ['Reconciliation', 'Multi-outlet', 'Roles', 'Reports'],
  },
] as const;

const deliveryLogos = otherIntegrationLogos.filter((logo) => logo.category === 'Orders');
const accountingLogos = otherIntegrationLogos.filter((logo) => logo.category === 'Accounting');
const marketingLogos = otherIntegrationLogos.filter((logo) =>
  ['WhatsApp Business', 'Twilio', 'Google Analytics'].includes(logo.name),
);

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <MarketingBadge>{eyebrow}</MarketingBadge>
      <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">{description}</p>
    </div>
  );
}

function UnifiedLoopVisual() {
  return (
    <div className="relative overflow-hidden rounded-[2.25rem] border border-white/12 bg-[linear-gradient(180deg,rgba(15,23,42,0.94)_0%,rgba(15,118,110,0.92)_100%)] p-5 text-white shadow-[0_28px_80px_rgba(15,23,42,0.28)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_30%)]" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-slate-300">Unified Loop</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">Guest to kitchen to revenue</h3>
          </div>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100">
            Realtime
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            {
              label: 'Guest',
              title: 'Table order',
              body: 'QR ordering, loyalty, and preferences.',
              chip: 'Connected',
            },
            {
              label: 'Kitchen',
              title: 'KDS update',
              body: 'Prep queue, recipe check, and routing.',
              chip: 'Live',
            },
            {
              label: 'Admin',
              title: 'Revenue sync',
              body: 'Sales, outlet data, and reconciliation.',
              chip: 'Protected',
            },
          ].map((node) => (
            <div
              key={node.label}
              className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">
                  {node.label}
                </p>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-sky-100">
                  {node.chip}
                </span>
              </div>
              <h4 className="mt-4 text-lg font-semibold text-white">{node.title}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-300">{node.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.9rem] border border-white/12 bg-[rgba(255,255,255,0.06)] p-4">
          <div className="rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,20,35,0.92)_0%,rgba(14,116,110,0.84)_100%)] p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100">
                Unified Flow
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                Guest &gt; Kitchen &gt; Admin
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                ['Guest', 'Order placed', 'QR ordering, loyalty, and preferences'],
                ['Kitchen', 'Prep updated', 'Queue, routing, and recipe checks'],
                ['Admin', 'Revenue synced', 'Sales, outlets, and reconciliation'],
              ].map(([lane, title, text], index) => (
                <div
                  key={lane}
                  className="rounded-[1.35rem] border border-white/10 bg-slate-950/35 px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100">{lane}</p>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-semibold text-emerald-100">
                      {index + 1}
                    </span>
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-white">{title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-white/8 px-4 py-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-200">Order placed</span>
                <ArrowRight size={16} className="shrink-0 text-emerald-200" />
                <span className="font-medium text-slate-200">Kitchen display updated</span>
                <ArrowRight size={16} className="shrink-0 text-emerald-200" />
                <span className="font-medium text-slate-200">Dashboard synced</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {['Order placed', 'Kitchen display updated', 'Dashboard synced'].map((item) => (
            <span key={item} className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-slate-300">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormatMarquee() {
  const reduceMotion = useReducedMotion();
  const track = [...formatMarquee, ...formatMarquee];

  return (
    <div className="overflow-hidden rounded-full border border-slate-200 bg-white/80 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur">
      <motion.div
        className="flex min-w-max items-center gap-3 px-4 py-3"
        animate={reduceMotion ? { x: 0 } : { x: ['0%', '-50%'] }}
        transition={reduceMotion ? undefined : { duration: 24, repeat: Infinity, ease: 'linear' }}
      >
        {track.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-4 py-2 text-sm font-medium text-slate-700"
          >
            <Sparkles size={14} className="text-emerald-600" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function CommandCenterPanel() {
  const [activeCommand, setActiveCommand] = useState<(typeof commandCards)[number]['eyebrow']>(
    commandCards[0].eyebrow,
  );
  const active = commandCards.find((card) => card.eyebrow === activeCommand) ?? commandCards[0];

  return (
    <div className="rounded-[2.25rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] lg:p-6">
      <div className="flex flex-wrap gap-2">
        {commandCards.map((card) => {
          const isActive = card.eyebrow === activeCommand;

          return (
            <button
              key={card.eyebrow}
              type="button"
              onClick={() => setActiveCommand(card.eyebrow)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'bg-slate-900 text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)]'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-slate-900'
              }`}
            >
              {card.eyebrow}
            </button>
          );
        })}
      </div>

      <motion.div
        key={active.eyebrow}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(59,130,246,0.12))] text-emerald-700">
              <active.icon size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700">
                {active.eyebrow}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {active.title}
              </h3>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{active.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {active.stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(15,23,42,0.94)_0%,rgba(15,118,110,0.94)_100%)] p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.16)]">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-100">
            Operational focus
          </p>
          <div className="mt-4 grid gap-3">
            {active.chips.map((chip) => (
              <div
                key={chip}
                className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-slate-100"
              >
                {chip}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.08)] p-4">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-300">What the team sees</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {['Guest', 'Kitchen', 'Admin'].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3 text-center text-xs font-medium text-slate-100"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const GUEST_STEPS = [
  {
    step: '01',
    text: 'Scan the table QR.',
    image: '/images/QR code.jpeg',
    alt: 'QR code table ordering',
    caption: 'Table QR ordering',
    sub: 'Guests scan the table code and land directly on the menu.',
  },
  {
    step: '02',
    text: 'Confirm items and modifiers.',
    image: '/images/order confirm.png',
    alt: 'Confirm order',
    caption: 'Order confirmation',
    sub: 'Review selections, add modifiers, and place in one tap.',
  },
  {
    step: '03',
    text: 'Pay and receive the e-bill.',
    image: '/images/payment.png',
    alt: 'Payment',
    caption: 'Instant payment',
    sub: 'Pay at the table and get an e-bill on WhatsApp or email.',
  },
] as const;

function GuestExperiencePanel() {
  const [activeStep, setActiveStep] = useState(0);
  const active = GUEST_STEPS[activeStep];

  return (
    <div className="grid gap-6">
      <SectionHeader
        eyebrow="Guest Experience"
        title="Scan, order, pay, and return with memory."
        description="Guests move through QR ordering and payment while the CRM keeps preferences, loyalty, and review signals connected."
      />

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        {/* Left — image changes with active step */}
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_16px_42px_rgba(15,23,42,0.06)]" style={{ minHeight: '22rem' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <Image
                src={active.image}
                alt={active.alt}
                fill
                className="object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>
          {/* Caption overlay */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.97)_28%)] px-5 pb-4 pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Step {active.step} · {active.caption}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{active.sub}</p>
          </div>
        </div>

        {/* Right — clickable steps */}
        <div className="flex flex-col rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f6faf7_100%)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  QR Guest Flow
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                  One clean path from table to bill.
                </h3>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Live
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              {GUEST_STEPS.map((item, index) => {
                const isActive = activeStep === index;
                return (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={`flex w-full items-center gap-4 rounded-[1.35rem] border px-4 py-4 text-left transition-all duration-200 ${
                      isActive
                        ? 'border-emerald-300 bg-emerald-50 shadow-[0_4px_14px_rgba(16,185,129,0.12)]'
                        : 'border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200 ${
                        isActive ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'
                      }`}
                    >
                      {item.step}
                    </div>
                    <p className={`text-sm leading-6 transition-colors duration-200 ${isActive ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                      {item.text}
                    </p>
                    {isActive && (
                      <span className="ml-auto shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        Showing
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 p-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-emerald-700" />
              <p className="text-sm font-semibold text-slate-900">CRM memory</p>
            </div>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Preferences, loyalty points, and review context return on the next visit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const FORMAT_IMAGES: Record<FormatKey, { src: string; alt: string; caption: string; sub: string }> = {
  fine_dine: {
    src: '/images/fine-dining-restaurants.png',
    alt: 'Fine dining restaurant',
    caption: 'Reservations · Guest history · Table handoffs',
    sub: 'Calm, high-touch service with full guest context at every table.',
  },
  qsr_bakery: {
    src: '/images/bakery.jpeg',
    alt: 'Bakery and QSR',
    caption: 'Timed menus · Rush-hour queues · Fast checkout',
    sub: 'Faster counter flow built for throughput and repeat ordering.',
  },
  multi_outlet: {
    src: '/images/multioutlet.jpeg',
    alt: 'Multi-outlet restaurant chain',
    caption: 'Global analytics · Supply visibility · Role governance',
    sub: 'Centralized oversight with branch-level control for growing chains.',
  },
  brewery: {
    src: '/images/Brewry.jpg',
    alt: 'Brewery and taproom',
    caption: 'Tab management · Tasting flights · Event campaigns',
    sub: 'Craft beer service designed for tab flow and guest experience.',
  },
};

function PlatformTabs() {
  const [activeTab, setActiveTab] = useState<FormatKey>('fine_dine');
  const active = formatTabs[activeTab];
  const image = FORMAT_IMAGES[activeTab];

  return (
    <div>
      {/* Centered segmented tab control */}
      <div className="flex justify-center">
        <div className="inline-flex gap-1 rounded-full border border-slate-200 bg-white p-1.5 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
          {(Object.keys(formatTabs) as FormatKey[]).map((key) => {
            const isActive = key === activeTab;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-[0_4px_14px_rgba(15,23,42,0.22)]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {formatTabs[key].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Animated content panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.26, ease: 'easeOut' }}
          className="mt-6 grid gap-5 lg:grid-cols-2 lg:items-stretch"
        >
          {/* Left — text */}
          <div className="flex flex-col rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_12px_36px_rgba(15,23,42,0.05)]">
            <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {active.label}
            </span>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 lg:text-3xl">
              {active.title}
            </h3>
            <p className="mt-3 flex-1 text-base leading-8 text-slate-600">{active.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {active.benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  {benefit}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-500">{active.note}</p>
          </div>

          {/* Right — image */}
          <div className="relative min-h-[22rem] overflow-hidden rounded-[2rem] border border-slate-200 shadow-[0_12px_36px_rgba(15,23,42,0.10)] lg:min-h-0">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0.55)_100%)]" />
            <div className="absolute left-4 top-4">
              <span className="rounded-full border border-white/25 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                {active.label}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/55 px-4 py-3 backdrop-blur-md">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-300">
                  {image.caption}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">{image.sub}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function EcosystemMatrix() {
  const sections = [
    {
      title: 'Delivery',
      description: 'Swiggy, Zomato, and reservation channels in one clear view.',
      logos: deliveryLogos,
    },
    {
      title: 'Payments',
      description: 'UPI and gateway options for fast guest checkout.',
      logos: paymentIntegrationLogos,
    },
    {
      title: 'Accounting',
      description: 'Smooth handoff into the back office and finance workflows.',
      logos: accountingLogos,
    },
    {
      title: 'Marketing',
      description: 'Guest communication, analytics, and campaign support.',
      logos: marketingLogos,
    },
  ] as const;

  return (
    <div className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] lg:p-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className="flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5"
          >
            <p className="text-sm font-semibold text-slate-900">{section.title}</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{section.description}</p>
            <div className="mt-5 grid grid-cols-1 gap-2">
              {section.logos.slice(0, 3).map((logo) => (
                <div
                  key={logo.name}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3"
                >
                  <div className="relative h-8 w-12 shrink-0">
                    <Image src={logo.src} alt={logo.alt} fill className="object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{logo.name}</p>
                    <p className="text-[11px] leading-4 text-slate-500">{logo.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MarketingHomePage() {
  return (
    <MarketingShell>
      <main>
        <MarketingSection className="pt-8 lg:pt-12" tone="brand">
          <MarketingContainer>
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <Reveal>
                <div>
                  <MarketingBadge>The Vision</MarketingBadge>
                  <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                    The Pulse of Your Hospitality.
                  </h1>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                    A unified operating system designed for the modern kitchen, the ambitious floor, and
                    the connected guest.
                  </p>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                    Replace fragmented tools with a calmer operating layer for billing, QR ordering,
                    kitchen precision, multi-outlet control, and executive visibility.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <MarketingButton href="/contact">
                      Book a Demo
                      <ArrowRight size={16} />
                    </MarketingButton>
                    <MarketingButton href="/features" variant="secondary">
                      Explore the Platform
                      <ChevronRight size={16} />
                    </MarketingButton>
                  </div>
                  <div className="mt-10 grid gap-3 sm:grid-cols-3">
                    {[
                      ['Precision', 'Ingredient-level control'],
                      ['Mastery', 'Multi-outlet oversight'],
                      ['Clarity', 'Real-time revenue sync'],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-[1.5rem] border border-slate-200 bg-[rgba(255,255,255,0.72)] p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-700">
                          {label}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      <Star size={14} className="text-amber-500" />
                      Loved by restaurant teams
                    </span>
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                    <LayoutDashboard size={14} />
                    Live operating system for the full hospitality loop
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <UnifiedLoopVisual />
              </Reveal>
            </div>
          </MarketingContainer>
        </MarketingSection>

        <MarketingSection>
          <MarketingContainer>
            <div className="space-y-5">
              <Reveal>
                <SectionHeader
                  eyebrow="Built for Every Business"
                  title="Built for every format the hospitality team has to serve."
                  description="The platform flexes across fine dining, quick service, delivery-first kitchens, and multi-outlet brands without changing the core operating model."
                />
              </Reveal>
              <Reveal delay={0.05}>
                <FormatMarquee />
              </Reveal>
            </div>
          </MarketingContainer>
        </MarketingSection>

        <MarketingSection tone="muted">
          <MarketingContainer>
            <Reveal>
              <SectionHeader
                eyebrow="Explore Business"
                title="The same platform, tuned for different hospitality motions."
                description="Whether you run a single fine-dining room or a chain of QSR counters, the core platform stays the same — only the configuration changes."
              />
            </Reveal>
            <div className="mt-10">
              <Reveal delay={0.05}>
                <PlatformTabs />
              </Reveal>
            </div>
          </MarketingContainer>
        </MarketingSection>

        <MarketingSection tone="muted">
          <MarketingContainer>
            <Reveal>
              <SectionHeader
                eyebrow="Core Operations"
                title="Merge day-to-day operations with executive oversight."
                description="One primary panel keeps the floor, engine, and intelligence layer in one calm view."
              />
            </Reveal>
            <div className="mt-10">
              <Reveal delay={0.05}>
                <CommandCenterPanel />
              </Reveal>
            </div>
          </MarketingContainer>
        </MarketingSection>

        <MarketingSection>
          <MarketingContainer>
            <Reveal>
              <GuestExperiencePanel />
            </Reveal>
          </MarketingContainer>
        </MarketingSection>

        <MarketingSection>
          <MarketingContainer>
            <Reveal>
              <SectionHeader
                eyebrow="Ecosystem"
                title="A clean matrix of the systems that stay around the core flow."
                description="Keep delivery, payments, accounting, and marketing in one unified panel."
              />
            </Reveal>
            <div className="mt-10">
              <Reveal delay={0.05}>
                <EcosystemMatrix />
              </Reveal>
            </div>
          </MarketingContainer>
        </MarketingSection>


        <MarketingSection tone="muted">
          <MarketingContainer>
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <MarketingBadge>Resources</MarketingBadge>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Guides written for restaurant teams.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  Practical playbooks on QR ordering, customer retention, and aggregator management.
                </p>
              </div>
            </Reveal>
            <div className="mt-10">
              <ResourceCards />
            </div>
          </MarketingContainer>
        </MarketingSection>

        <MarketingSection tone="muted">
          <MarketingContainer>
            <Reveal>
              <div className="rounded-[2.25rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] lg:p-8">
                <SectionHeader
                  eyebrow="Platform Promise"
                  title="Concierge onboarding, strong support, and offline reliability."
                  description="The launch experience should feel calm for teams, even when service is busy."
                />
                <div className="mt-8 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {onboardingSteps.map((item) => (
                      <div
                        key={item.step}
                        className="flex h-full items-start gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                          {item.step}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50/70 p-5">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={20} className="text-emerald-700" />
                      <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                        Support and reliability
                      </h3>
                    </div>
                    <div className="mt-5 grid gap-3">
                      {[
                        ['24/7 SLA', 'Support coverage when service does not stop.'],
                        ['Offline mode', 'Billing continues even when the network drops.'],
                        ['Fast rollout', 'Launch a new outlet in a short, guided flow.'],
                        ['Outlet coverage', 'Designed for single stores and multi-location brands.'],
                      ].map(([title, description]) => (
                        <div key={title} className="rounded-[1.35rem] border border-white/70 bg-white p-4">
                          <p className="text-sm font-semibold text-slate-900">{title}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </MarketingContainer>
        </MarketingSection>

      </main>
    </MarketingShell>
  );
}


