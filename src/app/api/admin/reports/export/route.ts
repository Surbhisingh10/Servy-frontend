import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { BackendUnavailableError, fetchBackend, getBackendBaseUrl } from '@/lib/backend-fetch';

const API_URL = getBackendBaseUrl();

export async function GET(request: NextRequest) {
  const token = cookies().get('admin_token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const type = request.nextUrl.searchParams.get('type') || 'revenue';
  let response;
  try {
    response = await fetchBackend(`${API_URL}/admin/export/${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  const text = await response.text();
  return new NextResponse(text, {
    status: response.status,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${type}-report.csv"`,
    },
  });
}
