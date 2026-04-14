import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import MarketingBadge from '@/components/marketing/MarketingBadge';
import MarketingButton from '@/components/marketing/MarketingButton';
import MarketingContainer from '@/components/marketing/MarketingContainer';
import MarketingShell from '@/components/marketing/MarketingShell';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://servy.app';

export const metadata: Metadata = {
  title: 'Guide: Build a Repeat-Customer Engine | Servy',
  description:
    'How restaurants collect guest data at checkout, build meaningful customer segments, and run campaigns that drive real return visits.',
  openGraph: {
    title: 'Guide: Build a Repeat-Customer Engine | Servy',
    description:
      'How restaurants collect guest data at checkout and turn it into segments that drive return visits.',
    url: `${SITE_URL}/resources/repeat-customer-guide`,
    siteName: 'Servy',
    type: 'article',
  },
};

const SECTIONS = [
  {
    heading: 'Why most restaurant loyalty programmes fail',
    body: [
      'Most restaurants treat loyalty as a points card — stamp 10 times, get 1 free. Guests enrol, forget about the card, and never return specifically because of the programme. The card does not drive behaviour; it just rewards behaviour that was already happening.',
      "The difference between a loyalty programme and a repeat-customer engine is data. A programme counts transactions. An engine understands guests — what they order, how often they visit, which channel they use, and when they go quiet. With that understanding, you can reach out at exactly the right moment with exactly the right message.",
      'This guide walks through how to build that engine using the touchpoints you already have: billing, QR ordering, and checkout.',
    ],
  },
  {
    heading: 'Step 1 — Capture guest identity at checkout',
    body: [
      "Every transaction is an opportunity to collect a guest's identity. The key is to make it frictionless. Do not ask for name, phone, email, and address at once. Ask for one thing — a phone number — and link it to the bill.",
      'At billing, your POS should prompt: "Add mobile number for e-bill?" Most guests say yes because the value exchange is clear — they get a digital receipt, you get a contact. Over time, repeat visits from the same number build a transaction history automatically.',
      'For QR ordering, identity is even easier. When a guest places an order from a table QR, their phone session is captured. If they choose to save their details for faster checkout next time, you have a profile without any manual entry.',
      'Within 30 days of enabling mobile-linked billing, most outlets see 40–60% of transactions linked to an identifiable guest.',
    ],
  },
  {
    heading: 'Step 2 — Build segments that mean something',
    body: [
      'Raw guest data is not useful until it is segmented. The three segments that drive the most return visits for restaurants are: New Guests (first visit in the last 30 days), At-Risk Guests (visited 3+ times but not in the last 45 days), and VIP Guests (visited 6+ times or spent above a threshold).',
      'New Guests need a reason to come back within 2 weeks. At-Risk Guests need a reason to break their lapse. VIP Guests need to feel recognised — not just discounted.',
      'Start with these three. Do not over-engineer segments on Day 1. As your guest database grows, you can add segments like "Weekend-only visitors", "Delivery-only guests", or "High-basket regulars" — but these need at least 3 months of data to be statistically meaningful.',
    ],
  },
  {
    heading: 'Step 3 — Design campaigns for each segment',
    body: [
      'New Guests: Send a "Thank you for visiting" message within 24 hours. Include a soft incentive — not a heavy discount, but something that feels like insider access. "Your next dessert is on us" works better than "20% off your next bill" because it is specific and low-cost to you.',
      'At-Risk Guests: Send a "We miss you" message after 30 days of silence. Be honest — "It has been a while since we saw you" — and offer a concrete reason to return. A time-limited offer (valid for 7 days) creates urgency without cheapening your brand.',
      'VIP Guests: Do not lead with discounts for your best guests. They already value your restaurant. Instead, offer early access (new menu preview), recognition (chef\'s table reservation, personalised note), or exclusive events. These cost less than discounts and build deeper loyalty.',
    ],
  },
  {
    heading: 'Step 4 — Choose the right channels',
    body: [
      'WhatsApp has a 70–85% open rate for restaurant messages, compared to 20–25% for email and 15% for SMS. If your guests are in India, WhatsApp should be your primary campaign channel. Keep messages short, conversational, and use the guest\'s first name.',
      'SMS works well for time-sensitive offers (lunch specials, same-day promotions) because it delivers even without an internet connection. Use it sparingly — 2 SMS per month maximum, or guests opt out.',
      "Email is best for longer content: monthly newsletters, new menu announcements, event invitations. It doesn't compete with WhatsApp — they serve different purposes.",
      'Avoid sending the same message across all channels simultaneously. Receiving the same offer on WhatsApp, SMS, and email within an hour feels like spam regardless of how good the offer is.',
    ],
  },
  {
    heading: 'Step 5 — Measure what matters',
    body: [
      'The only metric that matters for repeat-customer campaigns is return visit rate — the percentage of guests who come back within a defined window after receiving a campaign. Track this over 7 days and 30 days.',
      'Do not get distracted by message open rates or click rates. A guest who opens your WhatsApp message but does not visit is not a win. A guest who does not open but comes in because they remembered your restaurant is the actual outcome you want.',
      'Set a monthly review cadence: Which segment returned most? Which campaign drove the most visits? Which channel had the best return? Adjust the next month based on these three questions only.',
    ],
  },
];

export default function RepeatCustomerGuidePage() {
  return (
    <MarketingShell>
      <main className="py-16 lg:py-20">
        <MarketingContainer>
          <div className="mx-auto max-w-3xl">

            {/* Header */}
            <div className="mb-12 border-b border-slate-200 pb-10">
              <MarketingBadge>Guide</MarketingBadge>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Build a repeat-customer engine.
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                How restaurants collect guest data at checkout, build meaningful customer segments, and run campaigns that drive real return visits — not just loyalty card stamps.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {['5 sections', 'CRM strategy', 'WhatsApp campaigns', 'Segment templates'].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-12">
              {SECTIONS.map((section, i) => (
                <div key={section.heading}>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                    <span className="mr-3 text-emerald-600">{String(i + 1).padStart(2, '0')}</span>
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {section.body.map((para, j) => (
                      <p key={j} className="text-base leading-8 text-slate-600">{para}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary box */}
            <div className="mt-14 rounded-[2rem] border border-slate-200 bg-slate-50 p-7">
              <h2 className="text-xl font-semibold text-slate-900">Quick reference</h2>
              <div className="mt-5 space-y-4">
                {[
                  { segment: 'New Guests', trigger: 'First visit', action: '"Thank you" + soft incentive within 24h', channel: 'WhatsApp' },
                  { segment: 'At-Risk Guests', trigger: '30 days no visit', action: '"We miss you" + time-limited offer', channel: 'WhatsApp + SMS' },
                  { segment: 'VIP Guests', trigger: '6+ visits or high spend', action: 'Recognition + exclusive access (no discount)', channel: 'WhatsApp' },
                ].map((row) => (
                  <div key={row.segment} className="rounded-[1.25rem] border border-slate-200 bg-white p-4 text-sm">
                    <p className="font-semibold text-slate-900">{row.segment}</p>
                    <p className="mt-1 text-slate-600"><span className="font-medium text-slate-700">Trigger:</span> {row.trigger}</p>
                    <p className="mt-0.5 text-slate-600"><span className="font-medium text-slate-700">Action:</span> {row.action}</p>
                    <p className="mt-0.5 text-slate-600"><span className="font-medium text-slate-700">Channel:</span> {row.channel}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.97)_0%,rgba(15,118,110,0.95)_100%)] p-8 text-white">
              <h2 className="text-2xl font-semibold">See the CRM in action</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Book a demo to see how Servy builds guest profiles automatically from every transaction and makes segmented campaigns a two-minute task.
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
