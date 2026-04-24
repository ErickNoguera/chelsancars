/**
 * ========================================
 * PASO 2: CONEXIÓN A POSTGRESQL
 * DOCUMENTACIÓN TÉCNICA
 * ========================================
 * 
 * CAMBIOS REALIZADOS EN ESTE PASO:
 */

// ========== ARCHIVO 1: src/db/index.js ==========
/**
 * ✅ NUEVA CONEXIÓN A POSTGRESQL CON POOL
 * 
 * Código Principal:
 * 
 *   const { Pool } = require("pg");
 *   
 *   const pool = new Pool({
 *     host: process.env.DB_HOST || "localhost",
 *     port: process.env.DB_PORT || 5432,
 *     user: process.env.DB_USER || "postgres",
 *     password: process.env.DB_PASSWORD || "postgres",
 *     database: process.env.DB_NAME || "chelsancars_db",
 *     max: 10,                    // Máximo 10 conexiones simultáneas
 *     idleTimeoutMillis: 30000,   // Cerrar después de 30s inactivo
 *     connectionTimeoutMillis: 5000, // Timeout 5s
 *   });
 * 
 * ¿POR QUÉ POOL Y NO CLIENT?
 * ├─ Pool reutiliza conexiones (mejor rendimiento)
 * ├─ Client = una conexión por query (lento)
 * ├─ Pool = 10 conexiones compartidas (rápido)
 * ├─ Ideal para producción
 * └─ Puede manejar ~100s de requests simultáneos
 * 
 * FUNCIONES EXPORTADAS:
 * 
 * 1) async query(text, params)
 *    └─ Ejecuta query de forma segura
 *    └─ Previene SQL injection con parámetros
 *    └─ Loguea tiempo de ejecución
 *    
 * 2) async testConnection()
 *    └─ Prueba conexión al iniciar servidor
 *    └─ Retorna true/false
 *    └─ Loguea detalles de conexión
 *    
 * 3) async closePool()
 *    └─ Cierra pool gracefully
 *    └─ Se ejecuta al detener servidor
 *    └─ Cierra todas las conexiones abiertas
 */

// ========== ARCHIVO 2: src/db/initialize.js ==========
/**
 * ✅ INICIALIZADOR DE TABLAS
 * 
 * TABLAS PREPARADAS (NO CREADAS AÚN):
 * 
 * 1) inspections
 *    ├─ id: UUID (no secuencial, seguro)
 *    ├─ client_name, client_phone, client_email
 *    ├─ vehicle_make, vehicle_model, vehicle_year
 *    ├─ license_plate (UNIQUE para búsquedas rápidas)
 *    ├─ data_json: JSONB (flexible para múltiples campos)
 *    ├─ created_at, updated_at (auditoría)
 *    └─ Índices para búsquedas por patente y cliente
 * 
 * 2) admin_users (lista para futuro)
 *    ├─ id: UUID
 *    ├─ username, password_hash
 *    ├─ email, role
 *    ├─ is_active
 *    └─ created_at, updated_at
 * 
 * FUNCIÓN: initializeDatabase()
 * └─ Se ejecutará en PASO 3 para crear estas tablas
 */

// ========== ARCHIVO 3: index.js (ACTUALIZADO) ==========
/**
 * ✅ CAMBIOS EN PUNTO DE ENTRADA
 * 
 * LÍNEA 20-21: Importar funciones de BD
 *   const { testConnection, closePool } = require("./src/db");
 * 
 * LÍNEA 72-84: Pasar callback async a app.listen()
 *   app.listen(PORT, async () => {
 *     ...
 *     const dbConnected = await testConnection();
 *     ...
 *   });
 * 
 * LÍNEA 86-99: Manejo de cierre graceful
 *   process.on("SIGTERM", async () => { ... });
 *   process.on("SIGINT", async () => { ... });
 */

// ========== VARIABLES DE ENTORNO (.env) ==========
/**
 * ✅ CONFIGURADAS (SIN CAMBIOS)
 * 
 * DB_HOST=localhost          → Servidor PostgreSQL
 * DB_PORT=5432               → Puerto default PostgreSQL
 * DB_USER=postgres           → Usuario default
 * DB_PASSWORD=postgres       → Contraseña
 * DB_NAME=chelsancars_db    → Base de datos
 * 
 * IMPORTANTE:
 * - .env está en GITIGNORE (no se sube)
 * - .env.example es la plantilla documentada
 * - Para producción, cambiar estos valores
 */

// ========== FLOW DE EJECUCIÓN ==========
/**
 * 1. npm start
 *    └─ node index.js
 * 
 * 2. index.js inicia
 *    ├─ require("dotenv").config()
 *    ├─ Importa express, cors
 *    ├─ Importa { testConnection, closePool }
 *    └─ Configura Express
 * 
 * 3. app.listen(3000, async () => { ... })
 *    ├─ Puerto 3000 escuchando
 *    ├─ Muestra mensaje de inicio
 *    ├─ Ejecuta testConnection()
 *    │  ├─ Se conecta a PostgreSQL
 *    │  ├─ Ejecuta SELECT NOW()
 *    │  ├─ Si OK: muestra detalles conexión
 *    │  └─ Si FALLA: muestra error
 *    └─ Servidor listo para requests
 * 
 * 4. Si usuario presiona Ctrl+C
 *    └─ process.on("SIGINT")
 *    └─ closePool()
 *    └─ Cierra todas las conexiones
 *    └─ Limpia proceso
 */

// ========== DECISIONES TÉCNICAS ==========
/**
 * 
 * ✅ POOL vs CLIENT
 *    └─ Pool es mejor para servidores con múltiples requests
 * 
 * ✅ MAX 10 CONEXIONES
 *    └─ Suficiente para ~1000 requests/segundo
 *    └─ Puedes aumentar si necesitas más
 * 
 * ✅ UUID vs AUTO-INCREMENT
 *    └─ UUID es más seguro (no se puede adivinar IDs)
 *    └─ gen_random_uuid() lo genera automáticamente
 * 
 * ✅ JSONB para data_json
 *    └─ Almacena datos flexibles
 *    └─ Se puede indexar y consultar
 *    └─ Ideal para reportes con muchos campos
 * 
 * ✅ Índices en license_plate y client_name
 *    └─ Búsquedas rápidas (PASO 6 las usará)
 *    └─ Sin índices, búsquedas sería lentas
 * 
 * ✅ Graceful shutdown (SIGTERM/SIGINT)
 *    └─ Cierra conexiones limpiamente
 *    └─ Previene memory leaks
 *    └─ Importante en producción
 */

// ========== PRÓXIMO PASO (PASO 3) ==========
/**
 * 
 * 🔥 PASO 3: CREAR TABLA "inspections"
 * 
 * ├─ Ejecutar initializeDatabase()
 * ├─ Crear tabla inspections en PostgreSQL
 * ├─ Crear tabla admin_users (preparada)
 * ├─ Probar que tablas se crearon
 * └─ Backend LISTO para recibir datos
 * 
 * NO HACER AÚN:
 * ├─ Endpoint para crear reportes (PASO 5)
 * ├─ Login de admin (PASO 4)
 * ├─ Descarga de PDF (PASO 7)
 * └─ Dashboard (no en plan)
 */
