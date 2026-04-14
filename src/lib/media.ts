const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function getBackendOrigin() {
  try {
    return new URL(API_URL).origin;
  } catch {
    return 'http://localhost:3001';
  }
}

export function resolveMediaUrl(src?: string | null): string | null {
  if (!src) return null;

  const trimmed = src.trim();
  if (!trimmed) return null;

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  const backendOrigin = getBackendOrigin();

  if (trimmed.startsWith('/')) {
    return `${backendOrigin}${trimmed}`;
  }

  return `${backendOrigin}/${trimmed}`;
}
