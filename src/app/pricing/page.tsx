import type { Metadata } from 'next';
import MarketingShell from '@/components/marketing/MarketingShell';
import PricingCards from '@/components/marketing/PricingCards';
import SectionHeader from '@/components/marketing/SectionHeader';
import { comparisonRows } from '@/lib/marketing-content';

export const metadata: Metadata = {
  title: 'Pricing | Restaurant SaaS',
  description: 'Compare Restaurant SaaS plans for QR ordering, CRM, campaigns, integrations, and admin controls.',
};

export default function PricingPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <SectionHeader
          eyebrow="Pricing"
          title="Flexible plans for restaurants at every stage."
          description="Start small, scale into CRM and campaigns, or roll out across multiple outlets with admin controls."
          align="center"
        />

        <div className="mt-14">
          <PricingCards />
        </div>

        <div className="mt-16 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
          <table className="w-full">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Feature</th>
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
      </section>
    </MarketingShell>
  );
}
