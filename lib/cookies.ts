import { ResponseCookies } from 'next/dist/server/web/spec-extension/cookies';

export function setAuthCookie(cookies: ResponseCookies, token: string) {
  cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60, // 24 hours
  });
}

export function clearAuthCookie(cookies: ResponseCookies) {
  cookies.delete('token');
}