'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, Phone, CheckCircle, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

interface Booking {
  id: string;
  date: string;
  time: string;
  partySize: number;
  status: string;
  customerName?: string;
  customerPhone?: string;
  specialRequests?: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    phone: string;
  };
}

const STATUS_META: Record<string, { label: string; classes: string }> = {
  PENDING:   { label: 'Pending',   classes: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' },
  CONFIRMED: { label: 'Confirmed', classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' },
  SEATED:    { label: 'Seated',    classes: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300' },
  COMPLETED: { label: 'Completed', classes: 'bg-slate-100 text-slate-500 dark:bg-slate-500/15 dark:text-slate-400' },
  CANCELLED: { label: 'Cancelled', classes: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400' },
  NO_SHOW:   { label: 'No Show',   classes: 'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300' },
};

function shiftDate(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function BookingsPage() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    partySize: 2,
    customerName: '',
    customerPhone: '',
    specialRequests: '',
  });

  const fetchBookings = async (date: string) => {
    try {
      setLoading(true);
      const data = await api.getBookings(date);
      setBookings(data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(selectedDate);
  }, [selectedDate]);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await api.updateBooking?.(bookingId, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      toast.success('Booking updated');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Failed to update booking');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.date || !createForm.time) {
      toast.error('Date and time are required');
      return;
    }
    if (createForm.partySize < 1) {
      toast.error('Party size must be at least 1');
      return;
    }
    if (!user?.restaurantId) {
      toast.error('Restaurant context missing');
      return;
    }
    try {
      setCreating(true);
      await api.createBooking(user.restaurantId, {
        date: createForm.date,
        time: createForm.time,
        partySize: createForm.partySize,
        customerName: createForm.customerName.trim() || undefined,
        customerPhone: createForm.customerPhone.trim() || undefined,
        specialRequests: createForm.specialRequests.trim() || undefined,
      });
      toast.success('Booking created');
      setIsCreateOpen(false);
      setCreateForm({
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        partySize: 2,
        customerName: '',
        customerPhone: '',
        specialRequests: '',
      });
      if (createForm.date === selectedDate) {
        fetchBookings(selectedDate);
      } else {
        setSelectedDate(createForm.date);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Failed to create booking');
    } finally {
      setCreating(false);
    }
  };

  const displayed = showCompleted
    ? bookings
    : bookings.filter((b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');

  const dateLabel = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const counts = {
    total: bookings.length,
    active: bookings.filter((b) => !['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(b.status)).length,
  };

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[24px] bg-emerald-50/80 px-6 py-5 ring-1 ring-emerald-200/60 dark:bg-[#0d1f17] dark:ring-0"
        style={{ boxShadow: '0 8px 40px rgba(16,185,129,0.07)' }}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/[0.12] blur-3xl dark:bg-emerald-500/[0.07]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-emerald-600 dark:text-emerald-400">Reservations</p>
            <h1 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">Bookings</h1>
            <p className="mt-0.5 text-xs text-slate-500">
              {counts.active} active · {counts.total} total for this date
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCompleted((v) => !v)}
              className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${showCompleted ? 'border-slate-300 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-300' : 'border-slate-200 bg-white text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-slate-400'}`}
            >
              {showCompleted ? 'Hide completed' : 'Show completed'}
            </button>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus size={15} className="mr-1.5" />
              New Booking
            </Button>
          </div>
        </div>

        {/* Date navigation */}
        <div className="relative mt-4 flex items-center gap-3">
          <button
            onClick={() => setSelectedDate(shiftDate(selectedDate, -1))}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/10"
          >
            <ChevronLeft size={15} />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15 [color-scheme:light] dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-slate-300 dark:[color-scheme:dark]"
          />
          <span className="text-sm text-slate-500 dark:text-slate-400">{dateLabel}</span>
          <button
            onClick={() => setSelectedDate(shiftDate(selectedDate, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/10"
          >
            <ChevronRight size={15} />
          </button>
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="ml-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
          >
            Today
          </button>
        </div>
      </motion.div>

      {/* ── Booking cards ── */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-emerald-500/30 border-t-emerald-400" />
        </div>
      ) : displayed.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {displayed.map((booking, i) => {
              const meta = STATUS_META[booking.status] ?? STATUS_META['PENDING'];
              const guestName = booking.customer
                ? `${booking.customer.firstName || ''} ${booking.customer.lastName || ''}`.trim() || booking.customer.phone
                : booking.customerName || booking.customerPhone || 'Guest';

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.04 }}
                  className="overflow-hidden rounded-[20px] border border-slate-200/70 bg-white dark:border-white/[0.07] dark:bg-[#0d1f17]"
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
                >
                  <div className="flex items-start justify-between gap-3 px-5 pt-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/15">
                        <Calendar size={16} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {new Date(booking.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock size={11} /> {booking.time}
                        </p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${meta.classes}`}>
                      {meta.label}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 px-5 pb-1">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <Users size={13} />
                      <span>{booking.partySize} guest{booking.partySize !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <Phone size={13} />
                      <span>{guestName}</span>
                    </div>
                    {booking.specialRequests && (
                      <p className="text-xs italic text-slate-500 dark:text-slate-500">
                        &ldquo;{booking.specialRequests}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex gap-2 border-t border-slate-100 px-5 py-3 dark:border-white/[0.06]">
                    {booking.status === 'PENDING' && (
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-100 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/30"
                      >
                        <CheckCircle size={13} /> Confirm
                      </button>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'SEATED')}
                        className="flex-1 rounded-xl bg-sky-100 py-2 text-xs font-bold text-sky-700 transition hover:bg-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:hover:bg-sky-500/30"
                      >
                        Mark Seated
                      </button>
                    )}
                    {booking.status === 'SEATED' && (
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                        className="flex-1 rounded-xl bg-slate-100 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-500/20 dark:text-slate-300 dark:hover:bg-slate-500/30"
                      >
                        Complete
                      </button>
                    )}
                    {!['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(booking.status) && (
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                        className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-rose-500 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                      >
                        <X size={13} /> Cancel
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-slate-200 bg-white py-16 dark:border-white/[0.07] dark:bg-[#0d1f17]">
          <Calendar size={32} className="mb-3 text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-500">No bookings for this date</p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 flex items-center gap-1.5 rounded-xl bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25"
          >
            <Plus size={13} /> Add first booking
          </button>
        </div>
      )}

      {/* ── Create Booking Modal ── */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="New Booking" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Date</label>
              <input
                type="date"
                required
                value={createForm.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15 [color-scheme:light] dark:border-white/10 dark:bg-white/5 dark:text-white dark:[color-scheme:dark]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Time</label>
              <input
                type="time"
                required
                value={createForm.time}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, time: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15 [color-scheme:light] dark:border-white/10 dark:bg-white/5 dark:text-white dark:[color-scheme:dark]"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Party size</label>
            <input
              type="number"
              min={1}
              max={20}
              required
              value={createForm.partySize}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, partySize: parseInt(e.target.value, 10) || 1 }))}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
          <Input
            label="Customer Name"
            placeholder="Optional"
            value={createForm.customerName}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, customerName: e.target.value }))}
          />
          <Input
            label="Customer Phone"
            placeholder="Optional"
            value={createForm.customerPhone}
            onChange={(e) => setCreateForm((prev) => ({ ...prev, customerPhone: e.target.value }))}
          />
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">Special Requests</label>
            <textarea
              rows={2}
              placeholder="Allergies, celebrations, seating preferences…"
              value={createForm.specialRequests}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, specialRequests: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-600"
            />
          </div>
          <Button type="submit" className="w-full" isLoading={creating}>
            Create Booking
          </Button>
        </form>
      </Modal>
    </div>
  );
}
