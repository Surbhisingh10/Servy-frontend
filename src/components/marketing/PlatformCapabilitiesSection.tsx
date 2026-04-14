'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import MarketingBadge from './MarketingBadge';
import MarketingContainer from './MarketingContainer';
import MarketingSection from './MarketingSection';
import Reveal from './Reveal';
import { platformCapabilities } from '@/lib/marketing-content';

const cardStyles = {
  active:
    'border-emerald-900/20 bg-[linear-gradient(135deg,#0f172a_0%,#0f766e_100%)] text-white shadow-[0_18px_34px_rgba(15,23,42,0.18)]',
  idle:
    'border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_28px_rgba(15,23,42,0.06)]',
} as const;

export default function PlatformCapabilitiesSection() {
  const [activeCapability, setActiveCapability] = useState(platformCapabilities[0]);
  const ActiveIcon = activeCapability.icon;

  return (
    <MarketingSection tone="muted" className="pt-0">
      <MarketingContainer>
        <Reveal>
          <div className="rounded-[2.25rem] bg-white px-6 py-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)] ring-1 ring-slate-200/70 lg:px-8 lg:py-8">
            <div className="max-w-2xl">
              <MarketingBadge>Platform features</MarketingBadge>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                All the tools restaurants actually use, in one calm platform.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Pick a feature card to see how Servy handles dashboard control, order
                status, inventory, campaigns, multi-outlet management, and more.
              </p>
            </div>

            <div className="mt-8 grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {platformCapabilities.map((capability, index) => {
                const CapabilityIcon = capability.icon;
                const isActive = capability.label === activeCapability.label;

                return (
                  <motion.button
                    key={capability.label}
                    type="button"
                    onClick={() => setActiveCapability(capability)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: index * 0.03 }}
                    className={`group flex h-full flex-col rounded-[1.5rem] border p-5 text-left transition ${cardStyles[isActive ? 'active' : 'idle']}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                          isActive
                            ? 'bg-white/10 text-white'
                            : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100'
                        }`}
                      >
                        <CapabilityIcon size={20} />
                      </div>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-[0.26em] ${
                          isActive ? 'text-emerald-200' : 'text-slate-400'
                        }`}
                      >
                        {capability.tag}
                      </span>
                    </div>

                    <h3
                      className={`mt-4 text-lg font-semibold tracking-tight ${
                        isActive ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {capability.label}
                    </h3>
                    <p
                      className={`mt-2 text-sm leading-6 ${
                        isActive ? 'text-slate-200' : 'text-slate-600'
                      }`}
                    >
                      {capability.summary}
                    </p>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[1.75rem] bg-[linear-gradient(135deg,#0f172a_0%,#111827_60%,#0f766e_100%)] px-5 py-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)] sm:px-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCapability.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24 }}
                  className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-emerald-200">
                      <ActiveIcon size={20} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
                        {activeCapability.tag}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                        {activeCapability.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        {activeCapability.note}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {activeCapability.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="rounded-2xl bg-white/10 px-4 py-4 text-sm leading-7 text-slate-200"
                      >
                        {bullet}
                      </div>
                    ))}
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
