# 🚀 Guía de Configuración Rápida - Panel Admin

Esta guía te ayudará a configurar el panel de administración con Supabase en menos de 10 minutos.

## ✅ Checklist de Configuración

- [ ] Proyecto de Supabase creado y activo
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Base de datos inicializada con `supabase-setup.sql`
- [ ] Usuario admin creado en Supabase
- [ ] Servidor de desarrollo ejecutándose

---

## 📋 Paso 1: Configurar Supabase

### 1.1 Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea un nuevo proyecto o usa uno existente
3. Anota tu `Project URL` y `Service Role Key` (⚠️ no la anon key)

### 1.2 Ejecutar SQL de Inicialización

1. En Supabase Dashboard, ve a **SQL Editor**
2. Crea una nueva query
3. Copia y pega el contenido de `supabase-setup.sql`
4. Ejecuta la query

Esto creará:
- ✅ Tablas: `profiles`, `sessions`, `classes`, `class_bookings`
- ✅ Índices optimizados
- ✅ Triggers para `updated_at`
- ✅ Políticas RLS (Row Level Security)
- ✅ Funciones auxiliares

---

## 🔑 Paso 2: Crear Usuario Admin

### Opción A: Usando el Script (Recomendado)

1. Genera un hash de PIN:
```bash
npm run generate:pin 123456
```

2. Copia el SQL que aparece en la consola

3. Ejecuta ese SQL en Supabase SQL Editor

### Opción B: Manualmente con Node.js

```javascript
const bcrypt = require('bcryptjs');
const pin = '123456';
bcrypt.hash(pin, 10).then(hash => console.log(hash));
```

Luego ejecuta en Supabase:
```sql
INSERT INTO profiles (dni, role, pin_hash, first_name, last_name, email)
VALUES (
  'ADMIN001',
  'admin',
  'tu_hash_aqui',
  'Admin',
  'Sistema',
  'admin@soroboxing.com'
);
```

---

## 🌐 Paso 3: Variables de Entorno

El archivo `.env.local` ya debería existir con:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
SESSION_COOKIE_NAME=gym_session
SESSION_TTL_DAYS=7
```

⚠️ **Importante:** Usa la `service_role_key`, NO la `anon_key`

---

## 🧪 Paso 4: Verificar Configuración

Ejecuta el script de verificación:

```bash
npm run check:supabase
```

Este script verificará:
- ✅ Variables de entorno
- ✅ Conexión a Supabase
- ✅ Existencia de tablas
- ✅ Usuarios registrados

Si todo está bien, verás mensajes en verde ✅

---

## 🏃 Paso 5: Ejecutar el Proyecto

### Iniciar servidor de desarrollo:

```bash
npm run dev
```

### Acceder al panel de admin:

```
http://localhost:3000/admin
```

---

## 🎯 Uso del Panel Admin

### 1. Crear Usuario

1. Completa el formulario en el panel izquierdo
2. El DNI es obligatorio (debe ser único)
3. Haz clic en "Crear Usuario"
4. **Importante:** Copia el PIN que aparece (solo se muestra una vez)
5. Comparte el PIN con el usuario

### 2. Listar Usuarios

- La tabla de la derecha muestra todos los usuarios activos
- Se actualiza automáticamente después de crear/eliminar

### 3. Eliminar Usuario

1. Haz clic en el icono de papelera 🗑️
2. Confirma la acción en el diálogo
3. El usuario se marca como eliminado (soft delete)
4. Todas sus sesiones se revocan automáticamente

---

## 🔧 Troubleshooting

### Error: "No autorizado"

**Problema:** No tienes una sesión válida de admin

**Solución:**
1. Necesitas implementar el sistema de login (no incluido aún)
2. O crear una sesión manualmente en Supabase:

```sql
-- Obtener ID del admin
SELECT id FROM profiles WHERE dni = 'ADMIN001';

-- Crear sesión (usa el ID obtenido)
INSERT INTO sessions (profile_id, token_hash, expires_at)
VALUES (
  'id-del-admin-aqui',
  'test_session_token',
  NOW() + INTERVAL '7 days'
);
```

3. Agrega la cookie manualmente en el navegador:
   - Nombre: `gym_session`
   - Valor: `test_session_token`
   - Path: `/`

### Error: "fetch failed" o "Error conectando a la base de datos"

**Problema:** No se puede conectar a Supabase

**Soluciones:**
1. Verifica que tu proyecto de Supabase esté activo (no pausado)
2. Verifica las credenciales en `.env.local`
3. Asegúrate de usar la `service_role_key`, no la `anon_key`
4. Verifica tu conexión a internet

### Error: "Ya existe un usuario con ese DNI"

**Problema:** El DNI ya está registrado

**Soluciones:**
1. Usa un DNI diferente
2. O restaura el usuario si fue eliminado:
```sql
UPDATE profiles
SET deleted_at = NULL
WHERE dni = '12345678A';
```

### La tabla de usuarios está vacía

**Problema:** Las tablas no se crearon o no hay usuarios

**Soluciones:**
1. Ejecuta `supabase-setup.sql` en Supabase
2. Crea al menos un usuario admin (ver Paso 2)
3. Verifica con `npm run check:supabase`

---

## 📚 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `lib/supabase-admin.ts` | Cliente Supabase con service role |
| `lib/auth-admin.ts` | Validación de sesiones admin |
| `app/api/admin/create-user/route.ts` | Endpoint crear usuario |
| `app/api/admin/users/route.ts` | Endpoint listar usuarios |
| `app/api/admin/delete-user/route.ts` | Endpoint eliminar usuario |
| `app/admin/page.tsx` | UI del panel admin |
| `supabase-setup.sql` | Script SQL de inicialización |
| `scripts/generate-pin-hash.js` | Generador de hash de PIN |
| `scripts/check-supabase-config.js` | Verificador de configuración |

---

## 🎓 Próximos Pasos

Una vez que el panel admin funcione, considera implementar:

1. **Sistema de Login Real**
   - Endpoint `POST /api/auth/login` (DNI + PIN)
   - Endpoint `POST /api/auth/logout`
   - Middleware de protección de rutas

2. **Gestión de Clases**
   - CRUD de clases
   - Asignación de profesores
   - Control de capacidad

3. **Sistema de Reservas**
   - Los usuarios pueden reservar clases
   - Cancelación de reservas
   - Lista de espera

4. **Panel de Usuario (no admin)**
   - Ver clases disponibles
   - Reservar/cancelar
   - Ver historial

5. **Sistema de Pagos/Cuotas**
   - Registro de pagos mensuales
   - Estado de cuenta
   - Recordatorios

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa la consola del navegador (F12)
2. Revisa los logs del servidor (`npm run dev`)
3. Ejecuta `npm run check:supabase`
4. Verifica los logs de Supabase Dashboard

---

## 🔒 Seguridad

**Recuerda:**
- ✅ Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` al cliente
- ✅ Los PINs se hashean con bcrypt antes de guardar
- ✅ Las sesiones tienen expiración
- ✅ Los usuarios eliminados son soft delete
- ✅ Todas las operaciones admin requieren autenticación

**Antes de producción:**
- [ ] Implementar rate limiting
- [ ] Configurar CORS apropiadamente
- [ ] Habilitar logs y monitoreo
- [ ] Implementar middleware de autenticación
- [ ] Revisar políticas RLS de Supabase

---

¡Listo! 🎉 El panel de administración está configurado y funcionando.
