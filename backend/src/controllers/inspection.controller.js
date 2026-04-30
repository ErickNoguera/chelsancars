const inspeccionServicio = require('../services/inspection.service');

// POST /api/inspections
// Crea una nueva inspección. Requiere al menos: clientName, vehicleMake, vehicleModel, licensePlate
async function crear(req, res) {
  try {
    const {
      clientName, clientPhone, clientEmail,
      vehicleMake, vehicleModel, vehicleYear,
      licensePlate, vin, mileage, inspectionDate,
      overallStatus, ...restoDelFormulario
    } = req.body;

    if (!clientName || !vehicleMake || !vehicleModel || !licensePlate) {
      return res.status(400).json({
        error: 'Campos requeridos: clientName, vehicleMake, vehicleModel, licensePlate',
      });
    }

    const nuevaInspeccion = await inspeccionServicio.crearInspeccion({
      clientName,
      clientPhone,
      clientEmail,
      vehicleMake,
      vehicleModel,
      vehicleYear: vehicleYear ? parseInt(vehicleYear) : null,
      licensePlate: licensePlate.toUpperCase().trim(),
      vin,
      mileage: mileage ? parseInt(mileage) : null,
      inspectionDate,
      overallStatus,
      dataJson: req.body,
      createdBy: req.user?.username || 'admin',
    });

    return res.status(201).json({
      mensaje: 'Inspección creada exitosamente',
      inspeccion: nuevaInspeccion,
    });
  } catch (error) {
    console.error('Error al crear inspección:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// GET /api/inspections?limite=20&pagina=1
// Devuelve listado paginado de inspecciones (sin data_json para no sobrecargar)
async function listar(req, res) {
  try {
    const limite = Math.min(parseInt(req.query.limite) || 20, 100);
    const pagina = Math.max(parseInt(req.query.pagina) || 1, 1);

    const { inspecciones, total } = await inspeccionServicio.obtenerTodasLasInspecciones({ limite, pagina });

    return res.status(200).json({
      inspecciones,
      paginacion: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite),
      },
    });
  } catch (error) {
    console.error('Error al listar inspecciones:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// GET /api/inspections/search?plate=ABC123  o  ?client=Juan
// Busca inspecciones por patente o nombre de cliente
async function buscar(req, res) {
  try {
    const { plate, client } = req.query;

    if (!plate && !client) {
      return res.status(400).json({ error: 'Debes enviar al menos un parámetro: plate o client' });
    }

    const resultados = await inspeccionServicio.buscarInspecciones({ plate, client });

    return res.status(200).json({ inspecciones: resultados, total: resultados.length });
  } catch (error) {
    console.error('Error al buscar inspecciones:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// GET /api/inspections/:id
// Devuelve una inspección completa incluyendo data_json
async function obtenerUna(req, res) {
  try {
    const { id } = req.params;
    const inspeccion = await inspeccionServicio.obtenerInspeccionPorId(id);

    if (!inspeccion) {
      return res.status(404).json({ error: 'Inspección no encontrada' });
    }

    return res.status(200).json({ inspeccion });
  } catch (error) {
    console.error('Error al obtener inspección:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// PUT /api/inspections/:id
// Actualiza una inspección existente
async function actualizar(req, res) {
  try {
    const { id } = req.params;
    const {
      clientName, clientPhone, clientEmail,
      vehicleMake, vehicleModel, vehicleYear,
      licensePlate, vin, mileage, inspectionDate,
      overallStatus,
    } = req.body;

    if (!clientName || !vehicleMake || !vehicleModel || !licensePlate) {
      return res.status(400).json({
        error: 'Campos requeridos: clientName, vehicleMake, vehicleModel, licensePlate',
      });
    }

    const actualizada = await inspeccionServicio.actualizarInspeccion(id, {
      clientName,
      clientPhone,
      clientEmail,
      vehicleMake,
      vehicleModel,
      vehicleYear: vehicleYear ? parseInt(vehicleYear) : null,
      licensePlate: licensePlate.toUpperCase().trim(),
      vin,
      mileage: mileage ? parseInt(mileage) : null,
      inspectionDate,
      overallStatus,
      dataJson: req.body,
    });

    if (!actualizada) {
      return res.status(404).json({ error: 'Inspección no encontrada' });
    }

    return res.status(200).json({
      mensaje: 'Inspección actualizada exitosamente',
      inspeccion: actualizada,
    });
  } catch (error) {
    console.error('Error al actualizar inspección:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// DELETE /api/inspections/:id
// Elimina una inspección
async function eliminar(req, res) {
  try {
    const { id } = req.params;
    const eliminada = await inspeccionServicio.eliminarInspeccion(id);

    if (!eliminada) {
      return res.status(404).json({ error: 'Inspección no encontrada' });
    }

    return res.status(200).json({ mensaje: 'Inspección eliminada exitosamente', id: eliminada.id });
  } catch (error) {
    console.error('Error al eliminar inspección:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// GET /api/inspections/publico?client=Juan&plate=ABC123
// Ruta sin JWT: el cliente ingresa su nombre y la patente para descargar su informe
async function buscarPublico(req, res) {
  try {
    const { client, plate } = req.query;

    if (!client || !plate) {
      return res.status(400).json({ error: 'Debes enviar tu nombre (client) y la patente del vehículo (plate).' });
    }

    const resultados = await inspeccionServicio.buscarPorClienteYPatente(client.trim(), plate.trim());

    if (!resultados.length) {
      return res.status(404).json({ error: 'No se encontró ningún informe con ese nombre y patente.' });
    }

    // Devuelve el más reciente con todos los campos (incluyendo data_json para generar el PDF)
    const inspeccionCompleta = await inspeccionServicio.obtenerInspeccionPorId(resultados[0].id);
    return res.status(200).json({ inspeccion: inspeccionCompleta });
  } catch (error) {
    console.error('Error en búsqueda pública:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { crear, listar, buscar, obtenerUna, actualizar, eliminar, buscarPublico };
