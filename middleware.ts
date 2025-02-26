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

export async function middleware(request: NextRequest) {
  // Skip auth for public routes
  if (request.nextUrl.pathname.match(/^\/(_next|api\/auth|favicon.ico)/)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  if (!token) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return createErrorResponse(
        new AppError(ErrorCode.UNAUTHORIZED, 'Authentication required')
      );
    }
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return createErrorResponse(
        new AppError(ErrorCode.UNAUTHORIZED, 'Invalid token')
      );
    }
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Role-based access control for specific routes
  const roleProtectedRoutes = [
    {
      path: '/api/firms',
      methods: ['POST'],
      role: 'OWNER'
    },
    {
      path: '/api/firms/:firmId/invite',
      methods: ['POST'],
      role: 'PARTNER'
    },
    {
      path: '/api/users/:userId/rate',
      methods: ['PATCH'],
      role: 'PARTNER'
    }
  ];

  // Check role-based permissions
  const matchedRoute = roleProtectedRoutes.find(route => {
    const pathRegex = new RegExp('^' + route.path.replace(/:[^/]+/g, '[^/]+') + '$');
    return pathRegex.test(request.nextUrl.pathname) && 
           route.methods.includes(request.method);
  });

  if (matchedRoute && !hasRequiredRole(payload.role, matchedRoute.role)) {
    return createErrorResponse(
      new AppError(ErrorCode.FORBIDDEN, 'Insufficient permissions')
    );
  }

  // Add user information to request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-role', payload.role);
  if (payload.firmId) {
    requestHeaders.set('x-firm-id', payload.firmId);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Configure which routes should be handled by the middleware
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};