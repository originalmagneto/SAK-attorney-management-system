import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { sign } from 'jsonwebtoken';
import { store } from '@/lib/store';
import { JWTPayload, LoginResponse } from '@/types/auth';
import { AppError, ErrorCode } from '@/types/errors';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { rateLimit } from '@/lib/rate-limit';
import { setAuthCookie } from '@/lib/cookies';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Rate limit: 5 attempts per minute
const rateLimiter = rateLimit({
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    await rateLimiter(request);
    
    const body = await request.json();
    const validatedData = loginSchema.parse(body);
    
    const user = store.getUserByEmail(validatedData.email);
    
    if (!user) {
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        'Invalid credentials'
      );
    }

    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      user.passwordHash
    );
    
    if (!isValidPassword) {
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        'Invalid credentials'
      );
    }

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      firmId: user.firmId,
    };

    const token = sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        firmId: user.firmId
      }
    });

    // Set the auth cookie
    setAuthCookie(response.cookies, token);

    return response;
  } catch (error) {
    return createErrorResponse(error);
  }
}