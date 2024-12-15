import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token'); // Replace with your authentication mechanism

  if (!token && req.nextUrl.pathname === '/dashboard') {
    // Redirect unauthenticated users to the login page
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Specify the routes to apply middleware
export const config = {
  matcher: ['/dashboard'], // Protect the /dashboard route
};
