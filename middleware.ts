import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token'); // Replace with your authentication mechanism

  // List of protected routes
  const protectedRoutes = ['/dashboard', '/users', '/chartdetails'];

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Redirect unauthenticated users to the login page if accessing a protected route
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Specify the routes to apply middleware
export const config = {
  matcher: ['/dashboard', '/users', '/chartdetails/:path*'], // Protect all dynamic routes under /chartdetails
};
