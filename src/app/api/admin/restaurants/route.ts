import { NextRequest } from 'next/server';
import { proxyAdminMutation } from '@/lib/admin-api-route';

export async function POST(request: NextRequest) {
  return proxyAdminMutation(request, '/admin/restaurants', 'POST');
}
