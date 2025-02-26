import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { store } from '@/lib/store';
import { sign } from 'jsonwebtoken';
import { JWTPayload, RegisterResponse, UserRole } from '@/types/auth';
import { AppError, ErrorCode } from '@/types/errors';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);
    
    const existingUser = store.getUserByEmail(validatedData.email);
    
    if (existingUser) {
      throw new AppError(
        ErrorCode.CONFLICT,
        'User with this email already exists'
      );
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const defaultRole: UserRole = 'STAFF';

    const newUser = {
      id: `user_${Date.now()}`,
      email: validatedData.email,
      name: validatedData.name,
      passwordHash: hashedPassword,
      role: defaultRole,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    store.addUser(newUser);

    const payload: JWTPayload = {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      firmId: newUser.firmId
    };

    const token = sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const response: RegisterResponse = {
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        firmId: newUser.firmId
      }
    };

    return createSuccessResponse(response, 201);
  } catch (error) {
    return createErrorResponse(error);
  }
}