import { cookies } from 'next/headers'
import { supabaseAdmin } from './supabase-admin'
import crypto from 'crypto'

export interface AdminSession {
  profileId: string
  role: 'admin' | 'client'
}

/**
 * Verifica que la sesión sea válida para cualquier usuario autenticado
 * Para usar en API routes que no requieren privilegios de admin
 */
export async function verifySession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('gym_session')?.value

  if (!sessionToken) {
    return null
  }

  // Hashear el token antes de buscarlo en la BD
  const tokenHash = crypto
    .createHash('sha256')
    .update(sessionToken)
    .digest('hex')

  // Buscar sesión válida en la BD
  const { data: session, error: sessionError } = await supabaseAdmin
    .from('sessions')
    .select('profile_id, expires_at, revoked_at')
    .eq('token_hash', tokenHash)
    .single()

  if (sessionError || !session) {
    return null
  }

  // Verificar que no esté revocada
  if (session.revoked_at) {
    return null
  }

  // Verificar que no haya expirado
  const now = new Date()
  const expiresAt = new Date(session.expires_at)
  if (expiresAt < now) {
    return null
  }

  // Obtener perfil del usuario
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, role, deleted_at')
    .eq('id', session.profile_id)
    .single()

  if (profileError || !profile) {
    return null
  }

  // Verificar que no esté borrado
  if (profile.deleted_at) {
    return null
  }

  // No verificar rol - cualquier usuario autenticado es válido
  return {
    profileId: profile.id,
    role: profile.role,
  }
}

/**
 * Verifica que la sesión sea válida y que el usuario tenga rol de admin
 * Para usar en API routes
 */
export async function verifyAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('gym_session')?.value

  if (!sessionToken) {
    console.log('❌ No session token found in cookie')
    return null
  }

  // Hashear el token antes de buscarlo en la BD
  const tokenHash = crypto
    .createHash('sha256')
    .update(sessionToken)
    .digest('hex')

  console.log('🔍 Verifying session:', { tokenPreview: sessionToken.substring(0, 10), hashPreview: tokenHash.substring(0, 10) })

  // Buscar sesión válida en la BD
  const { data: session, error: sessionError } = await supabaseAdmin
    .from('sessions')
    .select('profile_id, expires_at, revoked_at')
    .eq('token_hash', tokenHash)
    .single()

  console.log('📊 Session query result:', { found: !!session, error: sessionError?.message })

  if (sessionError || !session) {
    return null
  }

  // Verificar que no esté revocada
  if (session.revoked_at) {
    return null
  }

  // Verificar que no haya expirado
  const now = new Date()
  const expiresAt = new Date(session.expires_at)
  if (expiresAt < now) {
    return null
  }

  // Obtener perfil del usuario
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, role, deleted_at')
    .eq('id', session.profile_id)
    .single()

  if (profileError || !profile) {
    return null
  }

  // Verificar que no esté borrado
  if (profile.deleted_at) {
    return null
  }

  // Verificar que sea admin
  if (profile.role !== 'admin') {
    return null
  }

  return {
    profileId: profile.id,
    role: profile.role,
  }
}
