import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: Replace with actual authentication logic
    // This is a temporary mock implementation
    if (email && password) {
      // Generate a mock token - in production, use proper JWT signing
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
      
      return NextResponse.json({
        token,
        user: {
          email,
          name: email.split('@')[0], // Mock user name
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
