# Ejemplos de Uso - API Endpoints Admin

Este documento contiene ejemplos prácticos de cómo usar los endpoints del panel de administración.

## 🔐 Autenticación

Todos los endpoints requieren una sesión válida con rol `admin`. La sesión se valida mediante una cookie `gym_session`.

## 📡 Endpoints

### 1. Crear Usuario

**Endpoint:** `POST /api/admin/create-user`

**Descripción:** Crea un nuevo usuario con rol 'client' y genera un PIN automático de 6 dígitos.

**Request Body:**
```json
{
  "dni": "12345678A",
  "first_name": "Juan",
  "last_name": "García López",
  "email": "juan@example.com",
  "phone": "+34 600 111 222"
}
```

**Campos:**
- `dni` (obligatorio): DNI del usuario, debe ser único
- `first_name` (opcional): Nombre del usuario
- `last_name` (opcional): Apellidos del usuario
- `email` (opcional): Email del usuario
- `phone` (opcional): Teléfono del usuario

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "dni": "12345678A",
    "first_name": "Juan",
    "last_name": "García López",
    "email": "juan@example.com",
    "phone": "+34 600 111 222",
    "role": "client",
    "created_at": "2025-01-26T10:30:00.000Z",
    "updated_at": "2025-01-26T10:30:00.000Z",
    "deleted_at": null
  },
  "pin": "123456"
}
```

⚠️ **Importante:** El PIN solo se muestra una vez. Guárdalo o comunícaselo al usuario inmediatamente.

**Response (400) - DNI vacío:**
```json
{
  "error": "El DNI es obligatorio."
}
```

**Response (409) - DNI duplicado:**
```json
{
  "error": "Ya existe un usuario con ese DNI."
}
```

**Response (401) - No autorizado:**
```json
{
  "error": "No autorizado. Se requiere rol de administrador."
}
```

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost:3000/api/admin/create-user \
  -H "Content-Type: application/json" \
  -H "Cookie: gym_session=your_session_token" \
  -d '{
    "dni": "12345678A",
    "first_name": "Juan",
    "last_name": "García López",
    "email": "juan@example.com",
    "phone": "+34 600 111 222"
  }'
```

**Ejemplo con JavaScript:**
```javascript
const response = await fetch('/api/admin/create-user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    dni: '12345678A',
    first_name: 'Juan',
    last_name: 'García López',
    email: 'juan@example.com',
    phone: '+34 600 111 222',
  }),
});

const data = await response.json();

if (response.ok) {
  console.log('Usuario creado:', data.user);
  console.log('PIN generado:', data.pin);
  // ⚠️ Guarda el PIN inmediatamente
} else {
  console.error('Error:', data.error);
}
```

---

### 2. Listar Usuarios

**Endpoint:** `GET /api/admin/users`

**Descripción:** Obtiene la lista de todos los usuarios activos (no eliminados).

**Request:** No requiere parámetros

**Response (200):**
```json
{
  "users": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "dni": "12345678A",
      "first_name": "Juan",
      "last_name": "García López",
      "email": "juan@example.com",
      "phone": "+34 600 111 222",
      "role": "client",
      "created_at": "2025-01-26T10:30:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "dni": "87654321B",
      "first_name": "María",
      "last_name": "Rodríguez",
      "email": "maria@example.com",
      "phone": "+34 600 222 333",
      "role": "client",
      "created_at": "2025-01-25T15:20:00.000Z"
    }
  ]
}
```

**Notas:**
- Los usuarios están ordenados por fecha de creación (más recientes primero)
- Solo se muestran usuarios donde `deleted_at IS NULL`
- No se incluye el campo `pin_hash` por seguridad

**Response (401) - No autorizado:**
```json
{
  "error": "No autorizado. Se requiere rol de administrador."
}
```

**Ejemplo con cURL:**
```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "Cookie: gym_session=your_session_token"
```

**Ejemplo con JavaScript:**
```javascript
const response = await fetch('/api/admin/users');
const data = await response.json();

if (response.ok) {
  console.log('Usuarios activos:', data.users.length);
  data.users.forEach(user => {
    console.log(`${user.dni} - ${user.first_name} ${user.last_name}`);
  });
} else {
  console.error('Error:', data.error);
}
```

---

### 3. Eliminar Usuario

**Endpoint:** `POST /api/admin/delete-user`

**Descripción:** Realiza un soft delete del usuario (actualiza `deleted_at` y revoca sesiones).

**Request Body:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Usuario eliminado correctamente."
}
```

**Response (400) - Usuario ya eliminado:**
```json
{
  "error": "El usuario ya está marcado como eliminado."
}
```

**Response (404) - Usuario no encontrado:**
```json
{
  "error": "Usuario no encontrado."
}
```

**Response (401) - No autorizado:**
```json
{
  "error": "No autorizado. Se requiere rol de administrador."
}
```

**Comportamiento:**
- Actualiza `deleted_at` con la fecha actual
- Revoca todas las sesiones activas del usuario
- El usuario NO se elimina físicamente de la BD

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost:3000/api/admin/delete-user \
  -H "Content-Type: application/json" \
  -H "Cookie: gym_session=your_session_token" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Ejemplo con JavaScript:**
```javascript
const userId = '550e8400-e29b-41d4-a716-446655440000';

const response = await fetch('/api/admin/delete-user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ userId }),
});

const data = await response.json();

if (response.ok) {
  console.log('Usuario eliminado correctamente');
} else {
  console.error('Error:', data.error);
}
```

---

## 🧪 Testing con Postman

### Collection Setup

1. **Variables de entorno:**
   - `baseUrl`: `http://localhost:3000`
   - `sessionToken`: Tu token de sesión admin

2. **Headers globales:**
   ```
   Cookie: gym_session={{sessionToken}}
   Content-Type: application/json
   ```

### Requests

#### 1. Create User
```
POST {{baseUrl}}/api/admin/create-user
Body (JSON):
{
  "dni": "12345678A",
  "first_name": "Test",
  "last_name": "User",
  "email": "test@example.com",
  "phone": "+34 600 000 000"
}
```

#### 2. List Users
```
GET {{baseUrl}}/api/admin/users
```

#### 3. Delete User
```
POST {{baseUrl}}/api/admin/delete-user
Body (JSON):
{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## 🔧 Troubleshooting

### Error: "No autorizado"
**Causa:** No tienes una sesión válida o tu usuario no tiene rol 'admin'

**Solución:**
1. Verifica que la cookie `gym_session` esté configurada
2. Verifica que tu usuario tiene `role='admin'` en la tabla profiles
3. Verifica que la sesión no haya expirado

### Error: "Ya existe un usuario con ese DNI"
**Causa:** El DNI ya está registrado en la base de datos

**Solución:**
1. Usa un DNI diferente
2. O recupera el usuario existente si fue eliminado:
   ```sql
   UPDATE profiles SET deleted_at = NULL WHERE dni = '12345678A';
   ```

### Error: "Usuario no encontrado"
**Causa:** El ID proporcionado no existe o el usuario está eliminado

**Solución:**
1. Verifica el ID del usuario
2. Usa `GET /api/admin/users` para obtener IDs válidos

---

## 📊 Queries SQL Útiles

### Ver todos los usuarios (incluyendo eliminados)
```sql
SELECT id, dni, first_name, last_name, role, deleted_at, created_at
FROM profiles
ORDER BY created_at DESC;
```

### Ver solo usuarios activos
```sql
SELECT id, dni, first_name, last_name, role, created_at
FROM profiles
WHERE deleted_at IS NULL
ORDER BY created_at DESC;
```

### Restaurar usuario eliminado
```sql
UPDATE profiles
SET deleted_at = NULL
WHERE dni = '12345678A';
```

### Ver sesiones activas
```sql
SELECT s.id, s.token_hash, p.dni, p.role, s.expires_at
FROM sessions s
JOIN profiles p ON s.profile_id = p.id
WHERE s.revoked_at IS NULL
  AND s.expires_at > NOW()
ORDER BY s.created_at DESC;
```
