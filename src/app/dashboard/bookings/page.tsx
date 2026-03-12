'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Phone, CheckCircle, X } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

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

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await api.getBookings(selectedDate);
        setBookings(data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [selectedDate]);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await api.updateBooking?.(bookingId, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      toast.success('Booking status updated');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update booking');
    }
  };

  const filteredBookings = bookings.filter(
    (booking) => booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED'
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="mt-2 text-gray-600">Manage table reservations</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookings.map((booking) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-primary-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {new Date(booking.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock size={14} />
                    {booking.time}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  booking.status === 'CONFIRMED'
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'SEATED'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {booking.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} />
                <span>{booking.partySize} guests</span>
              </div>

              {(booking.customer || booking.customerName) && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={16} />
                  <span>
                    {booking.customer
                      ? `${booking.customer.firstName || ''} ${booking.customer.lastName || ''}`.trim() ||
                        booking.customer.phone
                      : booking.customerName || booking.customerPhone}
                  </span>
                </div>
              )}

              {booking.specialRequests && (
                <p className="text-sm text-gray-600 italic">{booking.specialRequests}</p>
              )}
            </div>

            <div className="flex gap-2">
              {booking.status === 'PENDING' && (
                <button
                  onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                  className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                >
                  <CheckCircle size={16} />
                  Confirm
                </button>
              )}
              {booking.status === 'CONFIRMED' && (
                <button
                  onClick={() => handleStatusUpdate(booking.id, 'SEATED')}
                  className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mark Seated
                </button>
              )}
              <button
                onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No bookings for this date</p>
        </div>
      )}
    </div>
  );
}
