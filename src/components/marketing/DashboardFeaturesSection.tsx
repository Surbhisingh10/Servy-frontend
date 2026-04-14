'use client';

import { useMemo, useState } from 'react';
import { ChevronRight, CircleDollarSign, ClipboardList, Package, TrendingUp, CheckCircle2 } from 'lucide-react';
import Reveal from './Reveal';
import { dashboardFeatures } from '@/lib/marketing-content';

const dashboardTabs = [
  {
    key: 'orders',
    label: 'Orders',
    title: 'Live order board',
    subtitle: 'Track dine-in, takeaway, and delivery orders in one queue.',
    metrics: [
      ['Open orders', '28'],
      ['Avg prep', '14 min'],
      ['Accepted', '96%'],
    ],
    rows: [
      'Table 14 - Dine-in - Pending',
      'Takeaway - Paid - Ready for pickup',
      'Swiggy - Confirmed - In kitchen',
    ],
    icon: ClipboardList,
  },
  {
    key: 'billing',
    label: 'Billing',
    title: 'Fast billing and checkout',
    subtitle: 'Bill faster with a clean POS flow and payment readiness.',
    metrics: [
      ['Invoices', '142'],
      ['UPI share', '68%'],
      ['Success rate', '96.4%'],
    ],
    rows: [
      'Quick item search and add-ons',
      'Split payment and discount support',
      'Payment status synced with orders',
    ],
    icon: CircleDollarSign,
  },
  {
    key: 'inventory',
    label: 'Inventory',
    title: 'Stock visibility',
    subtitle: 'See low stock and consumption trends before items run out.',
    metrics: [
      ['Low stock', '08'],
      ['Categories', '24'],
      ['Auto alerts', 'On'],
    ],
    rows: [
      'Ingredients nearing reorder threshold',
      'Menu availability updates',
      'Outlet-level stock checks',
    ],
    icon: Package,
  },
  {
    key: 'reports',
    label: 'Reports',
    title: 'Performance insights',
    subtitle: 'Understand revenue, repeat guests, and channel mix in seconds.',
    metrics: [
      ['Today revenue', 'Rs 48.2K'],
      ['Repeat guests', '42%'],
      ['Avg basket', 'Rs 612'],
    ],
    rows: [
      'Revenue by day and outlet',
      'Popular items and channels',
      'CRM and campaign performance',
    ],
    icon: TrendingUp,
  },
] as const;

type DashboardTabKey = (typeof dashboardTabs)[number]['key'];

export default function DashboardFeaturesSection() {
  const [activeTab, setActiveTab] = useState<DashboardTabKey>('orders');
  const active = useMemo(
    () => dashboardTabs.find((tab) => tab.key === activeTab) || dashboardTabs[0],
    [activeTab],
  );
  const ActiveIcon = active.icon;

  return (
    <Reveal>
      <div className="rounded-[2.4rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-start">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
              Dashboard Features
            </p>
            <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              A dashboard that covers the actual work restaurants do every day.
            </h2>
            <p className="max-w-2xl text-lg leading-9 text-slate-600">
              We have built the platform around the tools restaurant teams really need: billing,
              orders, inventory, payments, reports, CRM, campaigns, QR codes, outlet controls,
              and notifications.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'Faster billing and checkout',
                'One queue for all orders',
                'Inventory and stock visibility',
                'UPI and payment tracking',
                'Reports and revenue insights',
                'Customer CRM and marketing',
              ].map((item) => (
                <div
                  key={item}
                  className="flex h-full items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#0f172a_0%,#1e293b_100%)] p-4 text-white shadow-[0_24px_50px_rgba(15,23,42,0.18)]">
            <div className="flex flex-wrap gap-2">
              {dashboardTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold tracking-[0.18em] transition ${
                    activeTab === tab.key
                      ? 'bg-white text-slate-900'
                      : 'bg-white/10 text-slate-200 hover:bg-white/15'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-[1.6rem] bg-white p-5 text-slate-900 shadow-[0_20px_40px_rgba(15,23,42,0.14)]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                    <ActiveIcon size={22} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Dashboard</p>
                    <h3 className="mt-1 text-2xl font-semibold text-slate-900">{active.title}</h3>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Live
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{active.subtitle}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {active.metrics.map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3">
                {active.rows.map((row) => (
                  <div
                    key={row}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
                  >
                    <span className="text-sm font-medium text-slate-700">{row}</span>
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {dashboardFeatures.slice(0, 6).map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="flex h-full flex-col rounded-[1.4rem] bg-white/8 p-4 text-white/95 backdrop-blur"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl ${feature.accent}`}
                    >
                      <Icon size={20} />
                    </div>
                    <h4 className="mt-3 text-sm font-semibold">{feature.title}</h4>
                    <p className="mt-1 text-xs leading-6 text-slate-300">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
