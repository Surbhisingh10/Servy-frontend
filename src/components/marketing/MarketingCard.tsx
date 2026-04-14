import type { LucideIcon } from 'lucide-react';

export default function MarketingCard({
  icon: Icon,
  title,
  description,
  className = '',
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <article
      className={`group flex h-full flex-col rounded-[1.75rem] border border-emerald-900/8 bg-white/90 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] ${className}`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(16,185,129,0.14)_0%,rgba(5,150,105,0.1)_100%)] text-emerald-700 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[linear-gradient(135deg,rgba(16,185,129,0.22)_0%,rgba(5,150,105,0.16)_100%)]">
        <Icon size={20} />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}
