'use client';

import { motion, useReducedMotion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroPreview() {
  const reduceMotion = useReducedMotion();
  const MotionDiv = reduceMotion ? 'div' : motion.div;

  return (
    <MotionDiv
      className="relative mx-auto w-full max-w-3xl"
      {...(!reduceMotion ? { variants: containerVariants, initial: 'hidden', animate: 'visible' } : {})}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -10, 0], opacity: [0.55, 0.8, 0.55] }}
        transition={reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-primary-200/50 blur-3xl"
      />
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, 12, 0], opacity: [0.45, 0.75, 0.45] }}
        transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-8 bottom-10 h-32 w-32 rounded-full bg-primary-300/40 blur-3xl"
      />

      <motion.div
        variants={reduceMotion ? undefined : childVariants}
        className="relative rounded-[2rem] border border-primary-100 bg-white p-4 shadow-[0_30px_80px_rgba(15,23,42,0.10)]"
      >
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            variants={reduceMotion ? undefined : childVariants}
            className="rounded-[1.6rem] border border-slate-100 bg-slate-50 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-primary-600">Live Dashboard</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Unified Orders</h3>
              </div>
              <div className="rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold text-white">
                18 Active
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ['Today Revenue', 'Rs 48.2K'],
                ['Repeat Guests', '42%'],
                ['Avg Prep', '14 min'],
              ].map(([label, value], index) => (
                <motion.div
                  key={label}
                  variants={reduceMotion ? undefined : childVariants}
                  transition={reduceMotion ? undefined : { delay: 0.12 + index * 0.06 }}
                  className="rounded-2xl bg-white p-4 shadow-sm"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={reduceMotion ? undefined : childVariants}
              className="mt-4 rounded-[1.4rem] bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">Channel Mix</p>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Realtime</p>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  ['Direct QR', '58%', '58%'],
                  ['Swiggy', '19%', '19%'],
                  ['Zomato', '14%', '14%'],
                  ['Takeaway', '9%', '9%'],
                ].map(([label, value, width], index) => (
                  <motion.div
                    key={label}
                    variants={reduceMotion ? undefined : childVariants}
                    transition={reduceMotion ? undefined : { delay: 0.16 + index * 0.05 }}
                  >
                    <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <motion.div
                        className="h-2 rounded-full bg-primary-500"
                        initial={reduceMotion ? undefined : { width: 0 }}
                        animate={reduceMotion ? undefined : { width }}
                        transition={reduceMotion ? undefined : { duration: 0.8, delay: 0.25 + index * 0.08 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <div className="space-y-4">
            <motion.div
              variants={reduceMotion ? undefined : childVariants}
              className="rounded-[1.6rem] border border-primary-100 bg-primary-50 p-5"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-primary-700">Customer CRM</p>
              <div className="mt-4 space-y-3">
                {[
                  ['VIP List', '126 guests'],
                  ['Inactive 30+ Days', '48 guests'],
                  ['Brunch Club', '83 guests'],
                ].map(([label, value], index) => (
                  <motion.div
                    key={label}
                    variants={reduceMotion ? undefined : childVariants}
                    transition={reduceMotion ? undefined : { delay: 0.18 + index * 0.05 }}
                    className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"
                  >
                    <span className="font-medium text-slate-900">{label}</span>
                    <span className="text-sm text-slate-500">{value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={reduceMotion ? undefined : childVariants}
              className="rounded-[1.6rem] border border-slate-100 bg-slate-900 p-5 text-white"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-primary-300">Automations</p>
              <h4 className="mt-3 text-xl font-semibold">Campaign queued</h4>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                &ldquo;VIP Preview Dinner&rdquo; scheduled to 126 guests with WhatsApp delivery
                tracking.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Open Rate</p>
                  <p className="mt-2 text-2xl font-semibold">92%</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Conversions</p>
                  <p className="mt-2 text-2xl font-semibold">31</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </MotionDiv>
  );
}
