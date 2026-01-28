import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Helper para hashear tokens usando Web Crypto API (compatible con Edge Runtime)
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('gym_session')?.value
  
  console.log('🔒 Middleware:', { 
    path: request.nextUrl.pathname, 
    hasToken: !!sessionToken,
    tokenPreview: sessionToken?.substring(0, 10) + '...'
  })

  // Rutas públicas (no requieren autenticación)
  const publicPaths = ['/login', '/']
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Verificar sesión para rutas protegidas
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const tokenHash = await hashToken(sessionToken)

  const { data: session } = await supabaseAdmin
    .from('sessions')
    .select('profile_id, expires_at, revoked_at')
    .eq('token_hash', tokenHash)
    .maybeSingle()

  if (
    !session ||
    session.revoked_at ||
    new Date(session.expires_at) < new Date()
  ) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('gym_session')
    return response
  }

  // Verificar rol para rutas admin
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/gestion')) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role, deleted_at')
      .eq('id', session.profile_id)
      .maybeSingle()

    if (!profile || profile.deleted_at || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/clases', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|$).*)',
  ],
}
