import { NextRequest, NextResponse } from 'next/server';
import { BackendUnavailableError, fetchBackend, getBackendBaseUrl } from '@/lib/backend-fetch';

const API_URL = getBackendBaseUrl();

export async function POST(request: NextRequest) {
  const body = await request.json();

  let response;
  try {
    response = await fetchBackend(`${API_URL}/auth/login`, {
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
  const authData = json?.data ?? json;

  if (!response.ok || !authData?.access_token) {
    return NextResponse.json(
      { message: json?.message || 'Invalid credentials' },
      { status: response.status || 401 },
    );
  }

  return NextResponse.json({
    success: true,
    data: authData,
  });
}
