import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get('admin_token')?.value;

  // Extract restaurant slug from /restaurant/[slug] routes
  const restaurantSlugMatch = pathname.match(/^\/restaurant\/([^\/]+)/);
  
  if (restaurantSlugMatch) {
    const slug = restaurantSlugMatch[1];
    
    // Add restaurant slug to request headers for API calls
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-restaurant-slug', slug);
    
    // Clone the request URL and add slug as query param for internal use
    const url = request.nextUrl.clone();
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const isAdminPath = pathname.startsWith('/admin');
  const isAdminLogin = pathname === '/admin/login';
  if (isAdminPath && !isAdminLogin && !adminToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminLogin && adminToken) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = '/admin';
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/restaurant/:slug*',
    '/restaurant/:slug*/:path*',
    '/admin/:path*',
  ],
};
