/**
 * EJEMPLO DE IMPLEMENTACIÓN DE LOGIN
 * 
 * Este archivo muestra cómo implementar el sistema de login
 * con DNI + PIN para próximas versiones.
 * 
 * NO IMPLEMENTADO AÚN - SOLO REFERENCIA
 */

// ============================================
// ENDPOINT: POST /api/auth/login
// Archivo: app/api/auth/login/route.ts
// ============================================

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import * as bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import crypto from 'crypto'

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

    // 2. Buscar usuario por DNI
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, dni, pin_hash, role, deleted_at, first_name, last_name')
      .eq('dni', dni)
      .single()

    if (profileError || !profile) {
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

    // 4. Verificar PIN con bcrypt
    const pinMatches = await bcrypt.compare(pin, profile.pin_hash)
    if (!pinMatches) {
      return NextResponse.json(
        { error: 'DNI o PIN incorrectos' },
        { status: 401 }
      )
    }

    // 5. Generar token de sesión
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto
      .createHash('sha256')
      .update(sessionToken)
      .digest('hex')

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

    // 9. Establecer cookie httpOnly
    const cookieStore = await cookies()
    cookieStore.set('gym_session', tokenHash, {
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

// ============================================
// ENDPOINT: POST /api/auth/logout
// Archivo: app/api/auth/logout/route.ts
// ============================================

export async function POSTLogout() {
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

// ============================================
// ENDPOINT: GET /api/auth/me
// Archivo: app/api/auth/me/route.ts
// ============================================

export async function GETMe() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('gym_session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Buscar sesión válida
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('sessions')
      .select('profile_id, expires_at, revoked_at')
      .eq('token_hash', sessionToken)
      .single()

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
      .select('id, dni, role, first_name, last_name, email, phone, deleted_at')
      .eq('id', session.profile_id)
      .single()

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

// ============================================
// COMPONENTE: Login Page
// Archivo: app/login/page.tsx (reemplazar el actual)
// ============================================

export function LoginPageExample() {
  const [dni, setDni] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dni, pin }),
      })

      const data = await response.json()

      if (response.ok) {
        // Login exitoso
        if (data.user.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/clases')
        }
      } else {
        setError(data.error || 'Error al iniciar sesión')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        placeholder="DNI"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="PIN (6 dígitos)"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        maxLength={6}
        pattern="[0-9]{6}"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  )
}

// ============================================
// MIDDLEWARE: Protección de rutas
// Archivo: middleware.ts
// ============================================

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('gym_session')?.value

  // Rutas públicas (no requieren autenticación)
  const publicPaths = ['/login', '/']
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Verificar sesión
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const { data: session } = await supabaseAdmin
    .from('sessions')
    .select('profile_id, expires_at, revoked_at')
    .eq('token_hash', sessionToken)
    .single()

  if (
    !session ||
    session.revoked_at ||
    new Date(session.expires_at) < new Date()
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verificar rol para rutas admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', session.profile_id)
      .single()

    if (profile?.role !== 'admin') {
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

// ============================================
// EJEMPLO DE USO EN COMPONENTES
// ============================================

// Hook personalizado para obtener usuario actual
function useCurrentUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return { user, loading }
}

// Componente de ejemplo
function ProfileComponent() {
  const { user, loading } = useCurrentUser()

  if (loading) return <div>Cargando...</div>
  if (!user) return <div>No autenticado</div>

  return (
    <div>
      <p>Bienvenido, {user.first_name}!</p>
      <p>DNI: {user.dni}</p>
      <p>Rol: {user.role}</p>
    </div>
  )
}

// ============================================
// NOTAS IMPORTANTES
// ============================================

/*
SEGURIDAD:
- Los PINs se hashean con bcrypt antes de comparar
- Los tokens de sesión se hashean con SHA256
- Las cookies son httpOnly y secure en producción
- Las sesiones tienen expiración configurable

PRÓXIMOS PASOS:
1. Implementar estos endpoints
2. Actualizar la página de login
3. Crear el middleware
4. Proteger rutas sensibles
5. Añadir recuperación de PIN
6. Implementar rate limiting

TESTING:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"dni": "12345678A", "pin": "123456"}'
*/
