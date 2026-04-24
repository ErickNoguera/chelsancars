/**
 * ========================================
 * CONEXIÓN A POSTGRESQL CON POOL
 * ========================================
 * 
 * Este archivo centraliza la conexión a PostgreSQL.
 * Usa pg.Pool para conexiones eficientes y reutilizables.
 * 
 * IMPORTANTE:
 * - Pool gestiona automáticamente las conexiones
 * - Reutiliza conexiones para mejor rendimiento
 * - MAX 10 conexiones simultáneas por defecto
 * - Ideal para aplicaciones Node.js en producción
 */

const { Pool } = require("pg");

/**
 * PASO 1: Obtener variables de entorno
 * 
 * Estas variables DEBEN estar definidas en .env
 * Si no existen, se usan valores por defecto (para desarrollo local)
 */
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "chelsancars_db",
  // Configuraciones avanzadas (opcionales)
  max: 10,                    // Máximo de conexiones en el pool
  idleTimeoutMillis: 30000,   // Cerrar conexión después de 30s inactiva
  connectionTimeoutMillis: 5000, // Timeout de conexión 5s
});

/**
 * PASO 2: Listeners para eventos del Pool
 * 
 * Detectan errores de conexión automáticos
 */
pool.on("error", (err) => {
  console.error("❌ ERROR NO ESPERADO en el pool de conexiones:", err);
  process.exit(1);
});

pool.on("connect", () => {
  console.log("✅ Nueva conexión establecida al pool");
});

/**
 * PASO 3: Función para ejecutar queries de forma segura
 * 
 * Uso:
 * const result = await query("SELECT * FROM inspections WHERE id = $1", [id]);
 * 
 * @param {string} text - SQL query con parámetros $1, $2, etc
 * @param {array} params - Valores para los parámetros
 * @returns {object} Resultado de la query
 */
async function query(text, params = []) {
  const start = Date.now();
  
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log para debugging (solo en desarrollo)
    if (process.env.NODE_ENV === "development") {
      console.log("📊 Query ejecutada:", { text, duration, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    console.error("❌ Error en query:", { text, error: error.message });
    throw error;
  }
}

/**
 * PASO 4: Función para probar conexión
 * 
 * Se ejecuta al iniciar el servidor para verificar que PostgreSQL está disponible
 */
async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ CONEXIÓN A POSTGRESQL EXITOSA");
    console.log(`   ├─ Host: ${process.env.DB_HOST || "localhost"}`);
    console.log(`   ├─ Puerto: ${process.env.DB_PORT || 5432}`);
    console.log(`   ├─ BD: ${process.env.DB_NAME || "chelsancars_db"}`);
    console.log(`   ├─ Usuario: ${process.env.DB_USER || "postgres"}`);
    console.log(`   └─ Timestamp servidor: ${result.rows[0].now}`);
    return true;
  } catch (error) {
    console.error("❌ ERROR CONECTANDO A POSTGRESQL");
    console.error(`   ├─ Mensaje: ${error.message}`);
    console.error(`   ├─ Host: ${process.env.DB_HOST || "localhost"}`);
    console.error(`   └─ Puerto: ${process.env.DB_PORT || 5432}`);
    return false;
  }
}

/**
 * PASO 5: Función para cerrar el pool
 * 
 * Se ejecuta cuando el servidor se detiene gracefully
 */
async function closePool() {
  try {
    await pool.end();
    console.log("✅ Pool de conexiones cerrado");
  } catch (error) {
    console.error("❌ Error cerrando pool:", error);
  }
}

/**
 * EXPORTAR funciones públicas
 */
module.exports = {
  pool,           // El pool de conexiones (para usos avanzados)
  query,          // Función para ejecutar queries
  testConnection, // Función para probar la conexión
  closePool,      // Función para cerrar pool
};
