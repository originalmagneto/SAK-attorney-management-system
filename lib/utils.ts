import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ErrorCode } from "@/types/errors";
import { toast } from "sonner";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleApiError(error: any) {
  const defaultMessage = 'An unexpected error occurred';
  
  if (!error) {
    toast.error(defaultMessage);
    return;
  }

  // Handle network errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    toast.error('Network error. Please check your connection.');
    return;
  }

  // Handle API errors
  if (error.error?.code) {
    const message = error.error.message || getErrorMessage(error.error.code);
    toast.error(message);
    return;
  }

  toast.error(error.message || defaultMessage);
}

function getErrorMessage(code: ErrorCode): string {
  const messages: Record<ErrorCode, string> = {
    UNAUTHORIZED: 'Please log in to continue',
    FORBIDDEN: 'You do not have permission to perform this action',
    NOT_FOUND: 'The requested resource was not found',
    VALIDATION_ERROR: 'Please check your input and try again',
    CONFLICT: 'A conflict occurred with the requested operation',
    INTERNAL_ERROR: 'An internal server error occurred'
  };

  return messages[code] || 'An unexpected error occurred';
}
