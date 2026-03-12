import { ReactNode } from 'react';
import MarketingFooter from './MarketingFooter';
import MarketingNavbar from './MarketingNavbar';

export default function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1A202C]">
      <MarketingNavbar />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
