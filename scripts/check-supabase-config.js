/**
 * Script para verificar la configuración de Supabase
 * Uso: node scripts/check-supabase-config.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

async function checkSupabaseConfig() {
  console.log('');
  console.log('🔍 Verificando configuración de Supabase...');
  console.log('');

  // 1. Verificar variables de entorno
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error('❌ Error: SUPABASE_URL no está definida en .env.local');
    process.exit(1);
  }

  if (!supabaseServiceRoleKey) {
    console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY no está definida en .env.local');
    process.exit(1);
  }

  console.log('✅ Variables de entorno encontradas');
  console.log(`   SUPABASE_URL: ${supabaseUrl}`);
  console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceRoleKey.substring(0, 20)}...`);
  console.log('');

  // 2. Crear cliente
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log('✅ Cliente Supabase creado correctamente');
    console.log('');

    // 3. Verificar conexión a la base de datos
    console.log('🔌 Verificando conexión a la base de datos...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Error conectando a la base de datos:');
      console.error('   ', error.message);
      console.log('');
      console.log('💡 Posibles causas:');
      console.log('   - Las tablas no han sido creadas (ejecuta supabase-setup.sql)');
      console.log('   - Las credenciales son incorrectas');
      console.log('   - La URL de Supabase es incorrecta');
      console.log('   - El proyecto de Supabase está pausado o no existe');
      console.log('');
      console.log('🔧 Qué hacer:');
      console.log('   1. Verifica que tu proyecto de Supabase esté activo');
      console.log('   2. Ejecuta el SQL de supabase-setup.sql en el editor SQL de Supabase');
      console.log('   3. Verifica las credenciales en .env.local');
      process.exit(1);
    }

    console.log('✅ Conexión exitosa a la base de datos');
    console.log('');

    // 4. Verificar tablas existentes
    console.log('📋 Verificando tablas...');
    
    const tables = ['profiles', 'sessions', 'classes', 'class_bookings'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ Tabla "${table}" no encontrada`);
      } else {
        console.log(`   ✅ Tabla "${table}" existe`);
      }
    }
    
    console.log('');

    // 5. Verificar usuarios existentes
    console.log('👥 Verificando usuarios...');
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, dni, role, first_name, last_name, deleted_at')
      .is('deleted_at', null);

    if (profilesError) {
      console.error('❌ Error al obtener usuarios:', profilesError.message);
    } else if (profiles.length === 0) {
      console.log('   ⚠️  No hay usuarios en la base de datos');
      console.log('');
      console.log('💡 Necesitas crear al menos un usuario admin:');
      console.log('   1. Genera un hash de PIN: node scripts/generate-pin-hash.js 123456');
      console.log('   2. Inserta el usuario en Supabase con el hash generado');
    } else {
      console.log(`   ✅ ${profiles.length} usuario(s) encontrado(s):`);
      profiles.forEach(profile => {
        const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || '(sin nombre)';
        console.log(`      - ${profile.dni} (${profile.role}) - ${fullName}`);
      });
    }

    console.log('');
    console.log('✅ Verificación completada correctamente');
    console.log('');
    console.log('🚀 Siguiente paso:');
    console.log('   npm run dev');
    console.log('   http://localhost:3000/admin');
    console.log('');

  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
    process.exit(1);
  }
}

checkSupabaseConfig();
