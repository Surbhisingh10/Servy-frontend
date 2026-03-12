/**
 * Centralized error handling for frontend
 */

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: any,
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static fromResponse(response: any): ApiError {
    const { statusCode, message, code, error } = response.data || {};
    return new ApiError(
      statusCode || response.status || 500,
      message || error || 'An unexpected error occurred',
      code,
      response.data,
    );
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    return ApiError.fromResponse(error.response);
  }

  if (error instanceof ApiError) {
    return error;
  }

  return new ApiError(500, error.message || 'Network error occurred');
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};
