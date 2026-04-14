'use client';

import { useState } from 'react';
import { ArrowRight, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { demoFormOptions } from '@/lib/marketing-site-content';

const INPUT_CLASS =
  'rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 w-full';

const LABEL_CLASS = 'block text-sm font-semibold text-slate-700 mb-2';

const OUTLET_OPTIONS = ['1', '2–5', '6–20', '20+'];

export default function DemoForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    restaurantType: demoFormOptions[0],
    outletCount: OUTLET_OPTIONS[0],
    demoTopic: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.name,
          email: form.email,
          restaurantType: form.restaurantType,
          outletCount: form.outletCount,
          demoTopic: form.demoTopic,
          source: 'demo',
        }),
      });

      if (!res.ok) throw new Error('Submission failed');

      toast.success('Demo request received. We will reach out within one business day.');
      setForm({ name: '', email: '', restaurantType: demoFormOptions[0], outletCount: OUTLET_OPTIONS[0], demoTopic: '' });
    } catch {
      toast.error('Something went wrong. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-[2.25rem] border border-slate-200 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-2">
        <CreditCard size={18} className="text-emerald-700" />
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Request your walkthrough
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <div>
          <label htmlFor="demo-name" className={LABEL_CLASS}>
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="demo-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Your name"
            className={INPUT_CLASS}
            required
          />
        </div>

        <div>
          <label htmlFor="demo-email" className={LABEL_CLASS}>
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="demo-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="you@restaurant.com"
            className={INPUT_CLASS}
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="demo-restaurantType" className={LABEL_CLASS}>
              Restaurant type
            </label>
            <select
              id="demo-restaurantType"
              value={form.restaurantType}
              onChange={(e) => setForm((prev) => ({ ...prev, restaurantType: e.target.value }))}
              className={INPUT_CLASS}
            >
              {demoFormOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="demo-outletCount" className={LABEL_CLASS}>
              Number of outlets
            </label>
            <select
              id="demo-outletCount"
              value={form.outletCount}
              onChange={(e) => setForm((prev) => ({ ...prev, outletCount: e.target.value }))}
              className={INPUT_CLASS}
            >
              {OUTLET_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="demo-topic" className={LABEL_CLASS}>
            What do you want to see first?
          </label>
          <input
            id="demo-topic"
            type="text"
            value={form.demoTopic}
            onChange={(e) => setForm((prev) => ({ ...prev, demoTopic: e.target.value }))}
            placeholder="Billing, QR ordering, reconciliation, or multi-outlet setup"
            className={INPUT_CLASS}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(5,150,105,0.25)] transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Sending…' : 'Request Demo'}
          {!submitting && <ArrowRight size={16} />}
        </button>
      </form>
    </div>
  );
}
