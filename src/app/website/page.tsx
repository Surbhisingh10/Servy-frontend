import type { Metadata } from 'next';
import MarketingHomePage from '@/components/marketing/MarketingHomePage';

export const metadata: Metadata = {
  title: 'Website | Restaurant SaaS',
  description:
    'Marketing website for Restaurant SaaS covering QR ordering, CRM, campaigns, analytics, and unified order management.',
};

export default function WebsitePage() {
  return <MarketingHomePage />;
}
