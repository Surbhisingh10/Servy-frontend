import { fetchAdmin } from '@/lib/admin-server';
import { Plan } from '@/lib/admin-types';
import PlanManager from '@/components/admin/PlanManager';

export default async function PlansPage() {
  const plans = await fetchAdmin<Plan[]>('/admin/plans');
  return <PlanManager plans={plans} />;
}
