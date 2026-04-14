'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const bookingSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  partySize: z.number().min(1, 'Party size must be at least 1').max(20),
  customerName: z.string().min(1, 'Name is required'),
  customerPhone: z.string().min(10, 'Phone number is required'),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurantId');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { partySize: 2 },
  });

  const onSubmit = async (data: BookingFormData) => {
    if (!restaurantId) {
      toast.error('Restaurant ID is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createBooking(restaurantId, {
        date: data.date,
        time: data.time,
        partySize: data.partySize,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        specialRequests: data.specialRequests,
      });
      toast.success('Booking confirmed!');
      router.push(`/booking-confirmation?restaurantId=${encodeURIComponent(restaurantId)}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#f5fbf8] px-4 py-6">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4">

        <div className="flex items-center gap-3 pb-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-emerald-400 hover:text-emerald-700"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-emerald-600">Table Reservation</p>
            <h1 className="text-xl font-semibold text-slate-900">Book a Table</h1>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-400">Date & time</p>
          <div className="space-y-4">
            <Input label="Date" type="date" min={minDate} max={maxDateStr} {...register('date')} error={errors.date?.message} />
            <Input label="Preferred time" type="time" {...register('time')} error={errors.time?.message} />
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-400">Party size</p>
          <Input
            label="Number of guests"
            type="number"
            min={1}
            max={20}
            {...register('partySize', { valueAsNumber: true })}
            error={errors.partySize?.message}
          />
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-400">Contact details</p>
          <div className="space-y-4">
            <Input label="Your name" placeholder="e.g. Priya Sharma" {...register('customerName')} error={errors.customerName?.message} />
            <Input label="Phone number" type="tel" placeholder="+91 98765 43210" {...register('customerPhone')} error={errors.customerPhone?.message} />
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-400">Special requests</p>
          <textarea
            {...register('specialRequests')}
            placeholder="Window seat, birthday celebration, high chair..."
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
            rows={4}
          />
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          Confirm Booking
        </Button>
      </form>
    </div>
  );
}
