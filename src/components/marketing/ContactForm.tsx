'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const RESTAURANT_TYPES = [
  'Fine Dining',
  'Cafe / QSR',
  'Bakery',
  'Brewery',
  'Multi-Location',
  'Other',
];

const OUTLET_OPTIONS = ['1 outlet', '2–5 outlets', '6–20 outlets', '20+ outlets'];

const ENQUIRY_TYPES = ['Book a Demo', 'General Enquiry', 'Pricing', 'Partnership'] as const;
type EnquiryType = (typeof ENQUIRY_TYPES)[number];

const INPUT_CLASS =
  'rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 w-full placeholder:text-slate-400';

const LABEL_CLASS =
  'block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 mb-1.5';

export default function ContactForm() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    restaurantName: '',
    city: '',
    restaurantType: RESTAURANT_TYPES[0],
    outletCount: OUTLET_OPTIONS[0],
    enquiryType: 'Book a Demo' as EnquiryType,
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
      if (!res.ok) throw new Error((data as { error?: string })?.error ?? 'Submission failed');
      toast.success('Message received. We will be in touch within one business day.');
      setForm({
        fullName: '',
        email: '',
        phone: '',
        restaurantName: '',
        city: '',
        restaurantType: RESTAURANT_TYPES[0],
        outletCount: OUTLET_OPTIONS[0],
        enquiryType: 'Book a Demo',
        message: '',
      });
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again or email us directly.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      {/* Enquiry type */}
      <div>
        <p className={LABEL_CLASS}>I&apos;m looking for</p>
        <div className="flex flex-wrap gap-2 pt-0.5">
          {ENQUIRY_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setForm((p) => ({ ...p, enquiryType: type }))}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                form.enquiryType === type
                  ? 'border-emerald-500 bg-emerald-600 text-white shadow-[0_6px_16px_rgba(5,150,105,0.22)]'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Text fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-fullName" className={LABEL_CLASS}>
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            id="cf-fullName"
            value={form.fullName}
            onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
            placeholder="Alice Smith"
            className={INPUT_CLASS}
            required
          />
        </div>

        <div>
          <label htmlFor="cf-email" className={LABEL_CLASS}>
            Work email <span aria-hidden="true">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="you@restaurant.com"
            className={INPUT_CLASS}
            required
          />
        </div>

        <div>
          <label htmlFor="cf-restaurantName" className={LABEL_CLASS}>
            Restaurant name <span aria-hidden="true">*</span>
          </label>
          <input
            id="cf-restaurantName"
            value={form.restaurantName}
            onChange={(e) => setForm((p) => ({ ...p, restaurantName: e.target.value }))}
            placeholder="The Grand Bistro"
            className={INPUT_CLASS}
            required
          />
        </div>

        <div>
          <label htmlFor="cf-city" className={LABEL_CLASS}>
            City <span aria-hidden="true">*</span>
          </label>
          <input
            id="cf-city"
            value={form.city}
            onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
            placeholder="Bengaluru"
            className={INPUT_CLASS}
            required
          />
        </div>

        <div>
          <label htmlFor="cf-phone" className={LABEL_CLASS}>
            Phone
          </label>
          <input
            id="cf-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            placeholder="+91 98765 43210"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="cf-restaurantType" className={LABEL_CLASS}>
            Restaurant type
          </label>
          <select
            id="cf-restaurantType"
            value={form.restaurantType}
            onChange={(e) => setForm((p) => ({ ...p, restaurantType: e.target.value }))}
            className={INPUT_CLASS}
          >
            {RESTAURANT_TYPES.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Outlet count as chips */}
        <div className="sm:col-span-2">
          <p className={LABEL_CLASS}>Number of outlets</p>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {OUTLET_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setForm((p) => ({ ...p, outletCount: opt }))}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  form.outletCount === opt
                    ? 'border-slate-800 bg-slate-900 text-white shadow-[0_4px_12px_rgba(15,23,42,0.18)]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="cf-message" className={LABEL_CLASS}>
            Message / notes
          </label>
          <textarea
            id="cf-message"
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            placeholder="Tell us your setup, what you'd like to see, or any questions you have"
            className={`${INPUT_CLASS} min-h-[110px] resize-none`}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(5,150,105,0.28)] transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Send Message'}
        {!submitting && <ArrowRight size={16} />}
      </button>
    </form>
  );
}
