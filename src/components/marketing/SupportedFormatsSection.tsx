'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import MarketingBadge from './MarketingBadge';
import MarketingContainer from './MarketingContainer';
import MarketingSection from './MarketingSection';
import Reveal from './Reveal';
import { supportedFormats } from '@/lib/marketing-site-content';

export default function SupportedFormatsSection() {
  const [activeFormat, setActiveFormat] = useState(supportedFormats[0]);
  const ActiveIcon = activeFormat.icon;

  return (
    <MarketingSection tone="muted" className="pt-0">
      <MarketingContainer>
        <Reveal>
          <div className="grid gap-8 rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] lg:grid-cols-[0.92fr_1.08fr] lg:p-8">
            <div>
              <MarketingBadge>Supported formats</MarketingBadge>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Built to fit the way different outlets actually work.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
                Pick a format to see how Servy adapts across service styles, order
                volumes, and multi-location operations.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {supportedFormats.map((format) => {
                  const isActive = format.label === activeFormat.label;
                  const FormatIcon = format.icon;

                  return (
                    <button
                      key={format.label}
                      type="button"
                      onClick={() => setActiveFormat(format)}
                      className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition ${
                        isActive
                          ? 'bg-[linear-gradient(135deg,#059669_0%,#0f766e_100%)] text-white shadow-[0_6px_16px_rgba(5,150,105,0.24)]'
                          : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <FormatIcon size={16} />
                      {format.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.97)_0%,rgba(15,118,110,0.95)_100%)] p-5 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)] sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFormat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[1.75rem] bg-[rgba(255,255,255,0.04)] p-5 sm:p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-emerald-200">
                        <ActiveIcon size={18} />
                      </span>
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
                        {activeFormat.tag}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-emerald-200">
                      Ready
                    </span>
                  </div>

                  <h3 className="mt-5 text-3xl font-semibold tracking-tight text-white">
                    {activeFormat.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-8 text-slate-300">
                    {activeFormat.summary}
                  </p>

                  <div className="mt-10 grid gap-8 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                        Best for
                      </p>
                      <div className="mt-4 space-y-3">
                        {activeFormat.bestFor.map((item) => (
                          <div key={item} className="flex items-start gap-3 text-sm text-white">
                            <span className="mt-2 h-2 w-2 rounded-full bg-emerald-400" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                        Platform fit
                      </p>
                      <div className="mt-4 space-y-3">
                        {activeFormat.platformFit.map((item) => (
                          <div key={item} className="flex items-start gap-3 text-sm text-white">
                            <span className="mt-2 h-2 w-2 rounded-full bg-emerald-400" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 rounded-[1.4rem] bg-white/8 p-5 text-sm leading-7 text-slate-200">
                    {activeFormat.note}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </MarketingContainer>
    </MarketingSection>
  );
}
