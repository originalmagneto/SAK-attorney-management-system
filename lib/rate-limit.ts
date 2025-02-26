import { NextRequest } from 'next/server';
import { AppError, ErrorCode } from '@/types/errors';

interface RateLimitConfig {
  maxRequests: number;  // Maximum requests per window
  windowMs: number;     // Time window in milliseconds
}

const stores = new Map<string, Map<string, number[]>>();

export function rateLimit(config: RateLimitConfig) {
  return async function rateLimitMiddleware(req: NextRequest) {
    const ip = req.ip || 'anonymous';
    const path = req.nextUrl.pathname;
    const now = Date.now();

    // Initialize store for this path if it doesn't exist
    if (!stores.has(path)) {
      stores.set(path, new Map());
    }
    const store = stores.get(path)!;

    // Initialize or get timestamps for this IP
    const timestamps = store.get(ip) || [];
    const windowStart = now - config.windowMs;

    // Filter out old timestamps and add the new one
    const validTimestamps = [...timestamps.filter(ts => ts > windowStart), now];
    store.set(ip, validTimestamps);

    // Check if rate limit is exceeded
    if (validTimestamps.length > config.maxRequests) {
      throw new AppError(
        ErrorCode.FORBIDDEN,
        'Too many requests. Please try again later.',
        { retryAfter: Math.ceil((config.windowMs - (now - validTimestamps[0])) / 1000) }
      );
    }

    // Clean up old entries periodically
    if (Math.random() < 0.01) { // 1% chance to run cleanup
      for (const [path, pathStore] of stores.entries()) {
        for (const [ip, timestamps] of pathStore.entries()) {
          const validTimestamps = timestamps.filter(ts => ts > windowStart);
          if (validTimestamps.length === 0) {
            pathStore.delete(ip);
          } else {
            pathStore.set(ip, validTimestamps);
          }
        }
        if (pathStore.size === 0) {
          stores.delete(path);
        }
      }
    }
  };
}