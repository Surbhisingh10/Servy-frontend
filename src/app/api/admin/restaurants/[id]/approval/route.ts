import { NextRequest } from 'next/server';
import { proxyAdminMutation } from '@/lib/admin-api-route';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return proxyAdminMutation(request, `/admin/restaurants/${params.id}/approval`, 'PATCH');
}

