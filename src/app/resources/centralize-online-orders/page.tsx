import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, X } from 'lucide-react';
import MarketingBadge from '@/components/marketing/MarketingBadge';
import MarketingButton from '@/components/marketing/MarketingButton';
import MarketingContainer from '@/components/marketing/MarketingContainer';
import MarketingShell from '@/components/marketing/MarketingShell';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://servy.app';

export const metadata: Metadata = {
  title: 'Checklist: Centralize Online Orders from Swiggy, Zomato & Dineout | Servy',
  description:
    'How to bring Swiggy, Zomato, and Dineout into a single operational queue without extra hardware, missed orders, or manual re-entry.',
  openGraph: {
    title: 'Checklist: Centralize Online Orders | Servy',
    description:
      'Bring Swiggy, Zomato, and Dineout into a single operational queue without extra hardware clutter.',
    url: `${SITE_URL}/resources/centralize-online-orders`,
    siteName: 'Servy',
    type: 'article',
  },
};

const PROBLEMS = [
  {
    problem: 'Three tablets on the counter',
    detail: 'One for Swiggy, one for Zomato, one for Dineout. Each beeps separately, has different UX, and shows a different order view. Staff jump between screens during rush hour and miss orders.',
  },
  {
    problem: 'Manual re-entry into the POS',
    detail: 'Delivery orders come in on aggregator tablets but do not appear in the main billing system. Staff re-key items into the POS, creating delays and entry errors that affect stock and reporting.',
  },
  {
    problem: 'No unified order view',
    detail: 'The kitchen sees dine-in KOTs but not aggregator orders. Dine-in and delivery get treated as separate queues. This breaks kitchen sequencing and increases prep time variability.',
  },
  {
    problem: 'Revenue leakage in reconciliation',
    detail: "Aggregator payouts arrive weekly with deductions that don't match your records. Without a unified order log, there is no way to verify payout accuracy or flag discrepancies.",
  },
];

const CHECKLIST_SECTIONS = [
  {
    title: 'Before integration',
    items: [
      'Confirm your Swiggy, Zomato, and Dineout accounts are active and menus are current',
      'Note your aggregator restaurant IDs (found in each platform\'s partner portal)',
      'Identify which menu items differ between aggregator and dine-in menus (pricing, availability)',
      'Decide who will own the unified order board during service — typically the floor manager',
      'Agree on an order acceptance SLA: How long before an order auto-accepts? (Recommended: 2 minutes)',
    ],
  },
  {
    title: 'During setup',
    items: [
      'Connect each aggregator account in Servy Settings → Integrations → Orders',
      'Map aggregator menu items to Servy menu items (this links stock deduction to delivery orders)',
      'Set up KDS routing: decide which aggregator orders go to which kitchen station',
      'Configure auto-accept rules or manual accept mode per platform',
      'Test with a live order on each platform before removing the old tablets',
    ],
  },
  {
    title: 'Go-live and first week',
    items: [
      'Brief the kitchen team: aggregator orders now appear on the same KDS as dine-in',
      'Keep aggregator tablets plugged in but off the counter for the first 3 days as backup',
      'Monitor rejection rate per platform — a spike indicates a routing or acceptance issue',
      'Check payout reconciliation report at end of week 1 against aggregator dashboard',
      'Remove physical tablets from counter once the team is comfortable — typically Day 4 or 5',
    ],
  },
  {
    title: 'Ongoing operations',
    items: [
      'Review aggregator reconciliation weekly — Servy vs platform payout should match within 1–2%',
      'Update menu sync whenever you add or remove items (changes in Servy propagate to aggregators)',
      'Use channel-mix reports monthly to see which platform drives the most revenue and order volume',
      'Flag payout discrepancies within 7 days — aggregators have limited dispute windows',
    ],
  },
];

const WHAT_UNIFIED_GIVES = [
  { icon: 'check', label: 'One order queue for dine-in, takeaway, Swiggy, Zomato, and Dineout' },
  { icon: 'check', label: 'Kitchen sees all orders in one place — no missed aggregator KOTs' },
  { icon: 'check', label: 'Stock deducted automatically for every delivery order' },
  { icon: 'check', label: 'Payout reconciliation report per aggregator, per week' },
  { icon: 'check', label: 'No more manual re-entry between tablet and POS' },
  { icon: 'check', label: 'Remove 2–3 physical tablets from your counter' },
];

export default function CentralizeOnlineOrdersPage() {
  return (
    <MarketingShell>
      <main className="py-16 lg:py-20">
        <MarketingContainer>
          <div className="mx-auto max-w-3xl">

            {/* Header */}
            <div className="mb-12 border-b border-slate-200 pb-10">
              <MarketingBadge>Checklist</MarketingBadge>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Centralize online orders from Swiggy, Zomato &amp; Dineout.
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                How to bring all your delivery platform orders into one operational queue — without extra hardware, missed orders, or manual re-entry into the POS.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {['4 platforms covered', 'Setup checklist', 'KDS routing', 'Reconciliation guide'].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* The problem */}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">The problem with multiple tablets</h2>
              <p className="mt-3 text-base leading-8 text-slate-600">
                Most restaurants running on two or more delivery platforms end up with the same four operational problems. Recognise them before solving them.
              </p>
              <div className="mt-6 space-y-4">
                {PROBLEMS.map((item) => (
                  <div key={item.problem} className="rounded-[1.5rem] border border-rose-100 bg-rose-50/50 p-5">
                    <div className="flex items-start gap-3">
                      <X size={16} className="mt-0.5 shrink-0 text-rose-500" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.problem}</p>
                        <p className="mt-1.5 text-sm leading-7 text-slate-600">{item.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What unified ops gives you */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-slate-900">What a unified setup gives you</h2>
              <div className="mt-5 space-y-3">
                {WHAT_UNIFIED_GIVES.map((item) => (
                  <div key={item.label} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist sections */}
            <div className="mt-12 space-y-10">
              <h2 className="text-2xl font-semibold text-slate-900">Integration checklist</h2>
              {CHECKLIST_SECTIONS.map((section, si) => (
                <div key={section.title}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                      {si + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{section.title}</h3>
                  </div>
                  <div className="mt-4 space-y-2.5 border-l-2 border-slate-100 pl-5 ml-3.5">
                    {section.items.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-[1.25rem] border border-slate-200 bg-white p-4 text-sm shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
                        <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-slate-300 bg-white" />
                        <span className="text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Reconciliation note */}
            <div className="mt-12 rounded-[2rem] border border-amber-100 bg-amber-50/60 p-7">
              <h2 className="text-xl font-semibold text-slate-900">A note on reconciliation</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Aggregator payouts include platform fees, packaging charges, cancellation deductions, and tax adjustments. Without a unified order log, these deductions are impossible to verify. Servy's reconciliation report cross-references every order against the payout line item, so you can see exactly what was deducted and why — and flag errors within the dispute window.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Most restaurants discover a 1.5–3% revenue leakage in their first reconciliation review. On ₹10L monthly aggregator revenue, that is ₹15,000–₹30,000 recovered per month.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-12 rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.97)_0%,rgba(15,118,110,0.95)_100%)] p-8 text-white">
              <h2 className="text-2xl font-semibold">See the unified order board live</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Book a demo and we will show you how Servy pulls Swiggy, Zomato, and Dineout into one queue alongside your dine-in orders — and how reconciliation works end-to-end.
              </p>
              <div className="mt-6">
                <MarketingButton href="/contact">
                  Book a Demo
                  <ArrowRight size={16} />
                </MarketingButton>
              </div>
            </div>

            {/* Back */}
            <div className="mt-10 border-t border-slate-100 pt-8">
              <Link href="/" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
                ← Back to home
              </Link>
            </div>
          </div>
        </MarketingContainer>
      </main>
    </MarketingShell>
  );
}
