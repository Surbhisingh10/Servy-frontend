import Reveal from './Reveal';
import { platformStats } from '@/lib/marketing-content';

export default function SocialProofStrip() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
      <Reveal className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_18px_44px_rgba(15,23,42,0.06)] backdrop-blur">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700">
            Built for modern operators
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {platformStats.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={index * 0.06}
                className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
