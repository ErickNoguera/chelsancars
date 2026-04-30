require('dotenv').config();
const { query, closePool } = require('../src/db');

async function migrar() {
  console.log('Eliminando restricción UNIQUE de license_plate...');
  try {
    // Elimina el constraint único (PostgreSQL lo crea como inspections_license_plate_key)
    await query(`
      ALTER TABLE inspections
      DROP CONSTRAINT IF EXISTS inspections_license_plate_key;
    `);
    console.log('✅ Restricción UNIQUE eliminada correctamente.');

    // El índice de búsqueda rápida lo dejamos (idx_license_plate), solo ya no es único
    console.log('✅ El índice idx_license_plate sigue activo para búsquedas rápidas.');
  } catch (error) {
    console.error('❌ Error en la migración:', error.message);
  } finally {
    await closePool();
  }
}

migrar();
