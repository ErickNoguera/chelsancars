/**
 * ========================================
 * PUNTO DE ENTRADA PRINCIPAL DEL SERVIDOR
 * ========================================
 * 
 * Este archivo:
 * 1. Carga variables de entorno (.env)
 * 2. Configura Express y middlewares
 * 3. Define rutas
 * 4. Inicia el servidor
 * 5. Maneja errores globales
 */

// ========== PASO 1: CARGAR VARIABLES DE ENTORNO ==========
// CRÍTICO: Debe ser lo PRIMERO antes de usar process.env en otro archivo
require("dotenv").config();

// ========== PASO 2: IMPORTAR DEPENDENCIAS ==========
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { testConnection, closePool } = require("./src/db");

// ========== IMPORTAR RUTAS ==========
const adminRoutes = require("./src/routes/admin.routes");
const inspeccionRoutes = require("./src/routes/inspection.routes");
const aiRoutes = require("./src/routes/ai.routes");

// ========== PASO 3: OBTENER CONFIGURACIÓN ==========
// Solo después de cargar dotenv podemos acceder a process.env
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ========== PASO 4: INICIALIZAR EXPRESS ==========
const app = express();

// ========== PASO 5: CONFIGURAR MIDDLEWARES ==========
app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (ej: Postman, curl, mismo servidor)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origen no permitido → ${origin}`));
  },
  credentials: true,
}));

// JSON Parser: Convierte body JSON a objetos JavaScript
app.use(express.json());

// ========== PASO 6: DEFINIR RUTAS ==========
// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API funcionando 🚀",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ========== RUTAS ADMIN ==========
// Autenticación y administración
app.use("/admin", adminRoutes);

// ========== RUTAS DE INSPECCIONES ==========
// CRUD completo - requieren JWT (verifyToken aplicado dentro de las rutas)
app.use("/api/inspections", inspeccionRoutes);

// ========== RUTAS DE IA ==========
app.use("/api/ai", aiRoutes);

// ========== PASO 7: MIDDLEWARE PARA RUTAS NO ENCONTRADAS ==========
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
    method: req.method,
    path: req.path,
  });
});

// ========== PASO 8: MIDDLEWARE PARA ERRORES GLOBAL ==========
app.use((err, req, res, next) => {
  if (NODE_ENV === "development") {
    console.error("❌ Error:", err);
  } else {
    console.error("❌ Error:", err.message);
  }

  res.status(err.status || 500).json({
    success: false,
    message: "Error interno del servidor",
    error: NODE_ENV === "development" ? err.message : "Error del servidor",
  });
});

// ========== PASO 9: INICIAR SERVIDOR ==========
// Exportar app para tests (supertest no necesita que el servidor esté escuchando)
if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`
╔════════════════════════════════════════╗
║  🚀 SERVIDOR CHELSAN CARS INICIADO    ║
╠════════════════════════════════════════╣
║  Ambiente: ${NODE_ENV.padEnd(28)} ║
║  Puerto: ${String(PORT).padEnd(32)} ║
║  URL: http://localhost:${String(PORT).padEnd(26)} ║
╚════════════════════════════════════════╝
    `);

    // ========== PASO 10: PROBAR CONEXIÓN A PostgreSQL ==========
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.warn("⚠️  ADVERTENCIA: No se pudo conectar a PostgreSQL");
      console.warn("   La API funcionará pero sin persistencia en base de datos");
    }
  });

  // ========== PASO 11: MANEJO DE CIERRE GRACEFUL ==========
  process.on("SIGTERM", async () => {
    console.log("📍 Señal SIGTERM recibida, cerrando servidor...");
    await closePool();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    console.log("📍 Señal SIGINT recibida, cerrando servidor...");
    await closePool();
    process.exit(0);
  });
}

// Manejo de errores no capturados (por si acaso)
process.on("unhandledRejection", (err) => {
  console.error("⚠️  Rechazo no manejado:", err);
});

module.exports = app;