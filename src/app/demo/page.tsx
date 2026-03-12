import type { Metadata } from 'next';
import LeadForm from '@/components/marketing/LeadForm';
import MarketingShell from '@/components/marketing/MarketingShell';
import SectionHeader from '@/components/marketing/SectionHeader';

export const metadata: Metadata = {
  title: 'Book Demo | Restaurant SaaS',
  description: 'Request a personalized demo of Restaurant SaaS for your restaurant or food brand.',
};

export default function DemoPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeader
          eyebrow="Book Demo"
          title="See the platform in a guided walkthrough."
          description="We will tailor the demo around your outlet count, current ordering setup, and growth goals."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            {[
              'Walk through the QR ordering experience',
              'See the unified dashboard with direct and aggregator orders',
              'Understand CRM, customer groups, and campaign workflows',
              'Review pricing and rollout options for your restaurant',
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.6rem] border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.05)]"
              >
                {item}
              </div>
            ))}
          </div>

          <LeadForm
            title="Request a Demo"
            description="Share your details and our team will reach out to schedule a walkthrough."
            buttonLabel="Request Demo"
          />
        </div>
      </section>
    </MarketingShell>
  );
}
