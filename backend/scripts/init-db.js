/**
 * Script de inicialización de la base de datos.
 * Crea todas las tablas necesarias si no existen.
 *
 * Uso:
 *   node scripts/init-db.js
 *
 * Requiere DATABASE_URL o las variables DB_* definidas en .env
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { Pool } = require('pg');

const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'chelsancars_db',
    };

const pool = new Pool(poolConfig);

async function initDB() {
  const client = await pool.connect();

  try {
    console.log('🔧 Iniciando creación de tablas...\n');

    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id            SERIAL PRIMARY KEY,
        username      VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        email         VARCHAR(255),
        role          VARCHAR(50)  DEFAULT 'admin',
        is_active     BOOLEAN      DEFAULT true,
        created_at    TIMESTAMP    DEFAULT NOW()
      );
    `);
    console.log('✅ Tabla admin_users creada (o ya existía)');

    await client.query(`
      CREATE TABLE IF NOT EXISTS inspections (
        id              SERIAL PRIMARY KEY,
        client_name     VARCHAR(255)  NOT NULL,
        client_phone    VARCHAR(50),
        client_email    VARCHAR(255),
        vehicle_make    VARCHAR(100)  NOT NULL,
        vehicle_model   VARCHAR(100)  NOT NULL,
        vehicle_year    INTEGER,
        license_plate   VARCHAR(20)   NOT NULL,
        vin             VARCHAR(50),
        mileage         INTEGER,
        inspection_date DATE,
        overall_status  VARCHAR(50),
        data_json       JSONB,
        created_by      VARCHAR(100),
        created_at      TIMESTAMP     DEFAULT NOW(),
        updated_at      TIMESTAMP     DEFAULT NOW()
      );
    `);
    console.log('✅ Tabla inspections creada (o ya existía)');

    console.log('\n🎉 Base de datos inicializada correctamente.');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

initDB();
