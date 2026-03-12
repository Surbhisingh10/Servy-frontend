import { NextRequest } from 'next/server';
import { proxyAdminMutation } from '@/lib/admin-api-route';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return proxyAdminMutation(request, `/admin/plans/${params.id}`, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return proxyAdminMutation(request, `/admin/plans/${params.id}`, 'DELETE');
}
