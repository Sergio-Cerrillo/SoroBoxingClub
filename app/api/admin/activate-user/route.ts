import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth-admin'
import { supabaseAdmin } from '@/lib/supabase-admin'

interface ActivateUserRequest {
  userId: string
}

/**
 * POST /api/admin/activate-user
 * Reactiva un usuario (limpia deleted_at)
 */
export async function POST(request: Request) {
  try {
    // 1. Verificar que sea admin
    const adminSession = await verifyAdminSession()
    if (!adminSession) {
      return NextResponse.json(
        { error: 'No autorizado. Se requiere rol de administrador.' },
        { status: 401 }
      )
    }

    // 2. Parsear body
    const body: ActivateUserRequest = await request.json()

    if (!body.userId || body.userId.trim() === '') {
      return NextResponse.json(
        { error: 'El ID del usuario es obligatorio.' },
        { status: 400 }
      )
    }

    // 3. Verificar que el usuario existe y está borrado
    const { data: user, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id, deleted_at')
      .eq('id', body.userId)
      .maybeSingle()

    if (userError) {
      console.error('Error verificando usuario:', userError)
      return NextResponse.json(
        { error: 'Error al verificar el usuario.' },
        { status: 500 }
      )
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado.' },
        { status: 404 }
      )
    }

    if (!user.deleted_at) {
      return NextResponse.json(
        { error: 'El usuario ya está activo.' },
        { status: 400 }
      )
    }

    // 4. Reactivar usuario (limpiar deleted_at)
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ deleted_at: null })
      .eq('id', body.userId)

    if (updateError) {
      console.error('Error al reactivar usuario:', updateError)
      return NextResponse.json(
        { error: 'Error al reactivar el usuario.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Usuario reactivado correctamente.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en activate-user:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
