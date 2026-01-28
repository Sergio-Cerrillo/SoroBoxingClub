-- ============================================
-- SCRIPT DE INICIALIZACIÓN SUPABASE
-- Soro Boxing Club - Base de Datos
-- ============================================

-- 1. Crear tabla profiles
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  dni TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  pin_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_profiles_dni ON profiles(dni);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON profiles(deleted_at);

-- 2. Crear tabla sessions
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ
);

-- Índices para optimizar consultas de sesiones
CREATE INDEX IF NOT EXISTS idx_sessions_profile_id ON sessions(profile_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- 3. Crear tabla classes
-- ============================================
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  professor TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  capacity INTEGER NOT NULL DEFAULT 20,
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para optimizar consultas de clases
CREATE INDEX IF NOT EXISTS idx_classes_starts_at ON classes(starts_at);
CREATE INDEX IF NOT EXISTS idx_classes_status ON classes(status);

-- 4. Crear tabla class_bookings
-- ============================================
CREATE TABLE IF NOT EXISTS class_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  removed_at TIMESTAMPTZ,
  removed_by UUID REFERENCES profiles(id),
  removed_reason TEXT,
  
  -- Un usuario no puede reservar la misma clase dos veces
  UNIQUE(class_id, profile_id)
);

-- Índices para optimizar consultas de reservas
CREATE INDEX IF NOT EXISTS idx_bookings_class_id ON class_bookings(class_id);
CREATE INDEX IF NOT EXISTS idx_bookings_profile_id ON class_bookings(profile_id);
CREATE INDEX IF NOT EXISTS idx_bookings_cancelled_at ON class_bookings(cancelled_at);

-- ============================================
-- TRIGGER: Actualizar updated_at automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
    BEFORE UPDATE ON classes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCIÓN: Limpiar sesiones expiradas
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM sessions
  WHERE expires_at < NOW()
    AND revoked_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- DATOS DE PRUEBA
-- ============================================

-- Usuario ADMIN de prueba
-- DNI: ADMIN001
-- PIN: 123456 (hash generado con bcrypt, 10 rounds)
INSERT INTO profiles (dni, role, pin_hash, first_name, last_name, email, phone)
VALUES (
  'ADMIN001',
  'admin',
  '$2a$10$YourBcryptHashHere', -- ⚠️ Reemplazar con hash real de bcrypt
  'Admin',
  'Sistema',
  'admin@soroboxing.com',
  '+34 600 000 000'
) ON CONFLICT (dni) DO NOTHING;

-- Usuario CLIENT de prueba
-- DNI: 12345678A
-- PIN: 654321 (hash generado con bcrypt, 10 rounds)
INSERT INTO profiles (dni, role, pin_hash, first_name, last_name, email, phone)
VALUES (
  '12345678A',
  'client',
  '$2a$10$YourBcryptHashHere', -- ⚠️ Reemplazar con hash real de bcrypt
  'Juan',
  'García López',
  'juan@example.com',
  '+34 600 111 222'
) ON CONFLICT (dni) DO NOTHING;

-- Clases de ejemplo
INSERT INTO classes (title, professor, starts_at, duration_minutes, capacity, status)
VALUES
  ('Boxeo Iniciación', 'Carlos Martínez', NOW() + INTERVAL '1 day', 60, 15, 'active'),
  ('Boxeo Avanzado', 'Ana Rodríguez', NOW() + INTERVAL '2 days', 90, 12, 'active'),
  ('CrossFit Boxing', 'Luis Sánchez', NOW() + INTERVAL '3 days', 60, 20, 'active');

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_bookings ENABLE ROW LEVEL SECURITY;

-- Política: Service Role puede hacer todo
CREATE POLICY "Service role has full access" ON profiles
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access" ON sessions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access" ON classes
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access" ON class_bookings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

/*
1. GENERAR HASH DE PIN CON NODE.JS:
   
   const bcrypt = require('bcryptjs');
   const pin = '123456';
   const hash = await bcrypt.hash(pin, 10);
   console.log(hash);

2. LIMPIAR SESIONES EXPIRADAS:
   
   SELECT cleanup_expired_sessions();

3. VERIFICAR TABLAS:
   
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';

4. VERIFICAR USUARIOS:
   
   SELECT id, dni, role, first_name, last_name, created_at, deleted_at
   FROM profiles
   ORDER BY created_at DESC;

5. CREAR SESIÓN MANUALMENTE (para testing):
   
   INSERT INTO sessions (profile_id, token_hash, expires_at)
   VALUES (
     (SELECT id FROM profiles WHERE dni = 'ADMIN001'),
     'test_token_hash_123',
     NOW() + INTERVAL '7 days'
   );
*/
