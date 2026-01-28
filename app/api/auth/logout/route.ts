import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('gym_session')?.value

    if (sessionToken) {
      // Revocar sesión en BD
      await supabaseAdmin
        .from('sessions')
        .update({ revoked_at: new Date().toISOString() })
        .eq('token_hash', sessionToken)
    }

    // Eliminar cookie
    cookieStore.delete('gym_session')

    return NextResponse.json(
      { success: true, message: 'Sesión cerrada' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en logout:', error)
    return NextResponse.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    )
  }
}
