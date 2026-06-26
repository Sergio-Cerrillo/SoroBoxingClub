import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { verifyAdminSession } from "@/lib/auth-admin"

/**
 * GET /api/admin/bookings
 * Obtiene el total de reservas activas
 */
export async function GET(request: Request) {
  try {
    const adminSession = await verifyAdminSession()
    if (!adminSession) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener total de reservas activas (no canceladas)
    const { count, error } = await supabaseAdmin
      .from('class_bookings')
      .select('id', { count: 'exact', head: true })
      .is('cancelled_at', null)

    if (error) {
      console.error('Error obteniendo reservas:', error)
      return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 })
    }

    return NextResponse.json({ 
      total: count || 0,
      success: true 
    })
  } catch (error) {
    console.error('Error en GET /api/admin/bookings:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
