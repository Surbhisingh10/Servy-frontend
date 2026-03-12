import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function proxyAdminMutation(
  request: NextRequest,
  backendPath: string,
  method: 'POST' | 'PATCH' | 'DELETE',
) {
  const token = cookies().get('admin_token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const hasBody = method !== 'DELETE';
  const body = hasBody ? await request.json().catch(() => ({})) : undefined;

  const response = await fetch(`${API_URL}${backendPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  const json = await response.json().catch(() => null);
  return NextResponse.json(json || {}, { status: response.status });
}
