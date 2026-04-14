import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingContainer from '@/components/marketing/MarketingContainer';
import MarketingShell from '@/components/marketing/MarketingShell';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://servy.app';

export const metadata: Metadata = {
  title: 'Terms of Service | Servy',
  description: 'Terms and conditions governing your use of the Servy platform.',
  openGraph: {
    title: 'Terms of Service | Servy',
    description: 'Terms and conditions governing your use of the Servy platform.',
    url: `${SITE_URL}/terms`,
    siteName: 'Servy',
    type: 'website',
  },
};

const LAST_UPDATED = 'April 14, 2026';
const CONTACT_EMAIL = 'business@servyworld.com';

export default function TermsPage() {
  return (
    <MarketingShell>
      <main className="py-16 lg:py-20">
        <MarketingContainer>
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-10 border-b border-slate-200 pb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700">
                Legal
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
                Terms of Service
              </h1>
              <p className="mt-3 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>
            </div>

            {/* Body */}
            <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline">

              <p>
                These Terms of Service (&quot;Terms&quot;) govern your access to and use of the
                Servy platform and website (collectively, the &quot;Service&quot;). By accessing
                or using the Service, you agree to be bound by these Terms. If you do not agree,
                do not use the Service.
              </p>

              <h2>1. The Service</h2>
              <p>
                Servy provides a restaurant operations management platform including point-of-sale,
                order management, inventory tracking, and reporting tools. The Service is provided
                on a subscription basis.
              </p>

              <h2>2. Eligibility</h2>
              <p>
                You must be at least 18 years old and have the legal authority to enter into
                contracts on behalf of your business to use the Service. By registering, you
                represent that you meet these requirements.
              </p>

              <h2>3. Account Registration</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account
                credentials and for all activity that occurs under your account. Notify us
                immediately at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> if you
                suspect unauthorised access.
              </p>

              <h2>4. Subscription and Payment</h2>
              <ul>
                <li>
                  Subscriptions are billed on a monthly basis. Prices are listed on our{' '}
                  <Link href="/pricing">Pricing page</Link>.
                </li>
                <li>
                  All fees are exclusive of applicable taxes, which will be charged separately
                  where required by law.
                </li>
                <li>
                  Subscriptions renew automatically unless cancelled before the renewal date.
                </li>
                <li>
                  We reserve the right to change pricing with 30 days&apos; notice. Continued use
                  after the notice period constitutes acceptance of the new pricing.
                </li>
              </ul>

              <h2>5. Cancellation and Refunds</h2>
              <p>
                You may cancel your subscription at any time from your account settings. Cancellation
                takes effect at the end of the current billing period. We do not offer pro-rated
                refunds for partial billing periods except where required by applicable law.
              </p>

              <h2>6. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use the Service for any unlawful purpose or in violation of any regulations.</li>
                <li>
                  Attempt to gain unauthorised access to any part of the Service or its related
                  systems.
                </li>
                <li>
                  Reverse engineer, decompile, or disassemble any portion of the Service.
                </li>
                <li>
                  Use the Service to transmit malware, spam, or other harmful content.
                </li>
                <li>
                  Resell, sublicense, or commercially exploit the Service without our written
                  consent.
                </li>
              </ul>

              <h2>7. Your Data</h2>
              <p>
                You retain ownership of all data you input into the Service
                (&quot;Customer Data&quot;). You grant Servy a limited licence to store and process
                Customer Data solely to provide the Service. We will not access your data except
                to provide support, resolve technical issues, or as required by law.
              </p>
              <p>
                On account termination, you may export your data within 30 days. After this
                period, we may permanently delete your data.
              </p>

              <h2>8. Intellectual Property</h2>
              <p>
                The Service, including all software, designs, and content, is owned by Servy and
                protected by intellectual property laws. These Terms do not grant you any rights
                in our intellectual property other than the limited licence to use the Service.
              </p>

              <h2>9. Uptime and Support</h2>
              <p>
                We strive to maintain high availability but do not guarantee uninterrupted access
                to the Service. Planned maintenance will be communicated in advance where possible.
                Support is provided via email at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </p>

              <h2>10. Disclaimer of Warranties</h2>
              <p>
                The Service is provided &quot;as is&quot; and &quot;as available&quot; without
                warranties of any kind, express or implied, including warranties of
                merchantability, fitness for a particular purpose, or non-infringement. We do not
                warrant that the Service will be error-free or uninterrupted.
              </p>

              <h2>11. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Servy shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages, or any loss of
                profits, revenue, data, or goodwill arising from your use of the Service. Our
                total liability to you shall not exceed the amounts paid by you to us in the
                three months preceding the claim.
              </p>

              <h2>12. Indemnification</h2>
              <p>
                You agree to indemnify and hold Servy harmless from any claims, damages, or
                expenses (including reasonable legal fees) arising from your use of the Service,
                your violation of these Terms, or your infringement of any third-party rights.
              </p>

              <h2>13. Termination</h2>
              <p>
                We may suspend or terminate your account immediately if you violate these Terms
                or if required by law. You may terminate your account at any time by cancelling
                your subscription and ceasing use of the Service.
              </p>

              <h2>14. Governing Law</h2>
              <p>
                These Terms are governed by the laws of India. Any disputes shall be subject to
                the exclusive jurisdiction of the courts located in India.
              </p>

              <h2>15. Changes to These Terms</h2>
              <p>
                We may update these Terms at any time. We will notify you of material changes by
                email or by posting a notice on the platform. Continued use after the effective
                date of changes constitutes acceptance.
              </p>

              <h2>16. Contact</h2>
              <p>
                For questions about these Terms, contact us at:
              </p>
              <p>
                <strong>Servy</strong>
                <br />
                Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </p>
            </div>

            {/* Back link */}
            <div className="mt-12 border-t border-slate-100 pt-8">
              <Link
                href="/"
                className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </MarketingContainer>
      </main>
    </MarketingShell>
  );
}
