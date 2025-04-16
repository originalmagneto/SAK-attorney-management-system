import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/api/auth/login',
  '/api/auth/register'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all OPTIONS requests for CORS
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204 });
  }

  // Check if the requested path is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for auth token in cookies or Authorization header
  const token = request.cookies.get('auth_token')?.value ||
                request.headers.get('Authorization')?.split(' ')[1];

  // If there's no token and this isn't a public route, redirect to login
  if (!token) {
    if (request.headers.get('accept')?.includes('application/json')) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401, 
          headers: { 'content-type': 'application/json' }
        }
      );
    }

    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}