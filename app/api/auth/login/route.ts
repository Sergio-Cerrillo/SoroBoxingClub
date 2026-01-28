import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import * as bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

// Helper para hashear tokens usando Web Crypto API (compatible con Edge Runtime)
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

interface LoginRequest {
  dni: string
  pin: string
}

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json()

    // 1. Validar campos
    if (!body.dni || !body.pin) {
      return NextResponse.json(
        { error: 'DNI y PIN son obligatorios' },
        { status: 400 }
      )
    }

    const dni = body.dni.trim().toUpperCase()
    const pin = body.pin.trim()

    console.log('🔐 Login attempt:', { dni, pinLength: pin.length })

    // ACCESO ESPECIAL: admin/admin para testing/desarrollo
    if (dni === 'ADMIN' && pin === 'admin') {
      console.log('✅ Admin special access triggered')
      // Generar token de sesión para admin hardcodeado
      const sessionToken = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '')
      const tokenHash = await hashToken(sessionToken)

      const ttlDays = parseInt(process.env.SESSION_TTL_DAYS || '7', 10)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + ttlDays)

      // Buscar perfil admin (buscar tanto ADMIN como admin)
      let adminProfile = null
      
      // Intentar primero con ADMIN
      let { data: existingAdmin } = await supabaseAdmin
        .from('profiles')
        .select('id, dni, role, first_name, last_name, email, phone, created_at')
        .eq('dni', 'ADMIN')
        .maybeSingle()

      // Si no existe, intentar con admin en minúsculas
      if (!existingAdmin) {
        const result = await supabaseAdmin
          .from('profiles')
          .select('id, dni, role, first_name, last_name, email, phone, created_at')
          .eq('dni', 'admin')
          .maybeSingle()
        existingAdmin = result.data
      }

      console.log('🔍 Admin profile search:', { found: !!existingAdmin, dni: existingAdmin?.dni, role: existingAdmin?.role })

      if (existingAdmin) {
        adminProfile = existingAdmin
      } else {
        // Crear perfil admin si no existe
        const adminPinHash = await bcrypt.hash('admin', 10)
        const { data: newAdmin, error: createError } = await supabaseAdmin
          .from('profiles')
          .insert({
            dni: 'ADMIN',
            pin_hash: adminPinHash,
            role: 'admin',
            first_name: 'Administrador',
            last_name: 'Sistema',
            email: 'admin@soroboxing.com'
          })
          .select('id, dni, role, first_name, last_name, email, phone, created_at')
          .single()
        
        console.log('🆕 Created admin profile:', { success: !!newAdmin, error: createError })
        adminProfile = newAdmin
      }

      if (adminProfile) {
        // Crear sesión
        const { error: sessionError } = await supabaseAdmin
          .from('sessions')
          .insert({
            profile_id: adminProfile.id,
            token_hash: tokenHash,
            expires_at: expiresAt.toISOString(),
          })

        console.log('🔑 Session created:', { error: sessionError?.message })

        // Establecer cookie
        const cookieStore = await cookies()
        cookieStore.set('gym_session', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: ttlDays * 24 * 60 * 60,
        })

        console.log('✅ Login successful, returning user:', { 
          id: adminProfile.id, 
          dni: adminProfile.dni, 
          role: adminProfile.role 
        })

        return NextResponse.json({
          success: true,
          user: {
            id: adminProfile.id,
            dni: adminProfile.dni,
            role: adminProfile.role,
            first_name: adminProfile.first_name,
            last_name: adminProfile.last_name,
            email: adminProfile.email,
            phone: adminProfile.phone,
            created_at: adminProfile.created_at,
          },
        })
      } else {
        console.error('❌ Failed to get or create admin profile')
        return NextResponse.json(
          { error: 'Error al crear perfil de administrador' },
          { status: 500 }
        )
      }
    }

    // 2. Buscar usuario por DNI
    console.log('🔍 Searching for user with DNI:', dni)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, dni, pin_hash, role, deleted_at, first_name, last_name, email, phone')
      .eq('dni', dni)
      .maybeSingle()

    console.log('📊 Query result:', { 
      found: !!profile, 
      error: profileError?.message,
      profileDni: profile?.dni,
      profileRole: profile?.role,
      pinHashLength: profile?.pin_hash?.length 
    })

    if (profileError || !profile) {
      console.error('❌ User not found or error:', profileError)
      return NextResponse.json(
        { error: 'DNI o PIN incorrectos' },
        { status: 401 }
      )
    }

    // 3. Verificar que no esté eliminado
    if (profile.deleted_at) {
      return NextResponse.json(
        { error: 'Usuario no activo' },
        { status: 403 }
      )
    }

    // 4. Verificar PIN con bcrypt o texto plano para admin
    let pinMatches = false
    
    console.log('🔑 Verifying PIN:', { 
      isAdmin: profile.dni === 'ADMIN',
      pinHashValue: profile.pin_hash,
      pinValue: pin,
      directMatch: profile.pin_hash === pin
    })
    
    // Si el dni es admin y pin_hash es texto plano "admin", permitir acceso directo
    if (profile.dni === 'ADMIN' && profile.pin_hash === 'admin' && pin === 'admin') {
      console.log('✅ Admin direct text match')
      pinMatches = true
    } else {
      // Para usuarios normales, usar bcrypt
      try {
        pinMatches = await bcrypt.compare(pin, profile.pin_hash)
        console.log('🔐 Bcrypt compare result:', pinMatches)
      } catch (error) {
        console.log('⚠️ Bcrypt failed, trying direct comparison:', error)
        // Si falla bcrypt (por ejemplo, porque pin_hash no es un hash válido)
        // intentar comparación directa para casos legacy
        pinMatches = profile.pin_hash === pin
        console.log('📝 Direct comparison result:', pinMatches)
      }
    }
    
    if (!pinMatches) {
      console.error('❌ PIN verification failed')
      return NextResponse.json(
        { error: 'DNI o PIN incorrectos' },
        { status: 401 }
      )
    }
    
    console.log('✅ PIN verified successfully')

    // 5. Generar token de sesión
    const sessionToken = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '')
    const tokenHash = await hashToken(sessionToken)

    // 6. Calcular fecha de expiración
    const ttlDays = parseInt(process.env.SESSION_TTL_DAYS || '7', 10)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + ttlDays)

    // 7. Crear sesión en BD
    const { error: sessionError } = await supabaseAdmin
      .from('sessions')
      .insert({
        profile_id: profile.id,
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString(),
      })

    if (sessionError) {
      console.error('Error creando sesión:', sessionError)
      return NextResponse.json(
        { error: 'Error al iniciar sesión' },
        { status: 500 }
      )
    }

    // 8. Actualizar last_login_at
    await supabaseAdmin
      .from('profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', profile.id)

    // 9. Establecer cookie httpOnly (guardar sessionToken, NO tokenHash)
    const cookieStore = await cookies()
    cookieStore.set('gym_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    })

    // 10. Retornar datos del usuario (sin PIN)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: profile.id,
          dni: profile.dni,
          role: profile.role,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone: profile.phone,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
