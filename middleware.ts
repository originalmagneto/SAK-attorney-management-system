import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';
import { JWTPayload, UserRole } from '@/types/auth';
import { AppError, ErrorCode } from '@/types/errors';
import { createErrorResponse } from '@/lib/api-response';

// Define user roles and their hierarchy
const roleHierarchy: Record<UserRole, string[]> = {
  OWNER: ['OWNER', 'PARTNER', 'ASSOCIATE', 'STAFF'],
  PARTNER: ['PARTNER', 'ASSOCIATE', 'STAFF'],
  ASSOCIATE: ['ASSOCIATE', 'STAFF'],
  STAFF: ['STAFF']
};

// Verify JWT token and extract user information
function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = process.env.JWT_SECRET || 'development-secret';
    return verify(token, secret) as JWTPayload;
  } catch {
    return null;
  }
}

// Check if user has required role
function hasRequiredRole(userRole: UserRole, requiredRole: string): boolean {
  return roleHierarchy[userRole]?.includes(requiredRole.toUpperCase());
}

// Generate CORS headers
function corsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

export async function middleware(request: NextRequest) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin') || '*';
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders(origin),
    });
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register', '/api/auth/login', '/api/auth/register'];
  if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get token from Authorization header or cookie
  const token = request.headers.get('Authorization')?.split(' ')[1] || 
                request.cookies.get('auth_token')?.value;

  // If no token is present, redirect to login
  if (!token) {
    const isApiRoute = request.nextUrl.pathname.startsWith('/api/');
    if (isApiRoute) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Continue with the request
  return NextResponse.next();
}

// Configure which routes should be handled by the middleware
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

export const runtime = 'nodejs';