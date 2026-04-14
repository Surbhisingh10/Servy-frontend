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

  const floorZones = [
    { label: 'Main Hall', x: 18, y: 20, w: 28, h: 30, intensity: 0.9 },
    { label: 'Patio', x: 52, y: 18, w: 30, h: 24, intensity: 0.55 },
    { label: 'Bar', x: 18, y: 56, w: 22, h: 22, intensity: 0.75 },
    { label: 'Private', x: 44, y: 50, w: 38, h: 28, intensity: 0.35 },
  ] as const;

  const qrItems = [
    { name: 'Masala Fries', qty: '2x', note: 'No onion' },
    { name: 'Paneer Bowl', qty: '1x', note: 'Add extra spice' },
    { name: 'Cold Coffee', qty: '2x', note: 'Less sugar' },
  ] as const;

  const aggregatorOrders = [
    { source: 'Swiggy', status: 'In kitchen', table: 'A-12', total: 'Rs 1,240', accent: 'from-emerald-500 to-emerald-400' },
    { source: 'Zomato', status: 'Accepted', table: 'Takeaway', total: 'Rs 860', accent: 'from-rose-500 to-orange-400' },
    { source: 'Dineout', status: 'Pending', table: 'Table 07', total: 'Rs 1,980', accent: 'from-sky-500 to-indigo-400' },
  ] as const;

  return (
    <MotionDiv
      className="relative mx-auto w-full max-w-3xl"
      {...(!reduceMotion ? { variants: containerVariants, initial: 'hidden', animate: 'visible' } : {})}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -10, 0], opacity: [0.55, 0.8, 0.55] }}
        transition={reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-emerald-200/50 blur-3xl"
      />
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, 12, 0], opacity: [0.45, 0.75, 0.45] }}
        transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-8 bottom-10 h-32 w-32 rounded-full bg-emerald-300/40 blur-3xl"
      />

      <motion.div
        variants={reduceMotion ? undefined : childVariants}
        className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-[0_30px_80px_rgba(15,23,42,0.10)]"
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(16,185,129,0.12),transparent)]" />
        <div className="relative rounded-[1.65rem] border border-slate-100 bg-[linear-gradient(180deg,#fbfdfb_0%,#ffffff_100%)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-700">Live dashboard</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">Revenue and order flow</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                18 Active
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                +18% today
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ['Today Revenue', 'Rs 48.2K'],
              ['Repeat Guests', '42%'],
              ['Avg Prep', '14 min'],
            ].map(([label, value], index) => (
              <motion.div
                key={label}
                variants={reduceMotion ? undefined : childVariants}
                transition={reduceMotion ? undefined : { delay: 0.12 + index * 0.06 }}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.08fr_0.9fr_0.92fr]">
            <motion.div
              variants={reduceMotion ? undefined : childVariants}
              className="rounded-[1.45rem] border border-slate-100 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Floor heatmap</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Table flow</p>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  24 tables
                </div>
              </div>

              <div className="mt-4 rounded-[1.3rem] border border-slate-100 bg-[linear-gradient(180deg,rgba(236,253,245,0.7)_0%,rgba(255,255,255,0.98)_100%)] p-3">
                <svg viewBox="0 0 520 240" className="h-[180px] w-full" role="img" aria-label="Restaurant floor heatmap">
                  <defs>
                    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="18" result="blur" />
                      <feColorMatrix
                        in="blur"
                        type="matrix"
                        values="1 0 0 0 0.05 0 1 0 0 0.67 0 0 1 0 0.48 0 0 0 0.5 0"
                      />
                    </filter>
                  </defs>
                  <g opacity="0.55" stroke="#dbe4ef" strokeWidth="1">
                    {[36, 76, 116, 156, 196].map((y) => (
                      <line key={y} x1="20" x2="500" y1={y} y2={y} />
                    ))}
                    {[96, 176, 256, 336, 416].map((x) => (
                      <line key={x} x1={x} x2={x} y1="18" y2="220" />
                    ))}
                  </g>
                  <rect x="18" y="18" width="484" height="188" rx="22" fill="#ffffff" stroke="#e5edf5" />
                  {floorZones.map((zone, index) => (
                    <circle
                      key={zone.label}
                      cx={zone.x * 5.2 + zone.w * 2.45}
                      cy={zone.y * 1.85 + zone.h * 2.4}
                      r={zone.intensity * 24}
                      fill={index === 0 ? '#10b981' : index === 1 ? '#34d399' : index === 2 ? '#0ea5e9' : '#a78bfa'}
                      fillOpacity={0.18}
                      filter="url(#glow)"
                    />
                  ))}
                  {floorZones.map((zone) => (
                    <g key={`${zone.label}-card`}>
                      <rect
                        x={zone.x * 5 + 16}
                        y={zone.y * 1.9 + 12}
                        width={zone.w * 4.6}
                        height={zone.h * 3.2}
                        rx="14"
                        fill={zone.intensity > 0.7 ? '#dcfce7' : zone.intensity > 0.5 ? '#ecfdf5' : '#f8fafc'}
                        stroke={zone.intensity > 0.7 ? '#10b981' : '#dbe4ef'}
                        strokeWidth="1.2"
                      />
                      <text
                        x={zone.x * 5 + 30}
                        y={zone.y * 1.9 + 31}
                        fill="#0f172a"
                        fontSize="14"
                        fontWeight="600"
                      >
                        {zone.label}
                      </text>
                      <text
                        x={zone.x * 5 + 30}
                        y={zone.y * 1.9 + 48}
                        fill="#64748b"
                        fontSize="11"
                      >
                        {zone.intensity > 0.8 ? 'Busy' : zone.intensity > 0.5 ? 'Moderate' : 'Light'}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </motion.div>

            <motion.div
              variants={reduceMotion ? undefined : childVariants}
              className="rounded-[1.45rem] border border-slate-100 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">QR order panel</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Table 14</p>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  3 items
                </div>
              </div>

              <div className="mt-4 rounded-[1.25rem] border border-slate-100 bg-[linear-gradient(180deg,#f8fffb_0%,#ffffff_100%)] p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-white p-3">
                    <div className="grid grid-cols-4 gap-0.5">
                      {Array.from({ length: 16 }).map((_, index) => (
                        <span
                          key={index}
                          className={`block h-2 w-2 rounded-[2px] ${index % 3 === 0 || index % 4 === 0 ? 'bg-slate-900' : 'bg-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.22em] text-emerald-700">Direct QR</p>
                    <h4 className="mt-1 text-lg font-semibold text-slate-900">Guest ordered from the table</h4>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Ready for kitchen confirmation, payment, and e-bill generation.
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  {qrItems.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.note}</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {item.qty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={reduceMotion ? undefined : childVariants}
              className="rounded-[1.45rem] border border-slate-100 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Aggregator stream</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Swiggy / Zomato</p>
                </div>
                <div className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                  3 live
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                {aggregatorOrders.map((order) => (
                  <div
                    key={order.source}
                    className="rounded-[1.25rem] border border-slate-100 bg-slate-50 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${order.accent}`} />
                        <div>
                          <p className="font-semibold text-slate-900">{order.source}</p>
                          <p className="text-xs text-slate-500">{order.table}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{order.total}</p>
                        <p className="text-xs text-slate-500">{order.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </MotionDiv>
  );
}
