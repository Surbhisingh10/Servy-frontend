import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingContainer from '@/components/marketing/MarketingContainer';
import MarketingShell from '@/components/marketing/MarketingShell';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://servy.app';

export const metadata: Metadata = {
  title: 'Privacy Policy | Servy',
  description: 'How Servy collects, uses, and protects your personal information.',
  openGraph: {
    title: 'Privacy Policy | Servy',
    description: 'How Servy collects, uses, and protects your personal information.',
    url: `${SITE_URL}/privacy`,
    siteName: 'Servy',
    type: 'website',
  },
};

const LAST_UPDATED = 'April 14, 2026';
const CONTACT_EMAIL = 'business@servyworld.com';

export default function PrivacyPage() {
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
                Privacy Policy
              </h1>
              <p className="mt-3 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>
            </div>

            {/* Body */}
            <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline">

              <p>
                Servy (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the Servy
                restaurant management platform and this website. This Privacy Policy explains what
                personal data we collect, how we use it, and your rights regarding that data.
              </p>

              <h2>1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, including:
              </p>
              <ul>
                <li>
                  <strong>Contact and enquiry data</strong> — your name, email address, phone
                  number, restaurant name, and city when you submit a contact or demo request form.
                </li>
                <li>
                  <strong>Account data</strong> — email address, password (stored as a
                  one-way hash), and restaurant profile details when you register for a Servy
                  account.
                </li>
                <li>
                  <strong>Usage data</strong> — pages visited, features accessed, and session
                  metadata collected automatically via server logs when you use our platform.
                </li>
              </ul>
              <p>We do not sell your personal data to third parties.</p>

              <h2>2. How We Use Your Information</h2>
              <ul>
                <li>To respond to demo requests and sales enquiries.</li>
                <li>To provide, operate, and improve the Servy platform.</li>
                <li>To send transactional communications (account setup, billing receipts).</li>
                <li>To detect and prevent fraud or abuse.</li>
                <li>To comply with applicable legal obligations.</li>
              </ul>

              <h2>3. Legal Basis for Processing (GDPR)</h2>
              <p>
                If you are located in the European Economic Area, we process your personal data
                under the following legal bases:
              </p>
              <ul>
                <li>
                  <strong>Contractual necessity</strong> — to deliver the services you have
                  requested or signed up for.
                </li>
                <li>
                  <strong>Legitimate interests</strong> — to respond to enquiries, improve our
                  product, and secure our systems.
                </li>
                <li>
                  <strong>Legal obligation</strong> — where required by applicable law.
                </li>
              </ul>

              <h2>4. Data Sharing</h2>
              <p>
                We share data only with trusted service providers who help us operate the
                platform, including:
              </p>
              <ul>
                <li>
                  <strong>Resend</strong> — transactional email delivery for lead notifications.
                </li>
                <li>
                  <strong>Cloud hosting providers</strong> — for infrastructure and data storage.
                </li>
                <li>
                  <strong>Payment processors</strong> — for subscription billing (we do not
                  store card details).
                </li>
              </ul>
              <p>
                All third-party processors are bound by data processing agreements and are
                required to protect your information.
              </p>

              <h2>5. Data Retention</h2>
              <p>
                We retain contact enquiry data for up to 24 months. Account data is retained for
                the duration of your subscription and for up to 90 days after account closure,
                after which it is permanently deleted or anonymised.
              </p>

              <h2>6. Your Rights</h2>
              <p>
                Depending on your location, you may have the right to:
              </p>
              <ul>
                <li>Access the personal data we hold about you.</li>
                <li>Request correction of inaccurate data.</li>
                <li>Request deletion of your data (&quot;right to be forgotten&quot;).</li>
                <li>Object to or restrict certain processing activities.</li>
                <li>Data portability (receive your data in a machine-readable format).</li>
              </ul>
              <p>
                To exercise any of these rights, email us at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </p>

              <h2>7. Cookies</h2>
              <p>
                This website uses only essential cookies required for session management and
                security. We do not use tracking or advertising cookies. You can disable cookies
                in your browser settings; note that this may affect platform functionality.
              </p>

              <h2>8. Security</h2>
              <p>
                We use industry-standard safeguards including HTTPS encryption in transit, hashed
                password storage, and role-based access controls. No method of transmission over
                the internet is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2>9. Children&apos;s Privacy</h2>
              <p>
                Servy is not directed at children under the age of 16. We do not knowingly collect
                personal data from children. If you believe a child has provided us data, please
                contact us and we will delete it promptly.
              </p>

              <h2>10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. When we do, we will update
                the &quot;Last updated&quot; date at the top of this page. Continued use of our
                services after changes constitutes acceptance of the updated policy.
              </p>

              <h2>11. Contact Us</h2>
              <p>
                For privacy-related questions or requests, contact us at:
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
