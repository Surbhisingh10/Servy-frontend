import { NextRequest, NextResponse } from 'next/server';
import { BackendUnavailableError, fetchBackend, getBackendBaseUrl } from '@/lib/backend-fetch';

const API_URL = getBackendBaseUrl();

export async function POST(request: NextRequest) {
  const body = await request.json();
  let response;
  try {
    response = await fetchBackend(`${API_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof BackendUnavailableError) {
      return NextResponse.json(
        { message: 'Backend API is unavailable. Start the server on port 3001 and try again.' },
        { status: 503 },
      );
    }
    throw error;
  }

  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.data?.access_token) {
    return NextResponse.json(
      { message: json?.message || 'Invalid credentials' },
      { status: response.status || 401 },
    );
  }

  const next = NextResponse.json({ success: true, user: json.data.user });
  next.cookies.set('admin_token', json.data.access_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return next;
}
