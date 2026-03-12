import Link from 'next/link';
import Reveal from './Reveal';
import { resourceCards } from '@/lib/marketing-content';

export default function ResourceCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {resourceCards.map((resource, index) => {
        const Icon = resource.icon;

        return (
          <Reveal
            key={resource.title}
            delay={index * 0.08}
            className="group rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_18px_44px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(4,57,39,0.12)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
              <Icon size={22} />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-slate-900">{resource.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{resource.description}</p>
            <Link
              href={resource.href}
              className="mt-6 inline-flex items-center text-sm font-semibold text-primary-700 transition group-hover:text-primary-800"
            >
              {resource.cta}
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
