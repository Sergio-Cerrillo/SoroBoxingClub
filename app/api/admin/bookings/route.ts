import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase-admin"

/**
 * GET /api/admin/bookings
 * Obtiene el total de reservas activas
 */
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar sesión y que sea manager
    const { data: session } = await supabaseAdmin
      .from('user_sessions')
      .select('user_id, profiles!inner(role)')
      .eq('session_token_hash', sessionToken)
      .gte('expires_at', new Date().toISOString())
      .single()

    if (!session || session.profiles?.role !== 'manager') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Obtener total de reservas activas (no canceladas)
    const { data: bookings, error } = await supabaseAdmin
      .from('class_bookings')
      .select('id', { count: 'exact', head: true })
      .is('cancelled_at', null)

    if (error) {
      console.error('Error obteniendo reservas:', error)
      return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 })
    }

    return NextResponse.json({ 
      total: bookings || 0,
      success: true 
    })
  } catch (error) {
    console.error('Error en GET /api/admin/bookings:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
