# Panel de Administración - Supabase Integration

Este proyecto implementa un sistema de gestión de usuarios con autenticación personalizada (DNI + PIN) usando Supabase como backend.

## 🎯 Características Implementadas

### Backend (API Routes)

#### ✅ POST `/api/admin/create-user`
Crea un nuevo usuario con rol 'client':
- Genera PIN automático de 6 dígitos
- Hashea el PIN con bcrypt (10 salt rounds)
- Valida DNI único
- Retorna el PIN una sola vez

**Request:**
```json
{
  "dni": "12345678A",
  "first_name": "Juan",
  "last_name": "García",
  "email": "juan@example.com",
  "phone": "+34 600 000 000"
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "pin": "123456"
}
```

#### ✅ GET `/api/admin/users`
Lista todos los usuarios activos (deleted_at IS NULL):
- Ordenados por fecha de creación (más recientes primero)
- Solo muestra usuarios no eliminados

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "dni": "12345678A",
      "first_name": "Juan",
      "last_name": "García",
      "email": "juan@example.com",
      "phone": "+34 600 000 000",
      "role": "client",
      "created_at": "2025-01-26T..."
    }
  ]
}
```

#### ✅ POST `/api/admin/delete-user`
Realiza soft delete del usuario:
- Actualiza deleted_at
- Revoca todas las sesiones activas

**Request:**
```json
{
  "userId": "uuid"
}
```

### Frontend

#### ✅ `/app/admin/page.tsx`
Panel de administración completo con:

**1. Formulario de creación:**
- Campos: DNI (requerido), nombre, apellidos, email, teléfono
- Botón de submit con loading state
- Mensaje de éxito con PIN generado
- Opción de copiar PIN al portapapeles

**2. Tabla de usuarios:**
- Listado de usuarios activos
- Columnas: DNI, nombre completo, email, teléfono, fecha alta
- Botón de eliminar con confirmación

**3. UX:**
- Loading states en todas las operaciones
- Confirmación al borrar (AlertDialog)
- Feedback visual inmediato
- Responsive design

## 🔐 Seguridad

### Autenticación
- Sistema propio con DNI + PIN (no Supabase Auth)
- PINs hasheados con bcrypt (salt rounds: 10)
- Sesiones en tabla `sessions` con cookies httpOnly

### Autorización
- Todos los endpoints verifican sesión válida
- Solo usuarios con `role='admin'` pueden acceder
- SUPABASE_SERVICE_ROLE_KEY nunca se expone al cliente

### Validaciones
- DNI único (constraint en BD)
- Sesiones con expiración
- Soft delete (deleted_at)
- Revocación de sesiones al eliminar usuario

## 📦 Estructura de Archivos

```
lib/
├── supabase-admin.ts       # Cliente Supabase con service role
├── auth-admin.ts           # Validación de sesión admin
└── types/
    └── database.ts         # Tipos TypeScript

app/
├── admin/
│   └── page.tsx           # Panel de administración
└── api/
    └── admin/
        ├── create-user/
        │   └── route.ts   # POST crear usuario
        ├── users/
        │   └── route.ts   # GET listar usuarios
        └── delete-user/
            └── route.ts   # POST eliminar usuario
```

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
npm install @supabase/supabase-js bcryptjs
```

2. **Variables de entorno (.env.local):**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SESSION_COOKIE_NAME=gym_session
SESSION_TTL_DAYS=7
```

3. **Ejecutar servidor:**
```bash
npm run dev
```

4. **Acceder al panel:**
```
http://localhost:3000/admin
```

## 📊 Estructura de Base de Datos

### Tabla: profiles
```sql
CREATE TABLE profiles (
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
```

### Tabla: sessions
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  token_hash TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ
);
```

## ⚠️ Importante

### NO USAR EN PRODUCCIÓN SIN:
- [ ] Configurar middleware de autenticación
- [ ] Proteger ruta `/admin` con verificación de rol
- [ ] Implementar rate limiting en endpoints
- [ ] Configurar CORS apropiadamente
- [ ] Habilitar logs y monitoreo
- [ ] Configurar políticas RLS en Supabase
- [ ] Implementar sistema de recuperación de PIN
- [ ] Añadir validación de formato de DNI español

## 📝 TODO (Próximos Pasos)

- [ ] Middleware de protección de rutas admin
- [ ] Sistema de login real (DNI + PIN)
- [ ] Gestión de clases
- [ ] Reservas de clases
- [ ] Panel de usuario (no admin)
- [ ] Sistema de pagos/cuotas
- [ ] Recuperación de PIN
- [ ] Logs de auditoría

## 🧪 Testing

Para probar el panel:

1. Crea un usuario admin manualmente en Supabase:
```sql
INSERT INTO profiles (dni, role, pin_hash, first_name, last_name)
VALUES ('00000000A', 'admin', '$2a$10$hash...', 'Admin', 'Test');
```

2. Crea una sesión válida (o implementa el login real)

3. Accede a `/admin` y prueba:
   - Crear usuario
   - Listar usuarios
   - Eliminar usuario

## 🤝 Contribuir

Este es un proyecto en desarrollo. Para contribuir:
1. Fork del repositorio
2. Crear rama feature
3. Commit cambios
4. Push y crear PR

## 📄 Licencia

Proyecto privado - Todos los derechos reservados
