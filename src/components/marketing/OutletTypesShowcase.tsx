'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { supportedOutletTypes } from '@/lib/marketing-content';

const panelVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function OutletTypesShowcase() {
  const reduceMotion = useReducedMotion();
  const [selectedType, setSelectedType] = useState(supportedOutletTypes[0]);
  const MotionDiv = reduceMotion ? 'div' : motion.div;

  return (
    <MotionDiv
      className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_18px_44px_rgba(15,23,42,0.05)] lg:grid-cols-[0.95fr_1.05fr] lg:p-10"
      {...(!reduceMotion ? { variants: panelVariants, initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.25 } } : {})}
    >
      <div className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-emerald-700">
          Supported Formats
        </p>
        <h3 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-900">
          Built to fit the way different outlets actually work.
        </h3>
        <p className="max-w-2xl text-base leading-8 text-slate-600">
          Pick a format to see how Servy adapts across service styles, order volumes,
          and multi-location operations.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {supportedOutletTypes.map((outletType) => {
            const isActive = outletType.name === selectedType.name;
            return (
              <button
                key={outletType.name}
                type="button"
                onClick={() => setSelectedType(outletType)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)]'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {outletType.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[1.8rem] border border-emerald-100 bg-[linear-gradient(180deg,#eef5f1_0%,#ffffff_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
        <div className="rounded-[1.5rem] bg-slate-900 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] overflow-hidden">
          {selectedType.image && (
            <div className="relative h-44 w-full">
              <Image
                src={selectedType.image}
                alt={selectedType.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80" />
            </div>
          )}
          <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">
                {selectedType.tag}
              </p>
              <h4 className="mt-3 text-2xl font-semibold">{selectedType.name}</h4>
            </div>
            <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              Ready
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-300">{selectedType.shortDescription}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/8 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">Best For</p>
              <ul className="mt-3 space-y-2 text-sm text-white">
                {selectedType.useCases.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white/8 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">Platform Fit</p>
              <ul className="mt-3 space-y-2 text-sm text-white">
                {selectedType.features.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white/10 px-4 py-3 text-sm leading-7 text-slate-200">
            If your outlet type is not listed, choose <span className="font-semibold text-white">Other formats</span>.
            We can still tailor the flow to your operation.
          </div>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
}
