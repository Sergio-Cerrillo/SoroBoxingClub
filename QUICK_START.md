# 🚀 INICIO RÁPIDO - 5 Pasos

## ⚡ Para empezar en menos de 5 minutos

### 1️⃣ Inicializar Base de Datos

**En Supabase Dashboard → SQL Editor:**

```sql
-- Copiar y pegar todo el contenido de supabase-setup.sql
-- Ejecutar
```

✅ Esto crea todas las tablas, índices y funciones necesarias.

---

### 2️⃣ Crear Usuario Admin

**En tu terminal:**

```bash
npm run generate:pin 123456
```

**Copiar el SQL que aparece y ejecutarlo en Supabase:**

```sql
INSERT INTO profiles (dni, role, pin_hash, first_name, last_name)
VALUES ('ADMIN001', 'admin', '$2a$10$...', 'Admin', 'Sistema');
```

✅ Ya tienes un usuario admin con PIN: 123456

---

### 3️⃣ Crear Sesión de Prueba

**En Supabase SQL Editor:**

```sql
INSERT INTO sessions (profile_id, token_hash, expires_at)
SELECT 
  id,
  'test_session_12345',
  NOW() + INTERVAL '7 days'
FROM profiles 
WHERE dni = 'ADMIN001';
```

✅ Sesión válida por 7 días

---

### 4️⃣ Agregar Cookie en el Navegador

**Abre tu navegador → DevTools (F12) → Console:**

```javascript
document.cookie = "gym_session=test_session_12345; path=/";
```

✅ Cookie configurada

---

### 5️⃣ Iniciar y Acceder

**En tu terminal:**

```bash
npm run dev
```

**Abre en tu navegador:**

```
http://localhost:3000/admin
```

✅ ¡Panel de admin funcionando!

---

## ✅ Verifica que Todo Funcione

### Crear Usuario de Prueba

1. Completa el formulario con:
   - DNI: `12345678A`
   - Nombre: `Juan`
   - Apellidos: `García`
   - Email: `juan@test.com`
   - Teléfono: `600111222`

2. Haz clic en **"Crear Usuario"**

3. Deberías ver:
   - ✅ Mensaje de éxito
   - ✅ PIN generado (cópialo)
   - ✅ Usuario aparece en la tabla

### Eliminar Usuario

1. Haz clic en el botón 🗑️ de papelera
2. Confirma la acción
3. El usuario desaparece de la tabla

---

## 🐛 Si Algo Falla

### Problema: "No autorizado"

```bash
# Verifica que la sesión exista
# En Supabase SQL Editor:
SELECT * FROM sessions WHERE token_hash = 'test_session_12345';
```

### Problema: "Error conectando a BD"

```bash
# Verifica tu configuración
npm run check:supabase
```

### Problema: "Tablas no encontradas"

```bash
# Ejecuta supabase-setup.sql en Supabase SQL Editor
```

---

## 📚 Siguiente Paso: Implementar Login Real

Lee el archivo: **`LOGIN_IMPLEMENTATION_EXAMPLE.ts`**

Contiene todo el código necesario para implementar:
- Login con DNI + PIN
- Logout
- Middleware de protección
- Página de login

---

## 🎯 Resumen de Comandos

```bash
# Verificar configuración
npm run check:supabase

# Generar hash de PIN
npm run generate:pin 123456

# Iniciar servidor
npm run dev

# Build de producción
npm run build
```

---

## 📖 Documentación Completa

- **README.md** - Documentación general
- **SETUP_GUIDE.md** - Guía detallada paso a paso
- **ADMIN_SETUP.md** - Documentación técnica
- **API_EXAMPLES.md** - Ejemplos de uso de endpoints
- **IMPLEMENTATION_SUMMARY.md** - Resumen de lo implementado
- **FILES_CREATED.md** - Lista de archivos creados

---

## 🎉 ¡Listo!

Ya puedes:
- ✅ Crear usuarios con PIN automático
- ✅ Ver lista de usuarios activos
- ✅ Eliminar usuarios (soft delete)
- ✅ Copiar PINs al portapapeles

**El panel de admin está 100% funcional** 🚀
