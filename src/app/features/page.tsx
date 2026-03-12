import type { Metadata } from 'next';
import FeatureShowcase from '@/components/marketing/FeatureShowcase';
import FeatureCards from '@/components/marketing/FeatureCards';
import MarketingShell from '@/components/marketing/MarketingShell';
import Reveal from '@/components/marketing/Reveal';
import SectionHeader from '@/components/marketing/SectionHeader';
import { coreFeatures, proofPoints } from '@/lib/marketing-content';

export const metadata: Metadata = {
  title: 'Features | Restaurant SaaS',
  description: 'Explore QR ordering, CRM, campaigns, integrations, analytics, and unified order management.',
};

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeader
          eyebrow="Features"
          title="Everything restaurants need to operate and grow from one platform."
          description="Each feature is designed to remove operational friction and create better visibility across service, customer retention, and performance."
        />

        <div className="mt-14">
          <FeatureCards />
        </div>

        <div className="mt-16">
          <FeatureShowcase />
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
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
                <h2 className="mt-5 text-xl font-semibold text-slate-900">{point.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{point.description}</p>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {coreFeatures.map((feature, index) => (
            <Reveal
              key={feature.title}
              delay={index * 0.05}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_16px_44px_rgba(15,23,42,0.05)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-600">
                {feature.eyebrow}
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">{feature.title}</h2>
              <p className="mt-3 text-base leading-8 text-slate-600">{feature.description}</p>
              <div className="mt-5 space-y-3">
                {feature.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="mt-2 h-2 w-2 rounded-full bg-primary-500" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
