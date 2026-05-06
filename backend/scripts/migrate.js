/**
 * Sistema de migraciones.
 * Lee archivos .sql de /migrations en orden numérico y aplica los pendientes.
 *
 * Uso:
 *   node scripts/migrate.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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
const MIGRATIONS_DIR = path.join(__dirname, '../migrations');

async function run() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT NOW()
      );
    `);

    const { rows: applied } = await client.query('SELECT name FROM migrations ORDER BY name');
    const appliedSet = new Set(applied.map((r) => r.name));

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    const pending = files.filter((f) => !appliedSet.has(f));

    if (pending.length === 0) {
      console.log('✅ No hay migraciones pendientes.');
      return;
    }

    for (const file of pending) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      console.log(`⏳ Aplicando ${file}...`);
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`✅ ${file} aplicada`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ Error en ${file}: ${err.message}`);
        process.exit(1);
      }
    }

    console.log('\n🎉 Migraciones completadas.');
  } finally {
    client.release();
    await pool.end();
  }
}

run();
