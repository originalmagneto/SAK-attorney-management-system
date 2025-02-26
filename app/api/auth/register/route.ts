import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { store } from '@/lib/store';
import { sign } from 'jsonwebtoken';

// Validation schema for registration
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = registerSchema.parse(body);
    
    // Check if user already exists
    const existingUser = store.getUserByEmail(validatedData.email);
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user and store in memory
    const newUser = {
      id: `user_${Date.now()}`,
      email: validatedData.email,
      name: validatedData.name,
      passwordHash: hashedPassword,
      role: 'STAFF', // Default role
      createdAt: new Date(),
      updatedAt: new Date()
    };

    store.addUser(newUser);

    // Generate JWT token
    const token = sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        firmId: newUser.firmId
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}