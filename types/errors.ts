export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: Record<string, any>;
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function createApiError(error: Error | AppError | unknown): ApiError {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details
    };
  }

  if (error instanceof Error) {
    return {
      code: ErrorCode.INTERNAL_ERROR,
      message: error.message
    };
  }

  return {
    code: ErrorCode.INTERNAL_ERROR,
    message: 'An unexpected error occurred'
  };
}