'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BookingConfirmationPage() {
  const router = useRouter();
  const params = useSearchParams();
  const restaurantId = params.get('restaurantId');

  const handleBackToHome = () => {
    const storedSlug = typeof window !== 'undefined' ? localStorage.getItem('restaurantSlug') : null;

    if (storedSlug) {
      router.push(`/restaurant/${storedSlug}`);
      return;
    }

    if (restaurantId) {
      router.push(`/book?restaurantId=${encodeURIComponent(restaurantId)}`);
      return;
    }

    router.push('/website');
  };

  return (
    <div className="min-h-screen bg-[#f5fbf8] px-4 py-10">
      <div className="mx-auto max-w-md space-y-4">

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-[2rem] border border-emerald-100 bg-[linear-gradient(135deg,#ecfdf5_0%,#d1fae5_100%)] p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-[0_8px_24px_rgba(5,150,105,0.35)]">
              <CheckCircle size={30} />
            </div>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-emerald-600">Confirmed</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Booking Confirmed!</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Your table has been reserved. We look forward to having you.
            </p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-400">What happens next</p>
            <div className="mt-4 space-y-4">
              {[
                { title: 'Confirmation message', desc: 'You will receive a confirmation on your registered phone number.' },
                { title: 'Arrive on time', desc: 'Please arrive within 15 minutes of your booking time.' },
                { title: 'Table ready', desc: 'Your table will be held and set up upon arrival.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle size={12} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Button onClick={handleBackToHome} className="w-full" size="lg">
            Back to Restaurant
          </Button>
        </motion.div>

      </div>
    </div>
  );
}
