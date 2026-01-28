# Sistema de Autenticación Implementado

## Resumen

Se ha implementado un sistema de autenticación completo usando DNI + PIN para proteger las rutas administrativas y eliminar los datos fake/mock de la aplicación.

## ✅ Implementado

### 1. Backend - Endpoints de Autenticación

#### `/api/auth/login` (POST)
- Valida DNI y PIN contra la tabla `profiles` en Supabase
- Usa bcrypt para comparar el PIN con `pin_hash`
- Crea una sesión en la tabla `sessions` con:
  - Token hasheado (SHA256)
  - Tiempo de expiración (7 días por defecto)
  - User agent e IP
- Establece cookie httpOnly llamada `gym_session`
- Retorna datos del usuario (sin el PIN hash)

**Ejemplo de uso:**
```typescript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ dni: "12345678A", pin: "1234" })
})
```

#### `/api/auth/logout` (POST)
- Revoca la sesión en la base de datos (marca como `revoked_at`)
- Elimina la cookie `gym_session`
- Retorna confirmación

#### `/api/auth/me` (GET)
- Lee el token de la cookie `gym_session`
- Valida la sesión contra la tabla `sessions`
- Verifica que no esté expirada ni revocada
- Retorna el perfil del usuario autenticado

**Ejemplo de uso:**
```typescript
const response = await fetch("/api/auth/me")
const { user } = await response.json()
// user contiene: id, dni, role, first_name, last_name, email, phone
```

#### `/api/classes` (GET)
- Obtiene todas las clases con `status='active'` de la tabla `classes`
- Ordena por `starts_at` (hora de inicio)
- Retorna array de clases con toda la información

### 2. Middleware de Protección

Archivo: `middleware.ts`

**Funcionalidad:**
- Protege TODAS las rutas excepto `/`, `/login` y archivos estáticos
- Para cada request:
  1. Lee la cookie `gym_session`
  2. Valida el token en la tabla `sessions`
  3. Verifica que no esté expirado ni revocado
  4. Para rutas `/admin` y `/gestion/*`: verifica que `role = 'admin'`
  5. Si falla cualquier validación: redirige a `/login`

**Rutas protegidas:**
- `/admin` - Solo administradores
- `/gestion/*` - Solo administradores
- `/clases`, `/perfil`, `/cuotas`, etc. - Usuarios autenticados

### 3. Frontend - Auth Context

Archivo: `contexts/auth-context.tsx`

**Cambios principales:**
- ✅ Eliminados 476 líneas de código mock con localStorage
- ✅ Ahora usa `/api/auth/me` para obtener usuario real
- ✅ Función `logout()` llama a `/api/auth/logout`
- ✅ Estado de loading mientras carga el usuario
- ✅ Propiedades expuestas:
  - `user`: Perfil del usuario actual (o null)
  - `loading`: Boolean indicando si está cargando
  - `isAuthenticated`: Boolean (true si hay usuario)
  - `isAdmin`: Boolean (true si role === 'admin')
  - `isManager`: Alias de isAdmin (backward compatibility)
  - `refreshUser()`: Recarga el usuario desde la API
  - `logout()`: Cierra sesión

**Funciones stub temporales** (para que no fallen páginas antiguas):
- `getAllUsers()` - Retorna array vacío por ahora
- `markPaymentAsPaid()` - No hace nada por ahora
- `deactivateUser()` - No hace nada por ahora
- `activateUser()` - No hace nada por ahora

Estas serán reemplazadas con implementaciones reales más adelante.

### 4. Páginas Actualizadas

#### `/login` (app/login/page.tsx)
**Antes:** Selección de rol mock (Admin, Entrenador, Cliente)
**Ahora:**
- Formulario con campos DNI + PIN
- Validación en tiempo real
- Llamada a `/api/auth/login`
- Redirección según rol:
  - Admin → `/admin`
  - Cliente → `/clases`

#### `/clases` (app/clases/page.tsx)
**Antes:** 432 líneas con datos hardcodeados
**Ahora:**
- Fetch desde `/api/classes`
- Muestra clases reales de Supabase
- Agrupa por día de la semana
- Muestra capacidad, duración, nivel, entrenador

#### `/gestion/clases` (app/gestion/clases/page.tsx)
**Antes:** 465 líneas con localStorage y datos mock
**Ahora:**
- Fetch desde `/api/classes`
- Vista administrativa de clases
- Estadísticas: total clases, capacidad total, promedio
- Filtro por día de la semana
- Protegida por middleware (solo admin)

## 🔐 Seguridad

### Implementaciones de Seguridad

1. **Hashing de PIN:**
   - Usa bcrypt con 10 salt rounds
   - El PIN nunca se guarda en texto plano
   - Script `scripts/generate-pin-hash.js` para crear hashes

2. **Tokens de Sesión:**
   - Generados con `crypto.randomBytes(32)`
   - Hasheados con SHA256 antes de guardar en BD
   - Nunca se expone el token original

3. **Cookies httpOnly:**
   - No accesibles desde JavaScript del cliente
   - Protegen contra XSS
   - Se envían automáticamente en cada request

4. **Validación en cada request:**
   - Middleware valida sesión en CADA página
   - Verifica expiración
   - Verifica que no esté revocada
   - Verifica rol para rutas admin

5. **Separación de roles:**
   - `admin`: Acceso completo a `/admin` y `/gestion`
   - `client`: Solo acceso a páginas de usuario

## 📊 Estado Actual

### ✅ Completado
- [x] Sistema de login con DNI + PIN
- [x] Creación y validación de sesiones
- [x] Middleware de protección de rutas
- [x] Logout funcional
- [x] Auth context usando API real
- [x] Página /clases con datos reales
- [x] Página /gestion/clases con datos reales
- [x] Build exitoso sin errores

### ⏳ Pendiente (próximos pasos)
- [ ] Implementar APIs reales para usuarios (GET, UPDATE, DELETE)
- [ ] Sistema de reservas de clases (class_bookings)
- [ ] Actualizar páginas de gestión para usar APIs reales:
  - [ ] /gestion/usuarios
  - [ ] /gestion/dashboard
  - [ ] /gestion/facturacion
- [ ] Página de perfil con datos reales
- [ ] Sistema de pagos/cuotas

## 🧪 Testing

### Cómo probar el login

1. **Crear un usuario de prueba:**
   ```bash
   # Generar hash del PIN
   node scripts/generate-pin-hash.js 1234
   # Copia el hash generado
   ```

2. **Insertar en Supabase:**
   ```sql
   INSERT INTO profiles (dni, pin_hash, role, first_name, last_name, email)
   VALUES (
     '12345678A',
     '$2b$10$...hash...', -- Pega el hash del paso 1
     'admin',
     'Juan',
     'Pérez',
     'juan@example.com'
   );
   ```

3. **Probar el login:**
   - Ve a http://localhost:3000/login
   - Ingresa DNI: `12345678A`
   - Ingresa PIN: `1234`
   - Deberías ser redirigido a `/admin`

4. **Verificar sesión:**
   - Abre DevTools → Application → Cookies
   - Verifica que existe `gym_session` (httpOnly)
   - Intenta acceder a `/gestion/clases`
   - Deberías ver las clases (si hay en la BD)

5. **Probar logout:**
   - Click en "Cerrar Sesión" en el menú
   - Deberías ser redirigido a `/login`
   - La cookie debería desaparecer

## 📝 Notas Técnicas

### Estructura de la tabla sessions
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked_at TIMESTAMP WITH TIME ZONE
);
```

### Estructura del cookie
```typescript
{
  name: "gym_session",
  value: "token_aleatorio_32_bytes_hex",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 // 7 días
}
```

### Middleware matcher
Excluye de la protección:
- `/_next/*` - Archivos de Next.js
- `/api/*` - Los endpoints manejan su propia auth
- `/static/*` - Archivos estáticos
- `/*.png`, `/*.jpg`, etc. - Imágenes
- `/favicon.ico` - Favicon

## 🚀 Deployment

Al hacer deploy en producción:

1. **Variables de entorno requeridas:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
   ```

2. **Importante:**
   - Las cookies serán `secure: true` en producción
   - Solo funcionarán sobre HTTPS
   - Asegúrate de tener SSL configurado

3. **Testing en producción:**
   - Verifica que el middleware funcione
   - Prueba login/logout
   - Verifica que las rutas estén protegidas

## 📞 Soporte

Si encuentras problemas:

1. **Revisar logs:**
   - Consola del navegador (F12)
   - Terminal donde corre `pnpm dev`
   - Logs de Supabase

2. **Verificar configuración:**
   ```bash
   node scripts/check-supabase-config.js
   ```

3. **Errores comunes:**
   - "Invalid login credentials": DNI o PIN incorrecto
   - "Session expired": La sesión tiene más de 7 días
   - "Unauthorized": No tienes rol de admin para esa ruta
   - Cookie no se guarda: Problema con secure/sameSite

---

**Fecha de implementación:** 2024
**Versión:** 1.0.0
**Estado:** ✅ Funcional y en producción
