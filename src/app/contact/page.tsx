import type { Metadata } from 'next';
import LeadForm from '@/components/marketing/LeadForm';
import MarketingShell from '@/components/marketing/MarketingShell';
import SectionHeader from '@/components/marketing/SectionHeader';

export const metadata: Metadata = {
  title: 'Contact | Restaurant SaaS',
  description: 'Contact the Restaurant SaaS team for sales, partnerships, onboarding, or support questions.',
};

export default function ContactPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeader
          eyebrow="Contact"
          title="Talk to the team behind Restaurant SaaS."
          description="Whether you want pricing, onboarding guidance, or a product walkthrough, we will route you to the right person."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5">
            <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600">
                Email
              </p>
              <p className="mt-3 text-xl font-semibold text-slate-900">hello@restaurantsaas.com</p>
            </div>
            <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-600">
                Office
              </p>
              <p className="mt-3 text-base leading-8 text-slate-700">
                Restaurant SaaS
                <br />
                22 Market Street
                <br />
                Bengaluru, India
              </p>
            </div>
            <div className="rounded-[1.8rem] border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_18px_44px_rgba(15,23,42,0.16)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-300">
                Response Time
              </p>
              <p className="mt-3 text-base leading-8 text-slate-300">
                Most product and sales requests are answered within one business day.
              </p>
            </div>
          </div>

          <LeadForm
            title="Send Us a Message"
            description="Tell us what you need and we will get back with the next step."
            buttonLabel="Send Message"
          />
        </div>
      </section>
    </MarketingShell>
  );
}
