'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import MarketingBadge from './MarketingBadge';
import MarketingContainer from './MarketingContainer';
import MarketingSection from './MarketingSection';
import Reveal from './Reveal';
import {
  integrationGroups,
  type IntegrationGroup,
  type IntegrationLogo,
} from '@/lib/marketing-site-content';

const tabStyles = {
  active: 'bg-[linear-gradient(135deg,#0f766e_0%,#0f172a_100%)] text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)]',
  idle: 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900',
} as const;

function LogoTile({ item, index }: { item: IntegrationLogo; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.03 }}
      className="group flex h-full min-h-[156px] flex-col rounded-[1.45rem] bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_32px_rgba(15,23,42,0.06)]"
    >
      <div className="relative my-auto flex min-h-[72px] items-center justify-center py-3">
        <Image
          src={item.src}
          alt={item.alt}
          width={220}
          height={72}
          className="max-h-12 w-auto object-contain transition duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <p className="text-sm leading-6 text-slate-600">{item.note}</p>
    </motion.article>
  );
}

function IntegrationGrid({ group }: { group: IntegrationGroup }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={group.key}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.24 }}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700">
              {group.label}
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
              {group.title}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{group.description}</p>
          </div>
        </div>

        <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {group.logos.map((item, index) => (
            <LogoTile key={item.name} item={item} index={index} />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function IntegrationsSection() {
  const [selectedGroup, setSelectedGroup] = useState<IntegrationGroup['key']>('payments');
  const activeGroup =
    integrationGroups.find((group) => group.key === selectedGroup) ?? integrationGroups[0];

  return (
    <MarketingSection tone="muted" className="pt-8 lg:pt-12">
      <MarketingContainer>
        <Reveal>
          <div className="rounded-[2.25rem] border border-emerald-900/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(247,251,248,0.98)_100%)] px-6 py-7 shadow-[0_18px_50px_rgba(15,23,42,0.05)] ring-1 ring-emerald-900/8 lg:px-8 lg:py-8">
            <div className="flex flex-col gap-8">
              <div className="max-w-2xl">
                <MarketingBadge>Integrations</MarketingBadge>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Connect the tools your restaurant already uses.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                  Switch between payment tools and other platform integrations to see the right
                  logos and details in a cleaner, more focused layout.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {integrationGroups.map((group) => {
                const isActive = group.key === selectedGroup;

                return (
                  <button
                    key={group.key}
                    type="button"
                    onClick={() => setSelectedGroup(group.key)}
                    className={`rounded-full px-5 py-3 text-sm font-semibold transition ${tabStyles[isActive ? 'active' : 'idle']}`}
                  >
                    {group.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8">
              <IntegrationGrid group={activeGroup} />
            </div>
          </div>
        </Reveal>
      </MarketingContainer>
    </MarketingSection>
  );
}
