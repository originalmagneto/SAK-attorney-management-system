import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { z } from 'zod';
import { sign } from 'jsonwebtoken';
import { store } from '@/lib/store';
import { JWTPayload } from '@/types/auth';
import { AppError, ErrorCode } from '@/types/errors';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';
import { setAuthCookie } from '@/lib/cookies';

// Define module config for Next.js
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Define validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Login attempt:', { email: body.email });
    
    const validatedData = loginSchema.parse(body);
    console.log('Data validation passed');

    // For testing/development, always allow admin login
    if (validatedData.email === 'admin@sak.com' && validatedData.password === 'Admin123!') {
      const adminUser = {
        id: 'admin',
        email: 'admin@sak.com',
        name: 'System Admin',
        role: 'OWNER' as const,
      };

      const payload: JWTPayload = {
        userId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      };

      const secret = process.env.JWT_SECRET || 'development-secret';
      const token = sign(payload, secret, { expiresIn: '24h' });

      const response = new NextResponse(
        JSON.stringify({
          token,
          user: adminUser
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setAuthCookie(response.cookies, token);
      return response;
    }

    // Fall through to error if not admin
    throw new AppError(
      ErrorCode.UNAUTHORIZED,
      'Invalid credentials'
    );
  } catch (error) {
    console.error('Login error:', error);
    return new NextResponse(
      JSON.stringify({
        error: {
          code: error instanceof AppError ? error.code : ErrorCode.INTERNAL_ERROR,
          message: error instanceof AppError ? error.message : 'An unexpected error occurred'
        }
      }),
      {
        status: error instanceof AppError ? 401 : 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}