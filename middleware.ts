import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

// Define user roles and their hierarchy
const roleHierarchy = {
  owner: ['owner', 'partner', 'associate', 'staff'],
  partner: ['partner', 'associate', 'staff'],
  associate: ['associate', 'staff'],
  staff: ['staff']
};

// Verify JWT token and extract user information
function verifyToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET || 'development-secret';
    return verify(token, secret) as {
      userId: string;
      email: string;
      role: string;
      firmId: string;
    };
  } catch {
    return null;
  }
}

// Check if user has required role
function hasRequiredRole(userRole: string, requiredRole: string) {
  return roleHierarchy[userRole as keyof typeof roleHierarchy]?.includes(requiredRole);
}

export async function middleware(request: NextRequest) {
  // Skip authentication in development mode
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  // Get token from authorization header or cookie
  const token = request.headers.get('authorization')?.split(' ')[1] || 
                request.cookies.get('token')?.value;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/login',
    '/register',
    '/_next',
    '/favicon.ico'
  ];

  // Check if route is public
  if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // No token provided - redirect to login for non-API routes
  if (!token) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based access control for specific routes
  const roleProtectedRoutes = [
    {
      path: '/api/firms',
      methods: ['POST'],
      role: 'owner'
    },
    {
      path: '/api/firms/:firmId/invite',
      methods: ['POST'],
      role: 'partner'
    },
    {
      path: '/api/users/:userId/rate',
      methods: ['PATCH'],
      role: 'partner'
    }
  ];

  // Check role-based permissions
  const matchedRoute = roleProtectedRoutes.find(route => {
    const pathRegex = new RegExp('^' + route.path.replace(/:[^/]+/g, '[^/]+') + '$');
    return pathRegex.test(request.nextUrl.pathname) && 
           route.methods.includes(request.method);
  });

  if (matchedRoute && !hasRequiredRole(payload.role, matchedRoute.role)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  // Add user information to request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-role', payload.role);
  requestHeaders.set('x-firm-id', payload.firmId);

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