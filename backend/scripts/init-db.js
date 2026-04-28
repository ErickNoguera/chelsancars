#!/usr/bin/env node

/**
 * ========================================
 * SCRIPT: Inicializar Base de Datos
 * ========================================
 * 
 * Uso:
 *   node scripts/init-db.js
 * 
 * Este script:
 * 1. Carga variables de entorno desde .env
 * 2. Se conecta a PostgreSQL
 * 3. Crea las tablas inspections y admin_users
 * 4. Crea todos los índices necesarios
 * 5. Muestra confirmación de éxito o error
 */

// Cargar variables de entorno
require("dotenv").config();

const { testConnection, closePool } = require("../src/db");
const { initializeDatabase } = require("../src/db/initialize");

/**
 * Función principal para ejecutar inicialización
 */
async function main() {
  console.log("\n🚀 Iniciando script de inicialización de base de datos...\n");

  try {
    // PASO 1: Probar conexión a PostgreSQL
    console.log("🔗 PASO 1: Verificando conexión a PostgreSQL...\n");
    const connected = await testConnection();

    if (!connected) {
      console.error("\n❌ NO se puede conectar a PostgreSQL");
      console.error("\n📋 Verificar:");
      console.error("   1. PostgreSQL está corriendo");
      console.error("   2. Las variables de .env son correctas:");
      console.error(`      DB_HOST=${process.env.DB_HOST}`);
      console.error(`      DB_PORT=${process.env.DB_PORT}`);
      console.error(`      DB_USER=${process.env.DB_USER}`);
      console.error(`      DB_NAME=${process.env.DB_NAME}`);
      process.exit(1);
    }

    // PASO 2: Inicializar base de datos
    console.log("\n🗂️  PASO 2: Creando tablas e índices...\n");
    const initSuccess = await initializeDatabase();

    if (!initSuccess) {
      console.error("\n❌ Error durante la inicialización");
      process.exit(1);
    }

    console.log("✅ Script completado exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR en el script:", error.message);
    process.exit(1);
  } finally {
    // Cerrar pool de conexiones
    await closePool();
  }
}

// Ejecutar
main();
