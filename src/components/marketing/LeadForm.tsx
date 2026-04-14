'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface LeadFormProps {
  title: string;
  description: string;
  buttonLabel: string;
}

const INPUT_CLASS =
  'rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 w-full';

const LABEL_CLASS = 'block text-xs font-semibold text-slate-600 mb-1';

export default function LeadForm({ title, description, buttonLabel }: LeadFormProps) {
  const [form, setForm] = useState({
    fullName: '',
    restaurantName: '',
    city: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'contact' }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Submission failed');

      toast.success('Your request has been recorded. We will contact you soon.');
      setForm({ fullName: '', restaurantName: '', city: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_48px_rgba(15,23,42,0.08)]">
      <div className="max-w-xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
          Request
        </p>
        <h2 className="text-3xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm leading-7 text-slate-600">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="lead-fullName" className={LABEL_CLASS}>
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            id="lead-fullName"
            value={form.fullName}
            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            placeholder="Alice Smith"
            className={INPUT_CLASS}
            required
          />
        </div>

        <div>
          <label htmlFor="lead-restaurantName" className={LABEL_CLASS}>
            Restaurant name <span aria-hidden="true">*</span>
          </label>
          <input
            id="lead-restaurantName"
            value={form.restaurantName}
            onChange={(e) => setForm((prev) => ({ ...prev, restaurantName: e.target.value }))}
            placeholder="The Grand Bistro"
            className={INPUT_CLASS}
            required
          />
        </div>

        <div>
          <label htmlFor="lead-city" className={LABEL_CLASS}>
            City <span aria-hidden="true">*</span>
          </label>
          <input
            id="lead-city"
            value={form.city}
            onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
            placeholder="Bengaluru"
            className={INPUT_CLASS}
            required
          />
        </div>

        <div>
          <label htmlFor="lead-email" className={LABEL_CLASS}>
            Work email <span aria-hidden="true">*</span>
          </label>
          <input
            id="lead-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="you@restaurant.com"
            className={INPUT_CLASS}
            required
          />
        </div>

        <div>
          <label htmlFor="lead-phone" className={LABEL_CLASS}>
            Phone number
          </label>
          <input
            id="lead-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="+91 98765 43210"
            className={INPUT_CLASS}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="lead-message" className={LABEL_CLASS}>
            Tell us about your setup
          </label>
          <textarea
            id="lead-message"
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            placeholder="Outlet count, order volume, or anything you want us to know"
            className={`${INPUT_CLASS} min-h-[140px] resize-none`}
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(5,150,105,0.26)] transition hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Sending…' : buttonLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
