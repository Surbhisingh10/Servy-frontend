'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ArrowLeft, Calendar, Clock, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

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
    defaultValues: {
      partySize: 2,
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    if (!restaurantId) {
      toast.error('Restaurant ID is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        date: data.date,
        time: data.time,
        partySize: data.partySize,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        specialRequests: data.specialRequests,
      };

      await api.createBooking(restaurantId, bookingData);

      toast.success('Booking confirmed!');
      router.push('/booking-confirmation');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get max date (30 days from now)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Make a Booking</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Date & Time */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Date & Time
            </h2>

            <Input
              label="Date"
              type="date"
              min={minDate}
              max={maxDateStr}
              {...register('date')}
              error={errors.date?.message}
            />

            <Input
              label="Time"
              type="time"
              {...register('time')}
              error={errors.time?.message}
            />
          </div>

          {/* Party Size */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={20} />
              Party Size
            </h2>
            <Input
              label="Number of Guests"
              type="number"
              min={1}
              max={20}
              {...register('partySize', { valueAsNumber: true })}
              error={errors.partySize?.message}
            />
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>

            <Input
              label="Name *"
              placeholder="John Doe"
              {...register('customerName')}
              error={errors.customerName?.message}
            />

            <Input
              label="Phone Number *"
              type="tel"
              placeholder="+1 (555) 123-4567"
              {...register('customerPhone')}
              error={errors.customerPhone?.message}
            />
          </div>

          {/* Special Requests */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Special Requests</h2>
            <textarea
              {...register('specialRequests')}
              placeholder="Any special requests? (e.g., window seat, birthday celebration)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Confirming Booking...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
