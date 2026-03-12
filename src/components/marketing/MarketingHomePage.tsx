import Link from 'next/link';
import FeatureCards from '@/components/marketing/FeatureCards';
import FeatureShowcase from '@/components/marketing/FeatureShowcase';
import HeroPreview from '@/components/marketing/HeroPreview';
import MarketingShell from '@/components/marketing/MarketingShell';
import PricingCards from '@/components/marketing/PricingCards';
import ResourceCards from '@/components/marketing/ResourceCards';
import Reveal from '@/components/marketing/Reveal';
import SectionHeader from '@/components/marketing/SectionHeader';
import SocialProofStrip from '@/components/marketing/SocialProofStrip';
import Testimonials from '@/components/marketing/Testimonials';
import {
  benefits,
  comparisonRows,
  faqs,
  proofPoints,
} from '@/lib/marketing-content';

export default function MarketingHomePage() {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(4,57,39,0.18),transparent_42%),radial-gradient(circle_at_top_right,rgba(4,57,39,0.10),transparent_35%)]" />
        <div className="mx-auto grid max-w-7xl gap-14 px-6 pb-20 pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pb-28 lg:pt-24">
          <Reveal className="relative z-10">
            <div className="inline-flex rounded-full border border-primary-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-primary-700 shadow-sm">
              Restaurant Growth Platform
            </div>
            <h1 className="mt-8 max-w-2xl text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              Run orders, CRM, and promotions from a single restaurant OS.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-600">
              Restaurant SaaS helps operators launch QR ordering, unify aggregator orders, track
              repeat customers, and automate campaigns without stitching together six separate tools.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(4,57,39,0.25)] transition hover:bg-primary-600"
              >
                Start Free Trial
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Book Demo
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-2xl border border-white/80 bg-white/80 px-4 py-4 text-sm text-slate-700 shadow-sm backdrop-blur"
                >
                  {benefit}
                </div>
              ))}
            </div>
          </Reveal>

          <div className="relative z-10 flex items-center">
            <HeroPreview />
          </div>
        </div>
      </section>

      <SocialProofStrip />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeader
          eyebrow="Why Restaurants Choose Us"
          title="A premium system built for service speed and repeat revenue."
          description="Replace disconnected ordering tools, spreadsheets, CRM workarounds, and campaign apps with one cohesive platform designed around restaurant workflows."
          align="center"
        />
        <div className="mt-14">
          <FeatureCards />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeader
          eyebrow="Product Detail"
          title="A restaurant stack that covers operations, retention, and online channels together."
          description="The reference pattern that works best here is not just listing features, but showing how each one improves a real restaurant workflow. This section does that with richer snapshots and practical outcomes."
        />
        <div className="mt-14">
          <FeatureShowcase />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {proofPoints.map((point, index) => {
            const Icon = point.icon;

            return (
              <Reveal
                key={point.title}
                delay={index * 0.06}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_16px_44px_rgba(15,23,42,0.05)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">{point.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{point.description}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            eyebrow="How Teams Win"
            title="From front-of-house to marketing, every team works from the same source of truth."
            description="Service teams see cleaner order flow, owners see live performance, and marketing teams get customer segments without exporting data."
          />

          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
            <table className="w-full">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Capability</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Starter</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Growth</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Scale</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, index) => (
                  <tr key={row.label} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.label}</td>
                    {row.values.map((value) => (
                      <td key={`${row.label}-${value}`} className="px-6 py-4 text-sm text-slate-600">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeader
          eyebrow="Operator Feedback"
          title="Restaurants buy outcomes, not a list of modules."
          description="This section adds the social proof and category-specific trust signals that high-intent restaurant buyers look for before booking a demo."
          align="center"
        />
        <div className="mt-14">
          <Testimonials />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeader
          eyebrow="Pricing"
          title="Simple plans for operators at every stage."
          description="Start with QR ordering and scale into customer CRM, campaign automation, and unified aggregator workflows as your business grows."
          align="center"
        />
        <div className="mt-14">
          <PricingCards />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeader
          eyebrow="Resources"
          title="Give buyers enough detail to understand the rollout before they talk to sales."
          description="The reference site does this well with educational content and repeated conversion paths. These cards keep that intent while staying product-focused."
          align="center"
        />
        <div className="mt-14">
          <ResourceCards />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {faqs.map((faq) => (
            <article
              key={faq.title}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_16px_44px_rgba(15,23,42,0.05)]"
            >
              <h3 className="text-xl font-semibold text-slate-900">{faq.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{faq.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-6 lg:px-8">
        <div className="rounded-[2.4rem] bg-slate-900 px-8 py-14 text-white shadow-[0_30px_70px_rgba(15,23,42,0.25)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-300">
            Ready to Launch
          </p>
          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-semibold tracking-tight">
                Show restaurants a faster way to run service and grow revenue.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-300">
                Start a free trial for your first outlet or book a guided walkthrough tailored to
                your operation.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-600"
              >
                Start Free Trial
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Book Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
