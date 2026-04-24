/**
 * ========================================
 * INICIALIZACIÓN DE BASE DE DATOS
 * ========================================
 * 
 * Este archivo prepara la estructura de la BD.
 * Se ejecutará en PASO 3 para crear tablas.
 * 
 * ESTRUCTURA PREPARADA:
 * - inspections: tabla principal de reportes
 * - admin_users: tabla de admins (para futuro)
 * - inspection_history: tabla de auditoría (opcional)
 */

const { query } = require('./index');

/**
 * CREAR TABLA: inspections
 * 
 * Almacena todos los reportes de inspección vehicular
 * con persistencia real en PostgreSQL
 */
async function createInspectionsTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS inspections (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      
      -- Información del cliente
      client_name VARCHAR(255) NOT NULL,
      client_phone VARCHAR(20),
      client_email VARCHAR(255),
      
      -- Información del vehículo
      vehicle_make VARCHAR(100) NOT NULL,
      vehicle_model VARCHAR(100) NOT NULL,
      vehicle_year VARCHAR(4),
      license_plate VARCHAR(20) NOT NULL UNIQUE,
      vin VARCHAR(50),
      mileage VARCHAR(20),
      
      -- Datos de inspección
      inspection_date DATE NOT NULL,
      overall_status VARCHAR(50),
      
      -- Datos en JSON (flexible para múltiples campos)
      data_json JSONB,
      
      -- Campos de auditoría
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by VARCHAR(255),
      
      -- Índices para búsquedas rápidas
      INDEX idx_license_plate (license_plate),
      INDEX idx_client_name (client_name),
      INDEX idx_created_at (created_at)
    );
  `;

  try {
    await query(createTableSQL);
    console.log("✅ Tabla 'inspections' lista (o ya existe)");
    return true;
  } catch (error) {
    console.error("❌ Error creando tabla inspections:", error.message);
    return false;
  }
}

/**
 * CREAR TABLA: admin_users (Preparada para futuro)
 */
async function createAdminUsersTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS admin_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      role VARCHAR(50) DEFAULT 'admin',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await query(createTableSQL);
    console.log("✅ Tabla 'admin_users' lista (o ya existe)");
    return true;
  } catch (error) {
    console.error("❌ Error creando tabla admin_users:", error.message);
    return false;
  }
}

/**
 * EJECUTAR TODAS LAS INICIALIZACIONES
 */
async function initializeDatabase() {
  console.log("📍 Inicializando estructura de base de datos...\n");

  const results = await Promise.all([
    createInspectionsTable(),
    createAdminUsersTable(),
  ]);

  if (results.every((r) => r)) {
    console.log("\n✅ Base de datos inicializada correctamente");
    return true;
  } else {
    console.log("\n⚠️  Algunos errores en inicialización");
    return false;
  }
}

module.exports = {
  initializeDatabase,
  createInspectionsTable,
  createAdminUsersTable,
};
