'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Reveal from './Reveal';
import { paymentBenefits, paymentIntegrationTools } from '@/lib/marketing-content';

const logoFrameStyles = [
  'from-emerald-50 to-white',
  'from-sky-50 to-white',
  'from-emerald-50 to-white',
  'from-amber-50 to-white',
  'from-rose-50 to-white',
  'from-violet-50 to-white',
  'from-cyan-50 to-white',
  'from-lime-50 to-white',
];

export default function PaymentIntegrationsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <Reveal>
        <div className="rounded-[2.4rem] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
                Payment Integrations
              </p>
              <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Connect with the tools you already use.
              </h2>
              <p className="max-w-2xl text-lg leading-9 text-slate-600">
                Servy keeps UPI, gateways, and accounting tools in one clean flow without
                forcing your team into a separate payments system.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(5,150,105,0.28)] transition hover:bg-emerald-700"
                >
                  Talk to Sales
                </Link>
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Explore Features
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {paymentBenefits.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <Reveal
                      key={item.title}
                      delay={index * 0.04}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-2xl bg-white p-3 text-emerald-700 shadow-sm ring-1 ring-slate-200">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-slate-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
                  Why it fits
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {['UPI ready', 'Gateway friendly', 'Accounting aligned'].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] p-5 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">
                      Supported tools
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                      Real logos in a clean wall.
                    </h3>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Live
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {paymentIntegrationTools.map((tool, index) => {
                    const frameClass = logoFrameStyles[index % logoFrameStyles.length];
                    const imageSrc = tool.imageSrc?.trim();

                    return (
                      <article
                        key={tool.name}
                        className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
                      >
                        <div className={`relative aspect-[4/3] bg-gradient-to-br ${frameClass}`}>
                          {imageSrc ? (
                            <Image
                              src={imageSrc}
                              alt={tool.imageAlt || tool.name}
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="object-contain p-6 transition duration-300 hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <div className="text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-lg font-semibold text-slate-500">
                                  {tool.name.slice(0, 2).toUpperCase()}
                                </div>
                                <p className="mt-3 text-sm font-semibold text-slate-900">
                                  {tool.name}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3 px-5 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="text-base font-semibold text-slate-900">{tool.name}</h4>
                            {tool.badge ? (
                              <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                                {tool.badge}
                              </span>
                            ) : null}
                          </div>
                          <p className="text-sm leading-6 text-slate-600">{tool.description}</p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-10 rounded-[2.2rem] bg-slate-900 px-8 py-12 text-white shadow-[0_26px_60px_rgba(15,23,42,0.2)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
            Ready to modernize payments?
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight">
            Make payment checkout faster for your guests and easier for your team.
          </h3>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            Let&apos;s connect your payment flow, UPI experience, and reporting into one smoother
            operational stack.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Talk to Sales
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              See Platform Features
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
