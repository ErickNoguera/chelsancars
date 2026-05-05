const inspeccionServicio = require('../services/inspection.service');

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

    const inspeccionCompleta = await inspeccionServicio.obtenerInspeccionPorId(resultados[0].id);
    return res.status(200).json({ inspeccion: inspeccionCompleta });
  } catch (error) {
    console.error('Error en búsqueda pública:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = { crear, listar, buscar, obtenerUna, actualizar, eliminar, buscarPublico };
