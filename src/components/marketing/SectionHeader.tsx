import Reveal from './Reveal';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  align?: 'left' | 'center';
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeaderProps) {
  const alignment = align === 'center' ? 'mx-auto text-center' : '';

  return (
    <Reveal className={`max-w-3xl space-y-3 ${alignment}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.38em] text-emerald-700">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
        {title}
      </h2>
      <p className="text-base leading-8 text-slate-600">{description}</p>
    </Reveal>
  );
}
