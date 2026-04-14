'use client';

import { useState } from 'react';
import { ArrowRight, Clock, ShoppingCart, Store, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const OUTLET_OPTIONS = [
  { label: '1', sublabel: 'Single outlet', value: 1, plan: 'Starter', planPrice: '₹1,499' },
  { label: '2–5', sublabel: 'Growing brand', value: 3, plan: 'Growth', planPrice: '₹2,499' },
  { label: '6+', sublabel: 'Multi-location', value: 8, plan: 'Scale', planPrice: 'Custom' },
];

function formatCurrency(val: number): string {
  if (val >= 10_000_000) return `₹${(val / 10_000_000).toFixed(1)}Cr`;
  if (val >= 100_000) return `₹${(val / 100_000).toFixed(1)}L`;
  if (val >= 1_000) return `₹${(val / 1_000).toFixed(0)}K`;
  return `₹${val}`;
}

export default function RoiCalculator() {
  const [outletIdx, setOutletIdx] = useState(1);
  const [dailyOrders, setDailyOrders] = useState(80);
  const [avgOrderValue, setAvgOrderValue] = useState(350);

  const { value: outlets, plan, planPrice } = OUTLET_OPTIONS[outletIdx];

  const monthlyOrders = dailyOrders * outlets * 30;
  const monthlyGMV = monthlyOrders * avgOrderValue;
  const timeSavedHours = Math.round((monthlyOrders * 1.5) / 60);
  const recoveredRevenue = Math.round(monthlyGMV * 0.06);

  const metrics = [
    { icon: ShoppingCart, label: 'Orders managed', value: monthlyOrders.toLocaleString(), sub: 'per month' },
    { icon: TrendingUp, label: 'Revenue processed', value: formatCurrency(monthlyGMV), sub: 'per month' },
    { icon: Clock, label: 'Time saved', value: `${timeSavedHours} hrs`, sub: 'of manual work' },
    { icon: Store, label: 'Revenue recovered', value: formatCurrency(recoveredRevenue), sub: 'missed & errors' },
  ];

  return (
    <div className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.07)]">
      <div className="border-b border-slate-100 px-6 py-5 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700">
          ROI Calculator
        </p>
        <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
          See what the platform can unlock for your operation
        </p>
      </div>

      <div className="grid lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-7 p-6 lg:p-8">
          {/* Outlet selector */}
          <div>
            <p className="text-sm font-semibold text-slate-700">Number of outlets</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {OUTLET_OPTIONS.map((opt, i) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setOutletIdx(i)}
                  className={`flex flex-col items-center rounded-2xl border py-3 text-center transition-all duration-200 ${
                    outletIdx === i
                      ? 'border-emerald-300 bg-emerald-50 shadow-[0_4px_14px_rgba(16,185,129,0.14)]'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <span
                    className={`text-lg font-semibold ${outletIdx === i ? 'text-emerald-700' : 'text-slate-800'}`}
                  >
                    {opt.label}
                  </span>
                  <span
                    className={`mt-0.5 text-[11px] ${outletIdx === i ? 'text-emerald-600' : 'text-slate-400'}`}
                  >
                    {opt.sublabel}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Daily orders slider */}
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Daily orders per outlet</p>
              <span className="rounded-lg bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                {dailyOrders}
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={400}
              step={10}
              value={dailyOrders}
              onChange={(e) => setDailyOrders(Number(e.target.value))}
              className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-emerald-600"
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-slate-400">
              <span>20</span>
              <span>400</span>
            </div>
          </div>

          {/* Avg order value slider */}
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Average order value</p>
              <span className="rounded-lg bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                ₹{avgOrderValue}
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={2000}
              step={50}
              value={avgOrderValue}
              onChange={(e) => setAvgOrderValue(Number(e.target.value))}
              className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-emerald-600"
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-slate-400">
              <span>₹100</span>
              <span>₹2,000</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="border-t border-slate-100 p-6 lg:border-l lg:border-t-0 lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
            Your monthly estimate
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {metrics.map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Icon size={15} className="text-emerald-600" />
                </div>
                <p className="mt-3 text-xl font-semibold tracking-tight text-slate-900">{value}</p>
                <p className="mt-0.5 text-[11px] font-medium text-slate-600">{label}</p>
                <p className="text-[11px] text-slate-400">{sub}</p>
              </div>
            ))}
          </div>

          {/* Recommended plan */}
          <div className="mt-5 rounded-[1.5rem] border border-emerald-200 bg-[linear-gradient(135deg,rgba(16,185,129,0.06)_0%,rgba(15,118,110,0.04)_100%)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
                  Recommended plan
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {plan}{' '}
                  <span className="text-sm font-normal text-slate-500">— {planPrice}/mo</span>
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#10b981_0%,#0f766e_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(16,185,129,0.30)] active:scale-[0.97]"
              >
                Book Demo
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <p className="mt-4 text-[11px] leading-5 text-slate-400">
            Estimates based on industry benchmarks. Time savings assume ~1.5 min of manual effort per
            order. Revenue recovery assumes ~6% improvement from unified order management and
            reconciliation.
          </p>
        </div>
      </div>
    </div>
  );
}
