export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorMessages = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  INVALID_INPUT: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

export function getErrorMessage(error: any): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error?.response?.status === 401) {
    return ErrorMessages.UNAUTHORIZED;
  }

  if (error?.response?.status === 403) {
    return ErrorMessages.FORBIDDEN;
  }

  if (error?.response?.status === 404) {
    return ErrorMessages.NOT_FOUND;
  }

  if (error?.response?.status >= 500) {
    return ErrorMessages.SERVER_ERROR;
  }

  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return ErrorMessages.NETWORK_ERROR;
  }

  if (typeof error?.message === 'string') {
    return error.message;
  }

  return ErrorMessages.UNKNOWN_ERROR;
}

export function isNetworkError(error: any): boolean {
  return (
    error?.code === 'ECONNABORTED' ||
    error?.message?.includes('Network') ||
    error?.message?.includes('timeout')
  );
}

export function isAuthError(error: any): boolean {
  return error?.response?.status === 401 || error?.status === 401;
}

export function isValidationError(error: any): boolean {
  return error?.response?.status === 400 || error?.status === 400;
}
