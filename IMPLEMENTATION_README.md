# Sistema de Gestión de Mensualidades y Asistencias - Implementación Completa

## 📋 Resumen de la Implementación

Se ha implementado un sistema completo para gestionar:
1. **Mensualidades por usuario** - Control interno sin pasarela de pago
2. **Registro de asistencias** - Check-in en clases por parte del admin
3. **Panel administrativo mejorado** - Visualización de datos reales de usuarios

## 🗄️ Cambios en la Base de Datos

### 1. Ejecutar Migraciones SQL

**IMPORTANTE:** Debes ejecutar las migraciones SQL en Supabase antes de usar las nuevas funcionalidades.

1. Ve a tu panel de Supabase: https://mevkpxjtgzncqclwxmqe.supabase.co
2. Navega a: **SQL Editor**
3. Abre el archivo: `supabase-migrations.sql`
4. Copia y pega el contenido completo
5. Haz clic en **"Run"**

### Nuevas Tablas y Columnas

#### Tabla `membership_dues`
```sql
- id: UUID (pk)
- profile_id: UUID (fk -> profiles.id)
- period_month: DATE (día 1 del mes, e.g., '2026-01-01')
- amount_cents: INTEGER (default 5000 = 50.00 EUR)
- currency: TEXT (default 'EUR')
- status: ENUM ('pending', 'paid', 'waived')
- paid_at: TIMESTAMPTZ (null hasta que se marque como pagado)
- marked_by: UUID (admin que marcó como pagado)
- note: TEXT (notas opcionales)
- created_at, updated_at: TIMESTAMPTZ
```

**Índices únicos:**
- `(profile_id, period_month)` - Un usuario no puede tener dos registros para el mismo mes

#### Modificación en `class_bookings`
```sql
ALTER TABLE class_bookings 
ADD COLUMN checked_in_at TIMESTAMPTZ;
```

Esta columna registra cuándo un usuario hizo check-in en una clase.

## 🔌 Nuevos Endpoints API

### 1. GET `/api/admin/users/[id]/summary`
Obtiene estadísticas de reservas y asistencias de un usuario.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "bookedCount": 3,      // Clases reservadas futuras activas
    "attendanceCount": 12  // Total de asistencias registradas
  }
}
```

**Seguridad:** Requiere sesión de admin válida.

---

### 2. GET `/api/admin/users/[id]/dues?months=6`
Obtiene las mensualidades de los últimos N meses (default 6).

**Parámetros:**
- `months` (query, opcional): Número de meses a obtener (1-24)

**Comportamiento:**
- Si un mes no existe en la BD, lo crea automáticamente como `pending`
- Devuelve los meses ordenados de más reciente a más antiguo

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "profile_id": "uuid",
      "period_month": "2026-01-01",
      "amount_cents": 5000,
      "currency": "EUR",
      "status": "paid",
      "paid_at": "2026-01-15T10:30:00Z",
      "marked_by": "admin-uuid",
      "note": null,
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-15T10:30:00Z"
    },
    // ... más meses
  ]
}
```

**Seguridad:** Requiere sesión de admin válida.

---

### 3. POST `/api/admin/dues/[dueId]/mark-paid`
Marca una mensualidad como pagada.

**Body (opcional):**
```json
{
  "note": "Pagado en efectivo"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "paid",
    "paid_at": "2026-01-27T12:00:00Z",
    "marked_by": "admin-uuid",
    // ... resto de campos
  }
}
```

**Seguridad:** Requiere sesión de admin válida.

---

### 4. POST `/api/admin/bookings/[bookingId]/check-in`
Registra la asistencia de un usuario a una clase.

**Respuesta:**
```json
{
  "success": true,
  "message": "Checked in successfully",
  "data": {
    "id": "booking-uuid",
    "checked_in_at": "2026-01-27T18:30:00Z",
    // ... resto de campos
  }
}
```

**Validaciones:**
- No permite check-in en reservas canceladas
- No permite check-in en reservas eliminadas
- Si ya tiene check-in, devuelve success sin actualizar

**Seguridad:** Requiere sesión de admin válida.

---

## 🎨 Componentes UI Nuevos

### `components/user-detail-modal.tsx`

Modal que muestra información detallada de un usuario:
- **Stats Cards:** Reservas futuras y asistencias totales
- **Historial de Pagos:** Últimos 6 meses con estado visual
- **Acciones:** Botón "Marcar Pagado" para mensualidades pendientes

**Props:**
```typescript
interface UserDetailModalProps {
  user: User | null
  open: boolean
  onClose: () => void
}
```

**Uso en Admin Panel:**
```tsx
<UserDetailModal
  user={selectedUser}
  open={!!selectedUser}
  onClose={() => setSelectedUser(null)}
/>
```

### Actualización en `app/admin/page.tsx`

Se ha añadido:
- Botón **"VER DETALLES"** en cada tarjeta de usuario
- Estado para manejar el modal de detalles
- Importación del componente `UserDetailModal`
- Icono `Eye` de lucide-react

## 🔐 Seguridad Implementada

### Verificación en Todos los Endpoints

Todos los endpoints `/api/admin/*` verifican:

1. **Sesión válida:** Cookie `gym_session` presente y token hasheado existe en BD
2. **Sesión no revocada:** `revoked_at` debe ser NULL
3. **Sesión no expirada:** `expires_at` debe ser futuro
4. **Usuario no eliminado:** `deleted_at` debe ser NULL
5. **Rol de admin:** `role` debe ser exactamente `'admin'`

### Helper: `lib/auth-admin.ts`

```typescript
export async function verifyAdminSession(): Promise<AdminSession | null>
```

Retorna:
```typescript
{
  profileId: string,
  role: 'admin'
}
```

O `null` si la verificación falla.

**Uso:**
```typescript
const adminSession = await verifyAdminSession()
if (!adminSession) {
  return NextResponse.json(
    { error: "Unauthorized: Admin access required" },
    { status: 401 }
  )
}
```

## 🧪 Testing

### 1. Verificar Migraciones

Después de ejecutar las migraciones, verifica que las tablas se crearon:

```sql
-- En SQL Editor de Supabase:

-- Verificar tabla membership_dues
SELECT * FROM membership_dues LIMIT 1;

-- Verificar columna checked_in_at
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'class_bookings' 
AND column_name = 'checked_in_at';
```

### 2. Probar Creación de Mensualidades

1. Ve al panel admin: http://localhost:3000/admin
2. Haz clic en **"VER DETALLES"** de cualquier usuario
3. El modal debe mostrar:
   - Número de reservas futuras
   - Número de asistencias
   - Historial de pagos con los últimos 6 meses
   - Si es la primera vez, los meses se crearán automáticamente como "PENDIENTE"

### 3. Marcar Mensualidad como Pagada

1. En el modal de detalles de usuario
2. Busca un mes con estado **"PENDIENTE"**
3. Haz clic en **"Marcar Pagado"**
4. El estado debe cambiar a **"PAGADO"** con la fecha actual

### 4. Probar Check-in (Requiere implementación en UI)

**Endpoint ya está listo**, pero necesitarás crear una UI para:
1. Listar clases del día
2. Ver quién está reservado en cada clase
3. Botón de check-in por cada reserva

**Ejemplo de llamada:**
```typescript
const response = await fetch(`/api/admin/bookings/${bookingId}/check-in`, {
  method: 'POST'
})
```

## 📊 Lógica de Negocio

### Mensualidades

- **Creación automática:** Si un mes no existe, se crea on-demand como `pending`
- **Precio por defecto:** 50.00 EUR (5000 céntimos)
- **Estados:**
  - `pending`: No pagado aún (amarillo en UI)
  - `paid`: Pagado (verde en UI)
  - `waived`: Exento (gris en UI)

### Asistencias

- **Check-in:** Solo se puede hacer si:
  - La reserva no está cancelada (`cancelled_at` es NULL)
  - La reserva no está eliminada (`removed_at` es NULL)
- **Registro único:** `checked_in_at` se establece una sola vez
- **Cuenta:** `attendanceCount` suma todas las reservas con `checked_in_at` no NULL

### Reservas Futuras

- **bookedCount** solo cuenta reservas que:
  - No están canceladas
  - No están eliminadas
  - La clase comienza en el futuro (`starts_at >= NOW()`)
  - La clase está activa (`status = 'active'`)

## 🚀 Próximos Pasos Sugeridos

### 1. UI para Check-in de Clases

Crear página: `app/gestion/check-in/page.tsx`

Funcionalidad:
- Mostrar clases de hoy
- Listar reservas por clase
- Botón de check-in por usuario
- Indicador visual de quién ya hizo check-in

### 2. Dashboard de Finanzas

Crear: `app/gestion/finanzas/page.tsx`

Métricas:
- Total recaudado este mes
- Pagos pendientes
- Gráfica de ingresos mensuales
- Usuarios con pagos atrasados

### 3. Notificaciones Automáticas

Implementar:
- Email/SMS cuando una mensualidad está pendiente
- Recordatorios de clases reservadas
- Confirmación de check-in

### 4. Reportes

Agregar:
- Exportar CSV de mensualidades
- Reporte de asistencias por usuario
- Estadísticas de ocupación de clases

## 📁 Archivos Modificados/Creados

### Nuevos Archivos
```
supabase-migrations.sql                                  # Migraciones SQL
app/api/admin/users/[id]/summary/route.ts               # Endpoint de stats
app/api/admin/users/[id]/dues/route.ts                  # Endpoint de mensualidades
app/api/admin/dues/[dueId]/mark-paid/route.ts           # Marcar pagado
app/api/admin/bookings/[bookingId]/check-in/route.ts    # Check-in
components/user-detail-modal.tsx                         # Modal de detalles
```

### Archivos Modificados
```
app/admin/page.tsx                    # Añadido botón "Ver Detalles" y modal
lib/auth-admin.ts                     # Ya existía, se usa en nuevos endpoints
```

## 🐛 Troubleshooting

### Error: "Table membership_dues does not exist"
**Solución:** Ejecuta las migraciones SQL en Supabase.

### Error: "Column checked_in_at does not exist"
**Solución:** Ejecuta las migraciones SQL en Supabase.

### Error: "Unauthorized: Admin access required"
**Solución:** 
1. Verifica que estés logueado como admin
2. Verifica que tu cookie `gym_session` sea válida
3. Verifica que tu rol en la BD sea `'admin'`

### No se muestran datos en el modal
**Solución:**
1. Abre la consola del navegador (F12)
2. Verifica si hay errores en las llamadas a la API
3. Verifica que el usuario tenga un `id` válido
4. Verifica que las migraciones se hayan ejecutado correctamente

## ✅ Checklist de Implementación

- [x] Crear archivo SQL de migraciones
- [x] Crear endpoint de summary (reservas + asistencias)
- [x] Crear endpoint de mensualidades (GET)
- [x] Crear endpoint mark-paid (POST)
- [x] Crear endpoint check-in (POST)
- [x] Crear componente UserDetailModal
- [x] Actualizar admin panel con botón "Ver Detalles"
- [x] Verificar seguridad en todos los endpoints
- [x] Documentar implementación
- [ ] **PENDIENTE: Ejecutar migraciones SQL en Supabase**
- [ ] **PENDIENTE: Crear UI para check-in de clases**
- [ ] **PENDIENTE: Crear dashboard de finanzas**

## 📞 Soporte

Si encuentras algún problema:
1. Revisa la consola del navegador (F12)
2. Revisa los logs del servidor de Next.js
3. Verifica que las migraciones SQL se ejecutaron correctamente
4. Verifica que estés logueado como admin

---

**Última actualización:** 27 de enero de 2026
**Versión:** 1.0.0
