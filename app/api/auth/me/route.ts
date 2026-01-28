import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Helper para hashear tokens usando Web Crypto API (compatible con Edge Runtime)
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('gym_session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Hashear el token antes de buscarlo
    const tokenHash = await hashToken(sessionToken)

    // Buscar sesión válida
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .select('profile_id, expires_at, revoked_at')
      .eq('token_hash', tokenHash)
      .maybeSingle()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Sesión no válida' },
        { status: 401 }
      )
    }

    // Verificar expiración
    if (session.revoked_at || new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Sesión expirada' },
        { status: 401 }
      )
    }

    // Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, dni, role, first_name, last_name, email, phone, deleted_at, created_at')
      .eq('id', session.profile_id)
      .maybeSingle()

    if (profileError || !profile || profile.deleted_at) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        user: {
          id: profile.id,
          dni: profile.dni,
          role: profile.role,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone: profile.phone,
          created_at: profile.created_at,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en /api/auth/me:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
