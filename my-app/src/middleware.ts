import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Redirect to onboarding if session exists but user_metadata indicates onboarding is not complete
  if (
    session && 
    !session.user.user_metadata.hasCompletedOnboarding && 
    !req.nextUrl.pathname.startsWith('/protected/onboarding')
  ) {
    return NextResponse.redirect(new URL('/protected/onboarding', req.url))
  }

  // Redirect to login if no session
  if (!session && req.nextUrl.pathname !== '/auth/login') {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*']
}