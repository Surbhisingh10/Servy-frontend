'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { faqItems } from '@/lib/marketing-site-content';
import Reveal from './Reveal';

type FaqItem = (typeof faqItems)[number];

const half = Math.ceil(faqItems.length / 2);
const leftItems = faqItems.slice(0, half);
const rightItems = faqItems.slice(half);

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  function renderItem(item: FaqItem, index: number) {
    const isOpen = openIndex === index;

    return (
      <Reveal key={item.question} delay={index * 0.04}>
        <div
          className={`overflow-hidden rounded-2xl bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)] ring-1 transition-all duration-200 ${
            isOpen
              ? 'ring-emerald-300 shadow-[0_14px_36px_rgba(16,185,129,0.10)]'
              : 'ring-slate-200/70 hover:ring-slate-300'
          }`}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(isOpen ? null : index)}
            aria-expanded={isOpen}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <h3 className="text-base font-semibold text-slate-900">{item.question}</h3>
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                isOpen
                  ? 'rotate-45 bg-emerald-50 text-emerald-700'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Plus size={15} />
            </span>
          </button>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={reduceMotion ? {} : { height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <p className="border-t border-slate-100 px-5 py-4 text-sm leading-7 text-slate-600">
                  {item.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
      <div className="grid gap-3">
        {leftItems.map((item, i) => renderItem(item, i))}
      </div>
      <div className="grid gap-3">
        {rightItems.map((item, i) => renderItem(item, half + i))}
      </div>
    </div>
  );
}
