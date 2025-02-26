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

  // Add CORS headers to all responses
  const response = NextResponse.next();
  const origin = request.headers.get('origin') || '*';
  Object.entries(corsHeaders(origin)).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Skip auth for public routes
  if (request.nextUrl.pathname.match(/^\/(_next|api\/auth|favicon.ico)/)) {
    return response;
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
  response.headers.set('x-user-id', payload.userId);
  response.headers.set('x-user-role', payload.role);
  if (payload.firmId) {
    response.headers.set('x-firm-id', payload.firmId);
  }

  return response;
}

// Configure which routes should be handled by the middleware
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

export const runtime = 'nodejs';