import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import MarketingBadge from '@/components/marketing/MarketingBadge';
import MarketingButton from '@/components/marketing/MarketingButton';
import MarketingContainer from '@/components/marketing/MarketingContainer';
import MarketingShell from '@/components/marketing/MarketingShell';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://servy.app';

export const metadata: Metadata = {
  title: 'QR Ordering Playbook: Launch in One Day | Servy',
  description:
    'A step-by-step playbook for restaurant teams to launch QR-based ordering — from menu upload to go-live — in a single day.',
  openGraph: {
    title: 'QR Ordering Playbook: Launch in One Day | Servy',
    description:
      'A step-by-step playbook for restaurant teams to launch QR-based ordering in a single day.',
    url: `${SITE_URL}/resources/qr-ordering-playbook`,
    siteName: 'Servy',
    type: 'article',
  },
};

const STEPS = [
  {
    phase: 'Phase 1 — Before you start',
    time: '30 minutes',
    items: [
      {
        task: 'Export your current menu',
        detail:
          'Collect all categories, items, modifiers, and prices in a spreadsheet. Include notes like "best seller" or "seasonal" — these help during setup.',
      },
      {
        task: 'Decide your table zones',
        detail:
          'Map out which tables will have QR codes. Group them by section (e.g. Main Hall, Patio, Bar) so your floor view matches your physical layout.',
      },
      {
        task: 'Choose your go-live scope',
        detail:
          'For Day 1, keep it simple — QR scan → order → pay. Skip loyalty, modifiers, and upsell prompts until the team is comfortable with the core flow.',
      },
      {
        task: 'Assign a go-live owner',
        detail:
          'One person should own the launch — typically the outlet manager or ops lead. They will handle QR printing, staff briefing, and the first service.',
      },
    ],
  },
  {
    phase: 'Phase 2 — Menu upload',
    time: '1–2 hours',
    items: [
      {
        task: 'Upload categories first',
        detail:
          'Create top-level categories (Starters, Mains, Desserts, Beverages) before adding items. This keeps your menu tree clean and easy to re-order later.',
      },
      {
        task: 'Add items with images',
        detail:
          'Items with photos get 30–40% more clicks on average. Use square images (minimum 600×600px) on a clean background. Even a phone photo in good light works.',
      },
      {
        task: 'Set prices and availability',
        detail:
          'Mark items as available or unavailable. If you run lunch and dinner menus, use time-based visibility so the right items show at the right time automatically.',
      },
      {
        task: 'Add modifiers for top items',
        detail:
          'Start with 3–5 popular items. Add "Add-ons" (extra cheese, sauce on side) and "Variants" (small / large). Do not add modifiers to every item on Day 1.',
      },
    ],
  },
  {
    phase: 'Phase 3 — QR code setup',
    time: '30 minutes',
    items: [
      {
        task: 'Generate table QR codes',
        detail:
          'Create one QR code per table in your Servy outlet dashboard. Each code is linked to a specific table number so orders arrive already tagged to the right seat.',
      },
      {
        task: 'Print and laminate',
        detail:
          'Print at A5 or tent-card size. Laminate for durability — kitchen humidity and spills will destroy unprotected paper within a week. Print 2 extras per table as backups.',
      },
      {
        task: 'Test every QR before placing',
        detail:
          'Scan each code from your phone before it goes on a table. Confirm the correct table name shows in the order flow. Replace any that scan incorrectly.',
      },
      {
        task: 'Place codes at eye level',
        detail:
          'Stand-up tent cards or wall mounts at seated eye level get 60% higher scan rates than flat table codes. Avoid placing under table mats or near candles.',
      },
    ],
  },
  {
    phase: 'Phase 4 — Staff training',
    time: '45 minutes',
    items: [
      {
        task: 'Walk through the kitchen view',
        detail:
          'Show kitchen staff how orders appear on the KDS (kitchen display). They should understand order status flow: New → Accepted → Ready → Served.',
      },
      {
        task: 'Train floor staff on order monitoring',
        detail:
          'Floor staff need to know how to see table order status, how to handle a guest who needs help ordering, and how to mark a table as cleared after service.',
      },
      {
        task: 'Practice the payment flow',
        detail:
          'Run 3–4 test orders end-to-end. Guest scans QR → adds items → pays via UPI or card → kitchen confirms. Everyone should complete this without help before the first service.',
      },
      {
        task: 'Set up the fallback protocol',
        detail:
          'Decide what staff do when a guest cannot or will not use QR: take a verbal order and enter it manually on the POS. This covers elderly guests, phone battery issues, and app errors.',
      },
    ],
  },
  {
    phase: 'Phase 5 — Go-live day',
    time: 'First service',
    items: [
      {
        task: 'Brief the full team at the start of service',
        detail:
          "Five-minute huddle: remind staff that QR is live, confirm who handles manual order fallback, and check that the kitchen display is showing orders correctly.",
      },
      {
        task: 'Station a team member near the entrance for the first hour',
        detail:
          'Have one floor staff available to help guests scan and place their first order. After the first 3–4 tables do it independently, the rest of the service will be self-sufficient.',
      },
      {
        task: 'Monitor the order board in real time',
        detail:
          'The outlet manager should keep the Servy dashboard open throughout the first service. Watch for stuck orders (accepted but not confirmed) and act within 2 minutes.',
      },
      {
        task: 'Collect feedback at end of service',
        detail:
          'Ask 5 guests about their ordering experience. Ask kitchen staff about the KDS. Note any friction points. Fix the top 2 issues before the next service.',
      },
    ],
  },
];

const CHECKLIST = [
  'Menu exported and reviewed',
  'Categories created in Servy',
  'All items uploaded with prices',
  'Item images added for top sellers',
  'Modifiers set for key items',
  'Table zones mapped',
  'QR codes generated per table',
  'All QR codes tested on a phone',
  'QR codes printed and placed',
  'Kitchen staff trained on KDS',
  'Floor staff trained on order monitoring',
  'Payment flow tested end-to-end',
  'Fallback protocol agreed',
  'Go-live briefing done',
];

export default function QrOrderingPlaybookPage() {
  return (
    <MarketingShell>
      <main className="py-16 lg:py-20">
        <MarketingContainer>
          <div className="mx-auto max-w-3xl">

            {/* Header */}
            <div className="mb-12 border-b border-slate-200 pb-10">
              <MarketingBadge>Playbook</MarketingBadge>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Launch QR ordering in one day.
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                A practical, phase-by-phase guide for restaurant teams going live with table QR ordering — from menu upload to the first paid order — in a single working day.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {['5 phases', '14-step checklist', '~4 hours total', 'No tech team needed'].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Phases */}
            <div className="space-y-10">
              {STEPS.map((phase, pi) => (
                <div key={phase.phase}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                      {pi + 1}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{phase.phase}</h2>
                      <p className="text-xs text-slate-500">Estimated time: {phase.time}</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-4 border-l-2 border-slate-100 pl-6 ml-4">
                    {phase.items.map((item) => (
                      <div key={item.task} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.task}</p>
                            <p className="mt-1.5 text-sm leading-7 text-slate-600">{item.detail}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick checklist */}
            <div className="mt-14 rounded-[2rem] border border-emerald-100 bg-emerald-50/60 p-7">
              <h2 className="text-xl font-semibold text-slate-900">Go-live checklist</h2>
              <p className="mt-2 text-sm text-slate-600">Print this and tick off each item before your first QR service.</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {CHECKLIST.map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <span className="h-4 w-4 shrink-0 rounded border border-slate-300 bg-white" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.97)_0%,rgba(15,118,110,0.95)_100%)] p-8 text-white">
              <h2 className="text-2xl font-semibold">Want a guided walkthrough?</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Book a demo and we will walk through the QR setup live with your menu and outlet configuration.
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
