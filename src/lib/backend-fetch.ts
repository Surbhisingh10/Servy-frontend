const DEFAULT_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';

export class BackendUnavailableError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'BackendUnavailableError';
  }
}

function isConnectionFailure(error: unknown) {
  const candidate = error as { message?: string; cause?: { code?: string } } | null;
  return (
    candidate?.message === 'fetch failed' ||
    candidate?.cause?.code === 'ECONNREFUSED' ||
    candidate?.cause?.code === 'ENOTFOUND' ||
    candidate?.cause?.code === 'EAI_AGAIN'
  );
}

export function getBackendBaseUrl() {
  return DEFAULT_BACKEND_URL;
}

export async function fetchBackend(input: string, init?: RequestInit) {
  try {
    return await fetch(input, init);
  } catch (error) {
    if (isConnectionFailure(error)) {
      throw new BackendUnavailableError(`Backend API is unavailable at ${DEFAULT_BACKEND_URL}`, error);
    }
    throw error;
  }
}

