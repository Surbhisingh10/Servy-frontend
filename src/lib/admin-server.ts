import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchBackend, getBackendBaseUrl } from './backend-fetch';

const API_URL = getBackendBaseUrl();

export function getAdminToken() {
  return cookies().get('admin_token')?.value;
}

export async function fetchAdmin<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAdminToken();
  if (!token) {
    redirect('/admin/login');
  }

  const response = await fetchBackend(`${API_URL}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401 || response.status === 403) {
    redirect('/admin/login');
  }

  if (!response.ok) {
    throw new Error(`Admin fetch failed (${response.status})`);
  }

  const json = await response.json();
  return json?.data ?? json;
}
