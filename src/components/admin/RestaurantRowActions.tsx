'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { RestaurantListItem } from '@/lib/admin-types';

export default function RestaurantRowActions({ restaurant }: { restaurant: RestaurantListItem }) {
  const router = useRouter();
  const onboardingState = restaurant.onboardingState || 'APPROVED';

  const toggleStatus = async () => {
    const nextStatus = restaurant.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    await fetch(`/api/admin/restaurants/${restaurant.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    router.refresh();
  };

  const impersonate = async () => {
    await fetch(`/api/admin/restaurants/${restaurant.id}/impersonate`, { method: 'POST' });
    alert('Impersonation context prepared');
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

    await fetch(`/api/admin/restaurants/${restaurant.id}/approval`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason: reason || undefined }),
    });
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={() => router.push(`/admin/restaurants/${restaurant.id}`)}>
        View
      </Button>
      {onboardingState !== 'APPROVED' && (
        <>
          <Button size="sm" onClick={() => reviewOnboarding('APPROVE')}>
            Approve
          </Button>
          <Button size="sm" variant="outline" onClick={() => reviewOnboarding('REJECT')}>
            Reject
          </Button>
        </>
      )}
      <Button size="sm" variant="outline" onClick={toggleStatus}>
        {restaurant.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
      </Button>
      <Button size="sm" variant="outline" onClick={impersonate}>
        Impersonate
      </Button>
    </div>
  );
}
