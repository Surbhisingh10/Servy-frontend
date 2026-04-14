import { Star } from 'lucide-react';
import Reveal from './Reveal';
import { testimonials } from '@/lib/marketing-content';

export default function Testimonials() {
  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <Reveal
          key={testimonial.name}
          delay={index * 0.08}
          className="group flex h-full flex-col rounded-[1.75rem] border border-emerald-900/8 bg-[linear-gradient(180deg,#ffffff_0%,rgba(247,251,248,0.96)_100%)] p-7 shadow-[0_18px_44px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_24px_56px_rgba(16,185,129,0.10)]"
        >
          <div className="flex gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, starIndex) => (
              <Star key={starIndex} size={16} fill="currentColor" />
            ))}
          </div>
          <p className="mt-5 flex-1 text-base leading-8 text-slate-700">&ldquo;{testimonial.quote}&rdquo;</p>
          <div className="mt-8 border-t border-slate-100 pt-5">
            <p className="font-semibold text-slate-900">{testimonial.name}</p>
            <p className="mt-1 text-sm text-slate-500">
              {testimonial.role}, {testimonial.company}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
