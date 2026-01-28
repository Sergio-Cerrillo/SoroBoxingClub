import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth-admin'
import { supabaseAdmin } from '@/lib/supabase-admin'
import * as bcrypt from 'bcryptjs'
import crypto from 'crypto'

/**
 * POST /api/admin/reset-pin
 * Restablece el PIN de un usuario y retorna el nuevo PIN generado
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

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es obligatorio' },
        { status: 400 }
      )
    }

    // 2. Verificar que el usuario existe y no esté eliminado
    const { data: user, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id, dni, deleted_at')
      .eq('id', userId)
      .maybeSingle()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    if (user.deleted_at) {
      return NextResponse.json(
        { error: 'No se puede restablecer PIN de un usuario eliminado' },
        { status: 400 }
      )
    }

    // 3. Generar nuevo PIN aleatorio de 4 dígitos
    const newPin = Math.floor(1000 + Math.random() * 9000).toString()

    // 4. Hashear el nuevo PIN
    const pinHash = await bcrypt.hash(newPin, 10)

    // 5. Actualizar en la BD
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ pin_hash: pinHash })
      .eq('id', userId)

    if (updateError) {
      console.error('Error actualizando PIN:', updateError)
      return NextResponse.json(
        { error: 'Error al actualizar el PIN' },
        { status: 500 }
      )
    }

    // 6. Revocar todas las sesiones del usuario
    await supabaseAdmin
      .from('sessions')
      .update({ revoked_at: new Date().toISOString() })
      .eq('profile_id', userId)
      .is('revoked_at', null)

    console.log(`✅ PIN restablecido para usuario ${user.dni}`)

    return NextResponse.json(
      {
        success: true,
        newPin, // Se retorna para que el admin lo comunique al usuario
        message: 'PIN restablecido exitosamente. Todas las sesiones del usuario han sido revocadas.'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en POST /api/admin/reset-pin:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
