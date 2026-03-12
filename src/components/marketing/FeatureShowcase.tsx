import Reveal from './Reveal';
import { featureShowcases } from '@/lib/marketing-content';

export default function FeatureShowcase() {
  return (
    <div className="space-y-8">
      {featureShowcases.map((feature, index) => (
        <Reveal key={feature.title}>
          <section
            className={`grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_44px_rgba(15,23,42,0.05)] lg:grid-cols-[1.05fr_0.95fr] lg:p-10 ${
              index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
            }`}
          >
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-primary-600">
                {feature.eyebrow}
              </p>
              <h3 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-900">
                {feature.title}
              </h3>
              <p className="max-w-2xl text-base leading-8 text-slate-600">{feature.description}</p>

              <div className="space-y-3 pt-2">
                {feature.bullets.map((bullet, bulletIndex) => (
                  <Reveal
                    key={bullet}
                    delay={bulletIndex * 0.05}
                    className="flex items-start gap-3 text-sm text-slate-700"
                  >
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary-500" />
                    <span>{bullet}</span>
                  </Reveal>
                ))}
              </div>

              <div className="grid gap-3 pt-3 sm:grid-cols-3">
                {feature.stats.map((stat, statIndex) => (
                  <Reveal
                    key={stat.label}
                    delay={0.12 + statIndex * 0.05}
                    className="rounded-[1.25rem] border border-primary-100 bg-primary-50 p-4"
                  >
                    <p className="text-xl font-semibold text-slate-900">{stat.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                      {stat.label}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-primary-100 bg-[linear-gradient(180deg,#eef5f1_0%,#ffffff_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
              <div className="rounded-[1.5rem] bg-slate-900 p-6 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-primary-300">
                      Product View
                    </p>
                    <h4 className="mt-3 text-2xl font-semibold">{feature.previewTitle}</h4>
                  </div>
                  <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-primary-200">
                    Live
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-300">{feature.previewBody}</p>

                <div className="mt-6 space-y-3">
                  {feature.previewPoints.map((point, pointIndex) => (
                    <Reveal
                      key={point}
                      delay={0.16 + pointIndex * 0.06}
                      className="flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3"
                    >
                      <span className="font-medium text-white">{point}</span>
                      <span className="text-xs uppercase tracking-[0.2em] text-primary-200">
                        Active
                      </span>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      ))}
    </div>
  );
}
