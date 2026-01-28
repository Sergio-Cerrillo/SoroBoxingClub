/**
 * Script para generar hash de PIN con bcrypt
 * Uso: node scripts/generate-pin-hash.js [pin]
 * 
 * Ejemplo:
 *   node scripts/generate-pin-hash.js 123456
 */

const bcrypt = require('bcryptjs');

async function generatePinHash(pin) {
    if (!pin) {
        console.error('❌ Error: Debes proporcionar un PIN');
        console.log('');
        console.log('Uso: node scripts/generate-pin-hash.js [pin]');
        console.log('Ejemplo: node scripts/generate-pin-hash.js 123456');
        process.exit(1);
    }

    if (!/^\d{6}$/.test(pin)) {
        console.error('❌ Error: El PIN debe tener exactamente 6 dígitos numéricos');
        process.exit(1);
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(pin, saltRounds);

    console.log('');
    console.log('✅ Hash generado correctamente:');
    console.log('');
    console.log('PIN:    ', pin);
    console.log('Hash:   ', hash);
    console.log('');
    console.log('📋 SQL para insertar usuario admin:');
    console.log('');
    console.log(`INSERT INTO profiles (dni, role, pin_hash, first_name, last_name)`);
    console.log(`VALUES ('ADMIN001', 'admin', '${hash}', 'Admin', 'Sistema');`);
    console.log('');
}

const pin = process.argv[2];
generatePinHash(pin);
