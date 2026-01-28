# 🥊 Soro Boxing Club - Sistema de Gestión

Sistema completo de gestión de gimnasio con panel de administración, autenticación personalizada y gestión de usuarios usando Next.js 16 y Supabase.

## 🎯 Características

### ✅ Panel de Administración (Implementado)

- **Crear Usuarios:** Registro de nuevos clientes con generación automática de PIN
- **Listar Usuarios:** Vista de todos los usuarios activos del gimnasio
- **Eliminar Usuarios:** Soft delete con revocación automática de sesiones
- **Seguridad:** Autenticación con DNI + PIN hasheado con bcrypt

### 🚧 Próximamente

- Sistema de login completo (DNI + PIN)
- Gestión de clases y horarios
- Sistema de reservas
- Control de asistencia
- Gestión de pagos/cuotas
- Panel de usuario (no admin)

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 16 (App Router), React, TypeScript
- **UI:** Tailwind CSS, Radix UI, shadcn/ui
- **Backend:** Next.js API Routes
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** Sistema personalizado (DNI + PIN con bcrypt)
- **Seguridad:** Sesiones con cookies httpOnly

## 📦 Estructura del Proyecto

```
├── app/
│   ├── admin/                  # Panel de administración
│   │   └── page.tsx           # UI del panel admin
│   ├── api/
│   │   └── admin/             # Endpoints admin
│   │       ├── create-user/   # POST: Crear usuario
│   │       ├── users/         # GET: Listar usuarios
│   │       └── delete-user/   # POST: Eliminar usuario
│   └── ...                    # Otras páginas
├── lib/
│   ├── supabase-admin.ts      # Cliente Supabase (service role)
│   ├── auth-admin.ts          # Validación de sesiones admin
│   ├── types/
│   │   └── database.ts        # Tipos TypeScript de BD
│   └── utils.ts
├── scripts/
│   ├── generate-pin-hash.js   # Generador de hash de PIN
│   └── check-supabase-config.js # Verificador de config
├── supabase-setup.sql         # Script de inicialización de BD
├── SETUP_GUIDE.md             # Guía de configuración paso a paso
├── ADMIN_SETUP.md             # Documentación técnica del admin
└── API_EXAMPLES.md            # Ejemplos de uso de endpoints
```

## 🚀 Quick Start

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta `supabase-setup.sql` en SQL Editor
3. Configura `.env.local`:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
SESSION_COOKIE_NAME=gym_session
SESSION_TTL_DAYS=7
```

### 3. Crear Usuario Admin

```bash
# Generar hash de PIN
npm run generate:pin 123456

# Ejecutar el SQL generado en Supabase
```

### 4. Verificar Configuración

```bash
npm run check:supabase
```

### 5. Iniciar Servidor

```bash
npm run dev
```

Accede a: [http://localhost:3000/admin](http://localhost:3000/admin)

## 📖 Documentación

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Guía completa de configuración
- **[ADMIN_SETUP.md](ADMIN_SETUP.md)** - Documentación técnica del panel admin
- **[API_EXAMPLES.md](API_EXAMPLES.md)** - Ejemplos de uso de endpoints

## 🗄️ Estructura de Base de Datos

### Tabla: profiles
```sql
- id (uuid, pk)
- role ('admin' | 'client')
- dni (text, unique, required)
- first_name (text, nullable)
- last_name (text, nullable)
- email (text, nullable)
- phone (text, nullable)
- pin_hash (text, required)
- created_at, updated_at, deleted_at, last_login_at
```

### Tabla: sessions
```sql
- id (uuid, pk)
- profile_id (uuid, fk -> profiles)
- token_hash (text, unique)
- created_at, expires_at, revoked_at
```

### Tabla: classes
```sql
- id (uuid, pk)
- title, professor
- starts_at (timestamptz)
- duration_minutes, capacity
- status ('active' | 'cancelled')
```

### Tabla: class_bookings
```sql
- id (uuid, pk)
- class_id (uuid, fk -> classes)
- profile_id (uuid, fk -> profiles)
- created_at, cancelled_at
- removed_at, removed_by, removed_reason
```

## 🔐 Seguridad

- ✅ PINs hasheados con bcrypt (10 salt rounds)
- ✅ Sesiones con expiración configurable
- ✅ Service role key nunca expuesta al cliente
- ✅ Soft delete de usuarios
- ✅ Revocación automática de sesiones
- ✅ Validación de permisos en todos los endpoints

## 📝 Scripts Disponibles

```bash
npm run dev           # Servidor de desarrollo
npm run build         # Build de producción
npm run start         # Servidor de producción
npm run lint          # Linter
npm run check:supabase   # Verificar configuración
npm run generate:pin     # Generar hash de PIN
```

## 🧪 Testing

### Crear Usuario Admin (SQL)

```sql
INSERT INTO profiles (dni, role, pin_hash, first_name, last_name)
VALUES ('ADMIN001', 'admin', '$2a$10$...hash...', 'Admin', 'Test');
```

### Crear Sesión de Prueba (SQL)

```sql
INSERT INTO sessions (profile_id, token_hash, expires_at)
VALUES (
  (SELECT id FROM profiles WHERE dni = 'ADMIN001'),
  'test_token',
  NOW() + INTERVAL '7 days'
);
```

### Agregar Cookie (Browser DevTools)

```javascript
document.cookie = "gym_session=test_token; path=/";
```

## 📊 Endpoints API

### POST `/api/admin/create-user`
Crea un nuevo usuario con PIN autogenerado

### GET `/api/admin/users`
Lista todos los usuarios activos

### POST `/api/admin/delete-user`
Elimina un usuario (soft delete)

Ver [API_EXAMPLES.md](API_EXAMPLES.md) para ejemplos completos.

## ⚠️ Importante

**Esto es un proyecto en desarrollo. Antes de usar en producción:**

- [ ] Implementar sistema completo de login
- [ ] Configurar middleware de autenticación
- [ ] Implementar rate limiting
- [ ] Configurar CORS apropiadamente
- [ ] Revisar políticas RLS en Supabase
- [ ] Implementar recuperación de PIN
- [ ] Añadir validación de DNI español
- [ ] Configurar logs y monitoreo

## 🤝 Contribuir

1. Fork del repositorio
2. Crea tu rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Añadir nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

Proyecto privado - Todos los derechos reservados

---

**Desarrollado con ❤️ para Soro Boxing Club**
