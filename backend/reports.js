/**
 * Sistema de almacenamiento de reportes en memoria
 * Nota: Los datos se perderán al reiniciar el servidor
 */

// Array para almacenar reportes
let reports = [];

// Contador para generar IDs únicos
let reportIdCounter = 1;

/**
 * Crear un nuevo reporte
 * @param {Object} reportData - Datos del formulario de inspección
 * @returns {Object} Reporte creado con id y timestamp
 */
function createReport(reportData) {
  const newReport = {
    id: reportIdCounter++,
    createdAt: new Date().toISOString(),
    ...reportData,
  };

  reports.push(newReport);
  return newReport;
}

/**
 * Obtener todos los reportes
 * @returns {Array} Array de reportes
 */
function getAllReports() {
  return reports;
}

/**
 * Obtener un reporte por ID
 * @param {number} id - ID del reporte
 * @returns {Object|null} Reporte encontrado o null
 */
function getReportById(id) {
  return reports.find((report) => report.id === parseInt(id));
}

/**
 * Obtener reportes por patente
 * @param {string} licensePlate - Número de patente
 * @returns {Array} Array de reportes que coinciden
 */
function getReportsByLicensePlate(licensePlate) {
  return reports.filter(
    (report) =>
      report.licensePlate &&
      report.licensePlate.toUpperCase() === licensePlate.toUpperCase()
  );
}

/**
 * Obtener reportes por nombre de cliente
 * @param {string} clientName - Nombre del cliente
 * @returns {Array} Array de reportes que coinciden
 */
function getReportsByClientName(clientName) {
  return reports.filter(
    (report) =>
      report.clientName &&
      report.clientName.toLowerCase().includes(clientName.toLowerCase())
  );
}

/**
 * Eliminar un reporte por ID
 * @param {number} id - ID del reporte
 * @returns {boolean} true si se eliminó, false si no existe
 */
function deleteReport(id) {
  const index = reports.findIndex((report) => report.id === parseInt(id));
  if (index > -1) {
    reports.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Actualizar un reporte por ID
 * @param {number} id - ID del reporte
 * @param {Object} updatedData - Datos actualizados
 * @returns {Object|null} Reporte actualizado o null
 */
function updateReport(id, updatedData) {
  const report = reports.find((report) => report.id === parseInt(id));
  if (report) {
    // Actualizar solo los campos proporcionados, mantener id y createdAt
    const { id: _, createdAt: __, ...updateableFields } = updatedData;
    Object.assign(report, updateableFields);
    report.updatedAt = new Date().toISOString();
    return report;
  }
  return null;
}

/**
 * Obtener estadísticas de reportes
 * @returns {Object} Estadísticas
 */
function getStatistics() {
  return {
    totalReports: reports.length,
    reportsToday: reports.filter((r) => {
      const reportDate = new Date(r.createdAt).toDateString();
      const today = new Date().toDateString();
      return reportDate === today;
    }).length,
  };
}

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  getReportsByLicensePlate,
  getReportsByClientName,
  deleteReport,
  updateReport,
  getStatistics,
  reports, // Exponer el array directamente si es necesario
};
