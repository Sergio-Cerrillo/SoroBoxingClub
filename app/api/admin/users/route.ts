import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth-admin'
import { supabaseAdmin } from '@/lib/supabase-admin'
import * as bcrypt from 'bcryptjs'

/**
 * GET /api/admin/users
 * Lista todos los usuarios activos (donde deleted_at IS NULL)
 */
export async function GET() {
  try {
    // 1. Verificar que sea admin
    const adminSession = await verifyAdminSession()
    if (!adminSession) {
      return NextResponse.json(
        { error: 'No autorizado. Se requiere rol de administrador.' },
        { status: 401 }
      )
    }

    // 2. Obtener usuarios activos
    const { data: users, error } = await supabaseAdmin
      .from('profiles')
      .select('id, dni, first_name, last_name, email, phone, role, created_at')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error obteniendo usuarios:', error)
      return NextResponse.json(
        { error: 'Error al obtener los usuarios.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ users }, { status: 200 })
  } catch (error) {
    console.error('Error en GET /api/admin/users:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/users
 * Crea un nuevo usuario con PIN generado automáticamente
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
    const { dni, first_name, last_name, email, phone } = body

    // 2. Validar campos obligatorios
    if (!dni || !first_name || !last_name) {
      return NextResponse.json(
        { error: 'DNI, nombre y apellido son obligatorios' },
        { status: 400 }
      )
    }

    // 3. Verificar que el DNI no exista ya
    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('dni', dni)
      .maybeSingle()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este DNI' },
        { status: 400 }
      )
    }

    // 4. Generar PIN aleatorio de 4 dígitos
    const newPin = Math.floor(1000 + Math.random() * 9000).toString()
    const pinHash = await bcrypt.hash(newPin, 10)

    // 5. Crear el usuario
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('profiles')
      .insert({
        dni,
        first_name,
        last_name,
        email: email || null,
        phone: phone || null,
        pin_hash: pinHash,
        role: 'client',
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creando usuario:', createError)
      return NextResponse.json(
        { error: 'Error al crear el usuario' },
        { status: 500 }
      )
    }

    console.log(`✅ Usuario creado: ${dni} con PIN: ${newPin}`)

    return NextResponse.json(
      {
        success: true,
        user: newUser,
        pin: newPin,
        message: 'Usuario creado exitosamente'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en POST /api/admin/users:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
