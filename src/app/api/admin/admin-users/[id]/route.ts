import { NextRequest } from 'next/server';
import { proxyAdminMutation } from '@/lib/admin-api-route';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return proxyAdminMutation(request, `/admin/admin-users/${params.id}`, 'DELETE');
}
