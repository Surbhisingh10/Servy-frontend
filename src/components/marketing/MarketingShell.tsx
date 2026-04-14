import type { ReactNode } from 'react';
import MarketingFooter from './MarketingFooter';
import MarketingNavbar from './MarketingNavbar';

export default function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#fbfaf6] text-slate-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.24),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_26%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.9),transparent_58%),linear-gradient(180deg,#eefaf4_0%,#fbfaf6_38%,#fffdf8_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55] [background-image:linear-gradient(rgba(24,53,45,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(24,53,45,0.035)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(circle_at_center,black,transparent_84%)]"
      />
      <div className="relative z-10 flex min-h-screen flex-col">
        <MarketingNavbar />
        <main className="flex-1">{children}</main>
        <MarketingFooter />
      </div>
    </div>
  );
}
