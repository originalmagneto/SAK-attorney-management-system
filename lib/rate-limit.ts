import { NextRequest } from 'next/server';
import { AppError, ErrorCode } from '@/types/errors';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const stores = new Map<string, Map<string, number[]>>();

export function rateLimit(config: RateLimitConfig) {
  return async function rateLimitMiddleware(request: NextRequest) {
    const ip = request.ip ?? 'anonymous';
    const path = request.nextUrl.pathname;
    const now = Date.now();

    if (!stores.has(path)) {
      stores.set(path, new Map());
    }
    const store = stores.get(path)!;

    const timestamps = store.get(ip) || [];
    const windowStart = now - config.windowMs;

    const validTimestamps = [...timestamps.filter((timestamp: number) => timestamp > windowStart), now];
    store.set(ip, validTimestamps);

    if (validTimestamps.length > config.maxRequests) {
      throw new AppError(
        ErrorCode.FORBIDDEN,
        'Too many requests. Please try again later.',
        { retryAfter: Math.ceil((config.windowMs - (now - validTimestamps[0])) / 1000) }
      );
    }

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      Array.from(stores.entries()).forEach(([storePath, pathStore]) => {
        Array.from(pathStore.entries()).forEach(([ipAddress, times]) => {
          const validTimes = times.filter((timestamp: number) => timestamp > windowStart);
          if (validTimes.length === 0) {
            pathStore.delete(ipAddress);
          } else {
            pathStore.set(ipAddress, validTimes);
          }
        });
        if (pathStore.size === 0) {
          stores.delete(storePath);
        }
      });
    }
  };
}