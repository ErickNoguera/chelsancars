/**
 * Archivo de prueba para los endpoints de reportes
 * Ejecutar: node test-api.js (después de haber iniciado el servidor con: node index.js)
 */

const BASE_URL = "http://localhost:3000/api";

// Datos de prueba completos
const sampleReport = {
  clientName: "Juan Pérez García",
  clientPhone: "+56912345678",
  clientEmail: "juan.perez@email.com",
  vehicleMake: "Toyota",
  vehicleModel: "Corolla",
  vehicleYear: "2020",
  licensePlate: "ABCD1234",
  vin: "12345ABC67890DEF12",
  mileage: "85000",
  inspectionDate: "2026-04-18",
  registrationStatus: "Aprobado",
  registrationObservations: "Documentos en orden, inscripción vigente",
  documentsStatus: "Aprobado",
  documentsObservations: "Todos los documentos presentes y válidos",
  engineStatus: "Óptimo",
  engineObservations: "Motor en perfecto estado, sin ruidos anómalos",
  transmissionStatus: "Aceptable",
  transmissionObservations: "Cambios suaves, pequeña vibración al reversa",
  brakesStatus: "Óptimo",
  brakesObservations: "Pastillas en buen estado, frenado efectivo",
  suspensionStatus: "Aceptable",
  suspensionObservations: "Amortiguadores funcionales, pequeño ruido en curvas",
  coolantStatus: "Óptimo",
  coolantObservations: "Niveles adecuados, sin fugas visibles",
  scannerStatus: "Aprobado",
  scannerObservations: "Sin códigos de error detectados",
  codesDetected: "",
  paintCondition: "Óptimo",
  paintObservations: "Pintura original en buen estado, sin rayones profundos",
  rustPresence: "Óptimo",
  rustObservations: "Sin óxido visible en la carrocería",
  glassCondition: "Óptimo",
  glassObservations: "Todos los cristales íntegros y transparentes",
  lightsStatus: "Óptimo",
  lightsObservations: "Luces delanteras y traseras funcionando correctamente",
  upholsteryCondition: "Aceptable",
  upholsteryObservations: "Algunos desgastes menores en asientos, funcionales",
  dashboardStatus: "Óptimo",
  dashboardObservations: "Sin grietas, todos los controles funcionan",
  electricalStatus: "Óptimo",
  electricalObservations: "Todos los sistemas eléctricos funcionan correctamente",
  airconditioningStatus: "Aceptable",
  airconditioningObservations: "Refrigera adecuadamente, pequeño ruido del compresor",
  overallStatus: "Aceptable",
  recommendedRepairs:
    "1. Revisar suspensión delante\n2. Revisar aire acondicionado\n3. Pulir y proteger pintura",
  finalObservations:
    "Vehículo en condiciones aceptables para circulación, requiere mantenimiento preventivo",
  inspectorName: "Carlos López Martínez",
  inspectorSignature: "Firma digital del inspector",
  clientSignature: "Firma digital del cliente",
};

/**
 * Función auxiliar para hacer requests
 */
async function makeRequest(method, endpoint, body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    return {
      status: response.status,
      data,
    };
  } catch (error) {
    console.error(`Error en ${method} ${endpoint}:`, error.message);
    return null;
  }
}

/**
 * Ejecutar todas las pruebas
 */
async function runTests() {
  console.log("🧪 Iniciando pruebas de API de reportes\n");
  console.log("=" + "=".repeat(79) + "\n");

  // TEST 1: Crear un reporte
  console.log("1️⃣  TEST: Crear un nuevo reporte (POST /reports)");
  console.log("-".repeat(80));
  const createResult = await makeRequest("POST", "/reports", sampleReport);
  if (createResult && createResult.status === 201) {
    console.log("✅ Reporte creado exitosamente");
    console.log("📊 Respuesta:", JSON.stringify(createResult.data, null, 2));
    const reportId = createResult.data.data.id;
    console.log("\n");

    // TEST 2: Obtener todos los reportes
    console.log("2️⃣  TEST: Obtener todos los reportes (GET /reports)");
    console.log("-".repeat(80));
    const getAllResult = await makeRequest("GET", "/reports");
    if (getAllResult && getAllResult.status === 200) {
      console.log(`✅ Se obtuvieron ${getAllResult.data.count} reportes`);
      console.log("📊 Respuesta:", JSON.stringify(getAllResult.data, null, 2));
      console.log("\n");

      // TEST 3: Obtener un reporte específico
      console.log(`3️⃣  TEST: Obtener reporte por ID ${reportId} (GET /reports/:id)`);
      console.log("-".repeat(80));
      const getByIdResult = await makeRequest("GET", `/reports/${reportId}`);
      if (getByIdResult && getByIdResult.status === 200) {
        console.log(`✅ Reporte con ID ${reportId} obtenido`);
        console.log(
          "📊 Respuesta:",
          JSON.stringify(
            {
              id: getByIdResult.data.data.id,
              createdAt: getByIdResult.data.data.createdAt,
              clientName: getByIdResult.data.data.clientName,
              licensePlate: getByIdResult.data.data.licensePlate,
            },
            null,
            2
          )
        );
        console.log("\n");

        // TEST 4: Buscar por patente
        console.log("4️⃣  TEST: Buscar reporte por patente (GET /reports/search/by-license/:plate)");
        console.log("-".repeat(80));
        const searchByPlateResult = await makeRequest(
          "GET",
          `/reports/search/by-license/${sampleReport.licensePlate}`
        );
        if (searchByPlateResult && searchByPlateResult.status === 200) {
          console.log(`✅ Se encontraron ${searchByPlateResult.data.count} reportes con patente ${sampleReport.licensePlate}`);
          console.log("📊 Respuesta:", JSON.stringify(searchByPlateResult.data, null, 2));
          console.log("\n");

          // TEST 5: Buscar por nombre de cliente
          console.log(
            "5️⃣  TEST: Buscar reporte por nombre de cliente (GET /reports/search/by-client/:name)"
          );
          console.log("-".repeat(80));
          const searchByNameResult = await makeRequest(
            "GET",
            `/reports/search/by-client/Juan`
          );
          if (searchByNameResult && searchByNameResult.status === 200) {
            console.log(`✅ Se encontraron ${searchByNameResult.data.count} reportes con nombre "Juan"`);
            console.log("📊 Respuesta:", JSON.stringify(searchByNameResult.data, null, 2));
            console.log("\n");

            // TEST 6: Actualizar un reporte
            console.log(`6️⃣  TEST: Actualizar reporte ID ${reportId} (PUT /reports/:id)`);
            console.log("-".repeat(80));
            const updateResult = await makeRequest("PUT", `/reports/${reportId}`, {
              engineStatus: "Deficiente",
              engineObservations: "Ruidos anómalos detectados en el motor",
            });
            if (updateResult && updateResult.status === 200) {
              console.log(`✅ Reporte ID ${reportId} actualizado`);
              console.log("📊 Respuesta:", JSON.stringify(updateResult.data, null, 2));
              console.log("\n");

              // TEST 7: Obtener estadísticas
              console.log("7️⃣  TEST: Obtener estadísticas (GET /reports/stats/overview)");
              console.log("-".repeat(80));
              const statsResult = await makeRequest("GET", "/stats/overview");
              if (statsResult && statsResult.status === 200) {
                console.log("✅ Estadísticas obtenidas");
                console.log("📊 Respuesta:", JSON.stringify(statsResult.data, null, 2));
                console.log("\n");

                // TEST 8: Crear un segundo reporte para pruebas de búsqueda
                console.log("8️⃣  TEST: Crear un segundo reporte para pruebas");
                console.log("-".repeat(80));
                const sampleReport2 = { ...sampleReport, licensePlate: "XYZ9876", clientName: "María García" };
                const createResult2 = await makeRequest("POST", "/reports", sampleReport2);
                if (createResult2 && createResult2.status === 201) {
                  console.log("✅ Segundo reporte creado");
                  const reportId2 = createResult2.data.data.id;
                  console.log("\n");

                  // TEST 9: Obtener nuevamente todos los reportes
                  console.log("9️⃣  TEST: Obtener todos los reportes nuevamente (GET /reports)");
                  console.log("-".repeat(80));
                  const getAllResult2 = await makeRequest("GET", "/reports");
                  if (getAllResult2 && getAllResult2.status === 200) {
                    console.log(`✅ Se obtuvieron ${getAllResult2.data.count} reportes en total`);
                    console.log("📊 Respuesta:", JSON.stringify(getAllResult2.data, null, 2));
                    console.log("\n");

                    // TEST 10: Eliminar un reporte
                    console.log(`🔟 TEST: Eliminar reporte ID ${reportId2} (DELETE /reports/:id)`);
                    console.log("-".repeat(80));
                    const deleteResult = await makeRequest("DELETE", `/reports/${reportId2}`);
                    if (deleteResult && deleteResult.status === 200) {
                      console.log(`✅ Reporte ID ${reportId2} eliminado`);
                      console.log("📊 Respuesta:", JSON.stringify(deleteResult.data, null, 2));
                      console.log("\n");

                      // Resultado final
                      console.log("=" + "=".repeat(79));
                      console.log("✨ ¡TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE!");
                      console.log("=" + "=".repeat(79));
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  } else {
    console.error("❌ Error al crear el reporte inicial");
    if (createResult) {
      console.error("📊 Respuesta:", JSON.stringify(createResult, null, 2));
    }
  }
}

// Ejecutar las pruebas
console.log("\n⏳ Esperando que el servidor esté disponible en http://localhost:3000\n");
runTests();
