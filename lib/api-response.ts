import { NextResponse } from 'next/server';
import { AppError, createApiError, ErrorCode } from '@/types/errors';
import { ZodError } from 'zod';

export function createSuccessResponse<T>(data: T, status: number = 200) {
  return NextResponse.json({ data }, { status });
}

export function createErrorResponse(error: unknown, status: number = 500) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: createApiError(new AppError(ErrorCode.VALIDATION_ERROR, 'Validation failed', error.errors)) },
      { status: 400 }
    );
  }

  if (error instanceof AppError) {
    const statusMap: Record<ErrorCode, number> = {
      [ErrorCode.UNAUTHORIZED]: 401,
      [ErrorCode.FORBIDDEN]: 403,
      [ErrorCode.NOT_FOUND]: 404,
      [ErrorCode.VALIDATION_ERROR]: 400,
      [ErrorCode.CONFLICT]: 409,
      [ErrorCode.INTERNAL_ERROR]: 500,
    };
    return NextResponse.json(
      { error: createApiError(error) },
      { status: statusMap[error.code] || status }
    );
  }

  return NextResponse.json(
    { error: createApiError(error) },
    { status }
  );
}