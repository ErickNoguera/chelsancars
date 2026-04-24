/**
 * Rutas para gestión de reportes
 */

const express = require('express');
const router = express.Router();
const reportsStore = require('../../reports');

/**
 * POST /reports
 * Crear un nuevo reporte de inspección
 */
router.post('/', (req, res) => {
  try {
    // Validar que se recibió un body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El cuerpo de la solicitud está vacío',
      });
    }

    // Validar campos requeridos
    const requiredFields = [
      'clientName',
      'clientPhone',
      'vehicleMake',
      'vehicleModel',
      'vehicleYear',
      'licensePlate',
      'mileage',
      'inspectionDate',
    ];

    const missingFields = requiredFields.filter(
      (field) => !req.body[field] || req.body[field] === ''
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Campos requeridos faltantes',
        missingFields: missingFields,
      });
    }

    // Crear el reporte
    const newReport = reportsStore.createReport(req.body);

    // Retornar el reporte creado
    return res.status(201).json({
      success: true,
      message: 'Reporte creado exitosamente',
      data: newReport,
    });
  } catch (error) {
    console.error('Error al crear reporte:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
});

/**
 * GET /reports
 * Obtener todos los reportes
 */
router.get('/', (req, res) => {
  try {
    const allReports = reportsStore.getAllReports();

    return res.status(200).json({
      success: true,
      count: allReports.length,
      data: allReports,
    });
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
});

/**
 * GET /reports/:id
 * Obtener un reporte por ID
 */
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Validar que id sea un número
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido',
      });
    }

    const report = reportsStore.getReportById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: `Reporte con ID ${id} no encontrado`,
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
});

/**
 * GET /reports/search/by-license/:licensePlate
 * Obtener reportes por número de patente
 */
router.get('/search/by-license/:licensePlate', (req, res) => {
  try {
    const { licensePlate } = req.params;

    if (!licensePlate || licensePlate === '') {
      return res.status(400).json({
        success: false,
        message: 'Número de patente requerido',
      });
    }

    const matchingReports = reportsStore.getReportsByLicensePlate(licensePlate);

    return res.status(200).json({
      success: true,
      count: matchingReports.length,
      data: matchingReports,
    });
  } catch (error) {
    console.error('Error al buscar reportes por patente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
});

/**
 * GET /reports/search/by-client/:clientName
 * Obtener reportes por nombre de cliente
 */
router.get('/search/by-client/:clientName', (req, res) => {
  try {
    const { clientName } = req.params;

    if (!clientName || clientName === '') {
      return res.status(400).json({
        success: false,
        message: 'Nombre de cliente requerido',
      });
    }

    const matchingReports = reportsStore.getReportsByClientName(clientName);

    return res.status(200).json({
      success: true,
      count: matchingReports.length,
      data: matchingReports,
    });
  } catch (error) {
    console.error('Error al buscar reportes por cliente:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
});

/**
 * PUT /reports/:id
 * Actualizar un reporte existente
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Validar que id sea un número
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido',
      });
    }

    // Validar que se recibió un body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El cuerpo de la solicitud está vacío',
      });
    }

    const updatedReport = reportsStore.updateReport(id, req.body);

    if (!updatedReport) {
      return res.status(404).json({
        success: false,
        message: `Reporte con ID ${id} no encontrado`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Reporte actualizado exitosamente',
      data: updatedReport,
    });
  } catch (error) {
    console.error('Error al actualizar reporte:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
});

/**
 * DELETE /reports/:id
 * Eliminar un reporte
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Validar que id sea un número
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido',
      });
    }

    const deleted = reportsStore.deleteReport(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Reporte con ID ${id} no encontrado`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Reporte eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar reporte:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
});

/**
 * GET /reports/stats/overview
 * Obtener estadísticas de reportes
 */
router.get('/stats/overview', (req, res) => {
  try {
    const stats = reportsStore.getStatistics();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
});

module.exports = router;
