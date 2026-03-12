'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function LeadForm({
  title,
  description,
  buttonLabel,
}: {
  title: string;
  description: string;
  buttonLabel: string;
}) {
  const [form, setForm] = useState({
    fullName: '',
    restaurantName: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast.success('Your request has been recorded. We will contact you soon.');
    setForm({
      fullName: '',
      restaurantName: '',
      email: '',
      phone: '',
      message: '',
    });
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_48px_rgba(15,23,42,0.08)]">
      <div className="max-w-xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-600">
          Request
        </p>
        <h2 className="text-3xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm leading-7 text-slate-600">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
        <input
          value={form.fullName}
          onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
          placeholder="Full name"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          required
        />
        <input
          value={form.restaurantName}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, restaurantName: event.target.value }))
          }
          placeholder="Restaurant name"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          required
        />
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          placeholder="Work email"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          required
        />
        <input
          value={form.phone}
          onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          placeholder="Phone number"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
        <textarea
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          placeholder="Tell us about your outlet count, order volume, or goals"
          className="min-h-[160px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 md:col-span-2"
        />
        <button
          type="submit"
          className="rounded-full bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(4,57,39,0.22)] transition hover:bg-primary-600 md:col-span-2 md:w-fit"
        >
          {buttonLabel}
        </button>
      </form>
    </div>
  );
}
