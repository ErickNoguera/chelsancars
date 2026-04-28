/**
 * ========================================
 * INICIALIZACIÓN DE BASE DE DATOS
 * ========================================
 * 
 * Este archivo crea las tablas en PostgreSQL.
 * 
 * TABLAS A CREAR:
 * - inspections: tabla principal de reportes vehiculares
 * - admin_users: tabla de administradores
 * - ÍNDICES en campos clave para búsquedas rápidas
 * 
 * EXTENSIONES REQUERIDAS:
 * - pgcrypto: para gen_random_uuid()
 */

const { query } = require('./index');

// ========== EXTENSIONES POSTGRESQL ==========

/**
 * Habilita la extensión pgcrypto necesaria para gen_random_uuid()
 * 
 * IMPORTANTE:
 * ├─ pgcrypto proporciona gen_random_uuid()
 * ├─ Debe ejecutarse ANTES de crear tablas con UUID
 * ├─ Idempotente: puede ejecutarse múltiples veces
 * └─ Requiere permisos de superusuario en algunos casos
 */
async function enablePgcryptoExtension() {
  const extensionSQL = `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`;

  try {
    await query(extensionSQL);
    console.log("  ✅ Extensión 'pgcrypto' habilitada o ya existe");
    return true;
  } catch (error) {
    console.error("  ❌ Error habilitando pgcrypto:", error.message);
    console.error("     Nota: Necesita permisos de superusuario");
    return false;
  }
}

// ========== TABLA 1: INSPECTIONS ==========

/**
 * Crea tabla inspections para almacenar reportes de inspección
 * 
 * CAMPOS:
 * ├─ id: UUID único (más seguro que serial/autoincrement)
 * ├─ client_name, client_phone, client_email: datos cliente
 * ├─ vehicle_make, vehicle_model, vehicle_year: datos vehículo
 * ├─ license_plate: UNIQUE (para búsquedas rápidas)
 * ├─ vin, mileage: datos técnicos
 * ├─ inspection_date: TIMESTAMP de la inspección
 * ├─ overall_status: estado general (Óptimo, Aceptable, etc)
 * ├─ data_json: JSONB con todos los campos del formulario
 * ├─ created_at, updated_at: auditoría
 * └─ created_by: quién creó el reporte (admin username)
 */
async function createInspectionsTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS inspections (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      
      -- Información del cliente
      client_name TEXT NOT NULL,
      client_phone TEXT,
      client_email TEXT,
      
      -- Información del vehículo
      vehicle_make TEXT NOT NULL,
      vehicle_model TEXT NOT NULL,
      vehicle_year INTEGER,
      
      license_plate TEXT NOT NULL UNIQUE,
      
      vin TEXT,
      mileage INTEGER,
      
      -- Datos de inspección
      inspection_date TIMESTAMP NOT NULL DEFAULT NOW(),
      overall_status TEXT,
      
      -- Datos JSON con formulario completo (flexible)
      data_json JSONB,
      
      -- Auditoría
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      created_by TEXT
    );
  `;

  try {
    await query(createTableSQL);
    console.log("  ✅ Tabla 'inspections' creada o ya existe");
    return true;
  } catch (error) {
    console.error("  ❌ Error en inspections:", error.message);
    return false;
  }
}

/**
 * Crea índices en tabla inspections para búsquedas rápidas
 */
async function createInspectionsIndexes() {
  const indexes = [
    {
      name: "idx_license_plate",
      sql: `CREATE INDEX IF NOT EXISTS idx_license_plate ON inspections(license_plate);`,
    },
    {
      name: "idx_client_name",
      sql: `CREATE INDEX IF NOT EXISTS idx_client_name ON inspections(client_name);`,
    },
    {
      name: "idx_created_at",
      sql: `CREATE INDEX IF NOT EXISTS idx_created_at ON inspections(created_at DESC);`,
    },
    {
      name: "idx_overall_status",
      sql: `CREATE INDEX IF NOT EXISTS idx_overall_status ON inspections(overall_status);`,
    },
  ];

  let allSuccess = true;

  for (const index of indexes) {
    try {
      await query(index.sql);
      console.log(`  ✅ Índice '${index.name}' creado o ya existe`);
    } catch (error) {
      console.error(`  ❌ Error creando índice '${index.name}':`, error.message);
      allSuccess = false;
    }
  }

  return allSuccess;
}

// ========== TABLA 2: ADMIN_USERS ==========

/**
 * Crea tabla admin_users para almacenar administradores
 * 
 * CAMPOS:
 * ├─ id: UUID único
 * ├─ username: nombre de usuario (UNIQUE)
 * ├─ password_hash: contraseña hasheada con bcrypt
 * ├─ email: correo del admin
 * ├─ role: rol (admin, inspector, etc)
 * ├─ is_active: estado de la cuenta
 * └─ created_at, updated_at: auditoría
 */
async function createAdminUsersTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS admin_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      email TEXT,
      
      role TEXT DEFAULT 'admin',
      is_active BOOLEAN DEFAULT true,
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  try {
    await query(createTableSQL);
    console.log("  ✅ Tabla 'admin_users' creada o ya existe");
    return true;
  } catch (error) {
    console.error("  ❌ Error en admin_users:", error.message);
    return false;
  }
}

/**
 * Crea índices en tabla admin_users
 */
async function createAdminUsersIndexes() {
  const indexes = [
    {
      name: "idx_admin_username",
      sql: `CREATE INDEX IF NOT EXISTS idx_admin_username ON admin_users(username);`,
    },
    {
      name: "idx_admin_is_active",
      sql: `CREATE INDEX IF NOT EXISTS idx_admin_is_active ON admin_users(is_active);`,
    },
  ];

  let allSuccess = true;

  for (const index of indexes) {
    try {
      await query(index.sql);
      console.log(`  ✅ Índice '${index.name}' creado o ya existe`);
    } catch (error) {
      console.error(`  ❌ Error creando índice '${index.name}':`, error.message);
      allSuccess = false;
    }
  }

  return allSuccess;
}

// ========== FUNCIÓN PRINCIPAL: INICIALIZAR BD ==========

/**
 * Ejecuta toda la inicialización de la base de datos
 * 
 * ORDEN CRÍTICO DE EJECUCIÓN:
 * 1. Habilitar extensión pgcrypto (DEBE SER PRIMERO)
 * 2. Crear tabla inspections
 * 3. Crear índices de inspections
 * 4. Crear tabla admin_users
 * 5. Crear índices de admin_users
 * 
 * Si hay error, lo logguea pero continúa (salvo pgcrypto que es crítico)
 */
async function initializeDatabase() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║  📦 INICIALIZANDO BASE DE DATOS      ║");
  console.log("╚════════════════════════════════════════╝\n");

  try {
    // PASO 0: Habilitar extensión pgcrypto (CRÍTICO - DEBE SER PRIMERO)
    console.log("📋 Paso 0/5: Habilitar extensión 'pgcrypto'...");
    const pgcryptoOk = await enablePgcryptoExtension();
    
    if (!pgcryptoOk) {
      console.error("\n❌ NO se pudo habilitar pgcrypto");
      console.error("   Sin pgcrypto, no se pueden crear UUIDs");
      console.error("   Abortando inicialización...\n");
      return false;
    }
    
    // PASO 1: Crear tabla inspections
    console.log("\n📋 Paso 1/5: Crear tabla 'inspections'...");
    const inspectionsTableOk = await createInspectionsTable();
    
    // PASO 2: Crear índices de inspections
    console.log("\n📋 Paso 2/5: Crear índices de 'inspections'...");
    const inspectionsIndexesOk = await createInspectionsIndexes();
    
    // PASO 3: Crear tabla admin_users
    console.log("\n📋 Paso 3/5: Crear tabla 'admin_users'...");
    const adminUsersTableOk = await createAdminUsersTable();
    
    // PASO 4: Crear índices de admin_users
    console.log("\n📋 Paso 4/5: Crear índices de 'admin_users'...");
    const adminUsersIndexesOk = await createAdminUsersIndexes();

    // Resumen final
    console.log("\n╔════════════════════════════════════════╗");
    
    const allSuccess = pgcryptoOk && 
                       inspectionsTableOk && 
                       inspectionsIndexesOk && 
                       adminUsersTableOk && 
                       adminUsersIndexesOk;

    if (allSuccess) {
      console.log("║  ✅ INICIALIZACIÓN EXITOSA           ║");
      console.log("╚════════════════════════════════════════╝");
      console.log("\n📊 Estado de la base de datos:");
      console.log("  ✅ Extensión pgcrypto - HABILITADA");
      console.log("  ✅ Tabla inspections - CREADA");
      console.log("  ✅ Tabla admin_users - CREADA");
      console.log("  ✅ Todos los índices - CREADOS");
      console.log("\n🎯 Backend listo para PASO 4 (Autenticación Admin)\n");
      return true;
    } else {
      console.log("║  ⚠️  INICIALIZACION CON ERRORES       ║");
      console.log("╚════════════════════════════════════════╝");
      console.log("\n❌ Algunos errores ocurrieron durante la inicialización");
      console.log("   Revisa los logs arriba para más detalles\n");
      return false;
    }
  } catch (error) {
    console.error("❌ ERROR CRÍTICO en initializeDatabase:", error);
    return false;
  }
}

module.exports = {
  initializeDatabase,
  enablePgcryptoExtension,
  createInspectionsTable,
  createInspectionsIndexes,
  createAdminUsersTable,
  createAdminUsersIndexes,
};
