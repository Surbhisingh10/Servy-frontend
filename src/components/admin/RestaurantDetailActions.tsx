'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import AdminModal from '@/components/admin/AdminModal';
import { Plan } from '@/lib/admin-types';
import RestaurantEditModal from './RestaurantEditModal';

export default function RestaurantDetailActions({
  restaurantId,
  plans,
  onboardingState,
  initialValues,
}: {
  restaurantId: string;
  plans: Plan[];
  onboardingState?: 'PENDING' | 'APPROVED' | 'REJECTED';
  initialValues: {
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    zipCode?: string | null;
  };
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [planId, setPlanId] = useState(plans[0]?.id || '');

  const assignPlan = async () => {
    await fetch(`/api/admin/restaurants/${restaurantId}/assign-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId }),
    });
    setIsOpen(false);
    router.refresh();
  };

  const setStatus = async (status: 'TRIAL' | 'EXPIRED') => {
    await fetch(`/api/admin/restaurants/${restaurantId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  };

  const reviewOnboarding = async (action: 'APPROVE' | 'REJECT') => {
    let reason = '';
    if (action === 'REJECT') {
      reason = window.prompt('Provide rejection reason (required):')?.trim() || '';
      if (!reason) {
        alert('Rejection reason is required.');
        return;
      }
    }
    await fetch(`/api/admin/restaurants/${restaurantId}/approval`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason: reason || undefined }),
    });
    router.refresh();
  };

  const removeRestaurant = async () => {
    const confirmed = window.confirm(
      'Delete this restaurant permanently? This will remove the restaurant and all restaurant-owned data from the platform.',
    );
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/admin/restaurants/${restaurantId}`, { method: 'DELETE' });
    if (!response.ok) {
      const json = await response.json().catch(() => null);
      window.alert(json?.message || 'Failed to delete restaurant');
      return;
    }
    router.push('/admin/restaurants');
    router.refresh();
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <RestaurantEditModal restaurantId={restaurantId} initialValues={initialValues} />
        {onboardingState !== 'APPROVED' && (
          <>
            <Button size="sm" onClick={() => reviewOnboarding('APPROVE')}>
              Approve onboarding
            </Button>
            <Button size="sm" variant="outline" onClick={() => reviewOnboarding('REJECT')}>
              Reject onboarding
            </Button>
          </>
        )}
        <Button size="sm" onClick={() => setIsOpen(true)}>
          Upgrade / downgrade plan
        </Button>
        <Button size="sm" variant="outline" onClick={() => setStatus('TRIAL')}>
          Reset trial
        </Button>
        <Button size="sm" variant="outline" onClick={() => setStatus('EXPIRED')}>
          Cancel subscription
        </Button>
        <Button size="sm" variant="outline" onClick={removeRestaurant}>
          Delete restaurant
        </Button>
      </div>

      <AdminModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Assign Plan">
        <div className="space-y-3">
          <select value={planId} onChange={(e) => setPlanId(e.target.value)} className="input">
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} - ${Number(plan.price).toFixed(2)} / {plan.billingCycle.toLowerCase()}
              </option>
            ))}
          </select>
          <Button onClick={assignPlan}>Assign Plan</Button>
        </div>
      </AdminModal>
    </>
  );
}
