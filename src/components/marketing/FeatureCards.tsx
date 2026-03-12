import { featureHighlights } from '@/lib/marketing-content';
import Reveal from './Reveal';

export default function FeatureCards() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {featureHighlights.map((feature, index) => {
        const Icon = feature.icon;

        return (
          <Reveal
            key={feature.title}
            delay={index * 0.06}
            className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_16px_44px_rgba(15,23,42,0.06)] backdrop-blur"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
              <Icon size={22} />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
          </Reveal>
        );
      })}
    </div>
  );
}
