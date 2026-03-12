import type { Metadata } from 'next';
import MarketingHomePage from '@/components/marketing/MarketingHomePage';

export const metadata: Metadata = {
  title: 'Restaurant SaaS | Unified Ordering, CRM, and Growth Platform',
  description:
    'Modern restaurant SaaS for QR ordering, CRM, campaign automation, aggregator integrations, analytics, and unified order management.',
};

export default function HomePage() {
  return <MarketingHomePage />;
}
