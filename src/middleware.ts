import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const intlMiddleware = createMiddleware(routing);

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_for_local_development_only_12345"
);

export default async function middleware(req: NextRequest) {
  // Check if it's a protected route (e.g. /dashboard or /hi/dashboard)
  const isProtectedRoute = req.nextUrl.pathname.includes('/dashboard');

  if (isProtectedRoute) {
    const token = req.cookies.get('auth_session')?.value;
    let isAuthenticated = false;

    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        isAuthenticated = true;
      } catch (error) {
        // Token invalid or expired
      }
    }

    if (!isAuthenticated) {
      // Redirect to login preserving the locale if possible, or default to /en/login
      const localeMatch = req.nextUrl.pathname.match(/^\/([a-z]{2})(\/|$)/);
      const locale = localeMatch ? localeMatch[1] : 'en';
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
