// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  
  // This is a simple check - you might want a more robust solution
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  
  // If it's not a mobile device and not already on the restricted page
  if (!isMobile && !request.nextUrl.pathname.startsWith('/desktop-blocked')) {
    return NextResponse.redirect(new URL('/desktop-blocked', request.url))
  }
  
  return NextResponse.next()
}

// Specify which paths should be checked by the middleware
export const config = {
  matcher: [
    // Add paths you want to protect from desktop access
    '/',
    '/home/:path*',
  ],
}