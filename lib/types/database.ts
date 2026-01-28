/**
 * Tipos TypeScript para las tablas de Supabase
 */

export interface Profile {
  id: string
  role: 'admin' | 'client'
  dni: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  pin_hash: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  last_login_at: string | null
}

export interface Class {
  id: string
  title: string
  professor: string
  starts_at: string
  duration_minutes: number
  capacity: number
  status: 'active' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface ClassBooking {
  id: string
  class_id: string
  profile_id: string
  created_at: string
  cancelled_at: string | null
  removed_at: string | null
  removed_by: string | null
  removed_reason: string | null
}

export interface Session {
  id: string
  profile_id: string
  token_hash: string
  created_at: string
  expires_at: string
  revoked_at: string | null
}
