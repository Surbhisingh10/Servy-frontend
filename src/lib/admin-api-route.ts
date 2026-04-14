import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { BackendUnavailableError, fetchBackend, getBackendBaseUrl } from './backend-fetch';

const API_URL = getBackendBaseUrl();

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

  let response;
  try {
    response = await fetchBackend(`${API_URL}${backendPath}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: hasBody ? JSON.stringify(body) : undefined,
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
  return NextResponse.json(json || {}, { status: response.status });
}
