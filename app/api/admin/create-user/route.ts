import { NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/auth-admin'
import { supabaseAdmin } from '@/lib/supabase-admin'
import * as bcrypt from 'bcryptjs'

interface CreateUserRequest {
  dni: string
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
}

/**
 * POST /api/admin/create-user
 * Crea un nuevo usuario con rol 'client' y PIN autogenerado
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
    const body: CreateUserRequest = await request.json()

    // 3. Validar DNI
    if (!body.dni || body.dni.trim() === '') {
      return NextResponse.json(
        { error: 'El DNI es obligatorio.' },
        { status: 400 }
      )
    }

    const dni = body.dni.trim().toUpperCase()

    // 4. Verificar que el DNI no exista
    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('dni', dni)
      .maybeSingle()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con ese DNI.' },
        { status: 409 }
      )
    }

    // 5. Generar PIN aleatorio de 6 dígitos
    const pin = Math.floor(100000 + Math.random() * 900000).toString()

    // 6. Hashear el PIN con bcrypt
    const saltRounds = 10
    const pinHash = await bcrypt.hash(pin, saltRounds)

    // 7. Insertar usuario en la BD
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('profiles')
      .insert({
        dni,
        first_name: body.first_name?.trim() || null,
        last_name: body.last_name?.trim() || null,
        email: body.email?.trim() || null,
        phone: body.phone?.trim() || null,
        pin_hash: pinHash,
        role: 'client',
        deleted_at: null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error insertando usuario:', insertError)
      return NextResponse.json(
        { error: 'Error al crear el usuario en la base de datos.' },
        { status: 500 }
      )
    }

    // 8. Retornar el usuario creado y el PIN (solo una vez)
    return NextResponse.json(
      {
        success: true,
        user: newUser,
        pin, // ⚠️ Solo se muestra una vez
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en create-user:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
