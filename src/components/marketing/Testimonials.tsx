import Reveal from './Reveal';
import { testimonials } from '@/lib/marketing-content';

export default function Testimonials() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <Reveal
          key={testimonial.name}
          delay={index * 0.08}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_18px_44px_rgba(15,23,42,0.05)]"
        >
          <p className="text-base leading-8 text-slate-700">&ldquo;{testimonial.quote}&rdquo;</p>
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
