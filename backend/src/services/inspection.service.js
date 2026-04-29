const { query } = require('../db');

async function crearInspeccion({ clientName, clientPhone, clientEmail, vehicleMake, vehicleModel, vehicleYear, licensePlate, vin, mileage, inspectionDate, overallStatus, dataJson, createdBy }) {
  const resultado = await query(
    `INSERT INTO inspections
      (client_name, client_phone, client_email, vehicle_make, vehicle_model, vehicle_year,
       license_plate, vin, mileage, inspection_date, overall_status, data_json, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING *`,
    [clientName, clientPhone, clientEmail, vehicleMake, vehicleModel, vehicleYear,
     licensePlate, vin, mileage, inspectionDate || new Date(), overallStatus, dataJson, createdBy]
  );
  return resultado.rows[0];
}

async function obtenerTodasLasInspecciones({ limite = 20, pagina = 1 } = {}) {
  const offset = (pagina - 1) * limite;
  const [filas, conteo] = await Promise.all([
    query(
      `SELECT id, client_name, client_phone, vehicle_make, vehicle_model, vehicle_year,
              license_plate, overall_status, inspection_date, created_at
       FROM inspections
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limite, offset]
    ),
    query('SELECT COUNT(*)::int AS total FROM inspections'),
  ]);
  return { inspecciones: filas.rows, total: conteo.rows[0].total };
}

async function obtenerInspeccionPorId(id) {
  const resultado = await query('SELECT * FROM inspections WHERE id = $1', [id]);
  return resultado.rows[0] || null;
}

// Busca por patente (plate) o nombre de cliente (client)
async function buscarInspecciones({ plate, client }) {
  if (plate) {
    const resultado = await query(
      `SELECT id, client_name, client_phone, vehicle_make, vehicle_model, vehicle_year,
              license_plate, overall_status, inspection_date, created_at
       FROM inspections
       WHERE license_plate ILIKE $1
       ORDER BY created_at DESC`,
      [`%${plate}%`]
    );
    return resultado.rows;
  }
  if (client) {
    const resultado = await query(
      `SELECT id, client_name, client_phone, vehicle_make, vehicle_model, vehicle_year,
              license_plate, overall_status, inspection_date, created_at
       FROM inspections
       WHERE client_name ILIKE $1
       ORDER BY created_at DESC`,
      [`%${client}%`]
    );
    return resultado.rows;
  }
  return [];
}

async function actualizarInspeccion(id, { clientName, clientPhone, clientEmail, vehicleMake, vehicleModel, vehicleYear, licensePlate, vin, mileage, inspectionDate, overallStatus, dataJson }) {
  const resultado = await query(
    `UPDATE inspections
     SET client_name=$1, client_phone=$2, client_email=$3, vehicle_make=$4, vehicle_model=$5,
         vehicle_year=$6, license_plate=$7, vin=$8, mileage=$9, inspection_date=$10,
         overall_status=$11, data_json=$12, updated_at=NOW()
     WHERE id=$13
     RETURNING *`,
    [clientName, clientPhone, clientEmail, vehicleMake, vehicleModel, vehicleYear,
     licensePlate, vin, mileage, inspectionDate, overallStatus, dataJson, id]
  );
  return resultado.rows[0] || null;
}

async function eliminarInspeccion(id) {
  const resultado = await query('DELETE FROM inspections WHERE id = $1 RETURNING id', [id]);
  return resultado.rows[0] || null;
}

module.exports = {
  crearInspeccion,
  obtenerTodasLasInspecciones,
  obtenerInspeccionPorId,
  buscarInspecciones,
  actualizarInspeccion,
  eliminarInspeccion,
};
