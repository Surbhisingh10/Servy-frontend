import type { Metadata } from 'next';
import MarketingHomePage from '@/components/marketing/MarketingHomePage';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://servy.app';

export const metadata: Metadata = {
  title: 'The Pulse of Your Hospitality | Servy',
  description:
    'A unified operating system for the modern kitchen, the ambitious floor, and the connected guest.',
  openGraph: {
    title: 'The Pulse of Your Hospitality | Servy',
    description:
      'A unified operating system for the modern kitchen, the ambitious floor, and the connected guest.',
    url: SITE_URL,
    siteName: 'Servy',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Pulse of Your Hospitality | Servy',
    description:
      'A unified operating system for the modern kitchen, the ambitious floor, and the connected guest.',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Servy',
  url: SITE_URL,
  description:
    'A unified operating system for restaurants covering QR ordering, CRM, promotions, inventory, and aggregator management.',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'business@servyworld.com',
    contactType: 'customer support',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Servy',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'Restaurant management platform for QR ordering, multi-outlet control, CRM, and unified aggregator management.',
  offers: {
    '@type': 'Offer',
    price: '49',
    priceCurrency: 'USD',
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <MarketingHomePage />
    </>
  );
}
