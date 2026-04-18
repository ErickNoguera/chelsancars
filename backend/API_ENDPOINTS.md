# API Endpoints - Gestión de Reportes

## Descripción

API Express.js para gestionar reportes de inspección vehicular. Los datos se almacenan en memoria (array) durante la sesión del servidor. Cada reporte recibe automáticamente un `id` único e un `createdAt` timestamp.

## Estructura Base de Datos en Memoria

```javascript
// Array de reportes
const reports = [
  {
    id: 1,
    createdAt: "2026-04-18T10:30:00.000Z",
    updatedAt: "2026-04-18T10:35:00.000Z", // Solo si fue actualizado
    clientName: "Juan Pérez",
    clientPhone: "+56912345678",
    clientEmail: "juan@ejemplo.com",
    vehicleMake: "Toyota",
    vehicleModel: "Corolla",
    vehicleYear: "2020",
    licensePlate: "ABCD1234",
    vin: "12345ABC67890DEF12",
    mileage: "85000",
    inspectionDate: "2026-04-18",
    registrationStatus: "Aprobado",
    registrationObservations: "Documentos en orden",
    documentsStatus: "Aprobado",
    documentsObservations: "Todos los documentos presentes",
    engineStatus: "Óptimo",
    engineObservations: "Motor en perfecto estado",
    // ... (resto de campos del formulario)
  }
];
```

## Instalación de Dependencias

```bash
cd backend
npm install express cors
```

**Asegúrate de que tu `package.json` tenga:**
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5"
  }
}
```

## Endpoints

### 1. **POST /api/reports** - Crear un nuevo reporte
Crea un nuevo reporte de inspección vehicular.

**URL:** `POST http://localhost:3000/api/reports`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "clientName": "Juan Pérez",
  "clientPhone": "+56912345678",
  "clientEmail": "juan@ejemplo.com",
  "vehicleMake": "Toyota",
  "vehicleModel": "Corolla",
  "vehicleYear": "2020",
  "licensePlate": "ABCD1234",
  "vin": "12345ABC67890DEF12",
  "mileage": "85000",
  "inspectionDate": "2026-04-18",
  "registrationStatus": "Aprobado",
  "registrationObservations": "Documentos en orden",
  "documentsStatus": "Aprobado",
  "documentsObservations": "Todos los documentos presentes",
  "engineStatus": "Óptimo",
  "engineObservations": "Motor en perfecto estado",
  "transmissionStatus": "Aceptable",
  "transmissionObservations": "Cambios suaves",
  "brakesStatus": "Óptimo",
  "brakesObservations": "Pastillas en buen estado",
  "suspensionStatus": "Aceptable",
  "suspensionObservations": "Amortiguadores funcionales",
  "coolantStatus": "Óptimo",
  "coolantObservations": "Niveles adecuados",
  "scannerStatus": "Aprobado",
  "scannerObservations": "Sin códigos de error",
  "codesDetected": "",
  "paintCondition": "Óptimo",
  "paintObservations": "Pintura original en buen estado",
  "rustPresence": "Óptimo",
  "rustObservations": "Sin óxido visible",
  "glassCondition": "Óptimo",
  "glassObservations": "Todos los cristales integros",
  "lightsStatus": "Óptimo",
  "lightsObservations": "Luces funcionando correctamente",
  "upholsteryCondition": "Aceptable",
  "upholsteryObservations": "Algunos desgastes menores",
  "dashboardStatus": "Óptimo",
  "dashboardObservations": "Sin grietas",
  "electricalStatus": "Óptimo",
  "electricalObservations": "Todos los sistemas eléctricos funcionan",
  "airconditioningStatus": "Aceptable",
  "airconditioningObservations": "Refrigera adecuadamente",
  "overallStatus": "Aceptable",
  "recommendedRepairs": "1. Revisar tapizados\n2. Chequeo de aire acondicionado",
  "finalObservations": "Vehículo en condiciones aceptables para circulación",
  "inspectorName": "Carlos López",
  "inspectorSignature": "Firma digital del inspector",
  "clientSignature": "Firma digital del cliente"
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Reporte creado exitosamente",
  "data": {
    "id": 1,
    "createdAt": "2026-04-18T10:30:00.000Z",
    "clientName": "Juan Pérez",
    "licensePlate": "ABCD1234",
    ...
  }
}
```

**Respuesta Error (400 - Campos faltantes):**
```json
{
  "success": false,
  "message": "Campos requeridos faltantes",
  "missingFields": ["clientName", "vehicleMake"]
}
```

---

### 2. **GET /api/reports** - Obtener todos los reportes
Retrieves all reports stored in memory.

**URL:** `GET http://localhost:3000/api/reports`

**Respuesta (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "createdAt": "2026-04-18T10:30:00.000Z",
      "clientName": "Juan Pérez",
      "licensePlate": "ABCD1234",
      ...
    },
    {
      "id": 2,
      "createdAt": "2026-04-18T11:00:00.000Z",
      "clientName": "María García",
      "licensePlate": "XYZ9876",
      ...
    }
  ]
}
```

---

### 3. **GET /api/reports/:id** - Obtener un reporte por ID
Gets a specific report by its ID.

**URL:** `GET http://localhost:3000/api/reports/1`

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "createdAt": "2026-04-18T10:30:00.000Z",
    "clientName": "Juan Pérez",
    "licensePlate": "ABCD1234",
    ...
  }
}
```

**Respuesta Error (404):**
```json
{
  "success": false,
  "message": "Reporte con ID 999 no encontrado"
}
```

---

### 4. **GET /api/reports/search/by-license/:licensePlate** - Buscar por patente
Searches for reports by license plate.

**URL:** `GET http://localhost:3000/api/reports/search/by-license/ABCD1234`

**Respuesta (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "createdAt": "2026-04-18T10:30:00.000Z",
      "clientName": "Juan Pérez",
      "licensePlate": "ABCD1234",
      ...
    }
  ]
}
```

---

### 5. **GET /api/reports/search/by-client/:clientName** - Buscar por nombre de cliente
Searches for reports by client name (partial match).

**URL:** `GET http://localhost:3000/api/reports/search/by-client/Juan`

**Respuesta (200):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "createdAt": "2026-04-18T10:30:00.000Z",
      "clientName": "Juan Pérez",
      "licensePlate": "ABCD1234",
      ...
    }
  ]
}
```

---

### 6. **PUT /api/reports/:id** - Actualizar un reporte
Updates an existing report (preserves id and createdAt).

**URL:** `PUT http://localhost:3000/api/reports/1`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON - solo los campos a actualizar):**
```json
{
  "engineStatus": "Deficiente",
  "engineObservations": "Ruidos anómalos detectados"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Reporte actualizado exitosamente",
  "data": {
    "id": 1,
    "createdAt": "2026-04-18T10:30:00.000Z",
    "updatedAt": "2026-04-18T11:15:00.000Z",
    "engineStatus": "Deficiente",
    "engineObservations": "Ruidos anómalos detectados",
    ...
  }
}
```

---

### 7. **DELETE /api/reports/:id** - Eliminar un reporte
Deletes a report by ID.

**URL:** `DELETE http://localhost:3000/api/reports/1`

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Reporte eliminado exitosamente"
}
```

**Respuesta Error (404):**
```json
{
  "success": false,
  "message": "Reporte con ID 999 no encontrado"
}
```

---

### 8. **GET /api/reports/stats/overview** - Obtener estadísticas
Gets overview statistics of all reports.

**URL:** `GET http://localhost:3000/api/reports/stats/overview`

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "totalReports": 5,
    "reportsToday": 2
  }
}
```

---

## Ejemplo con cURL

```bash
# Crear un reporte
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Juan Pérez",
    "clientPhone": "+56912345678",
    "vehicleMake": "Toyota",
    "vehicleModel": "Corolla",
    "vehicleYear": "2020",
    "licensePlate": "ABCD1234",
    "mileage": "85000",
    "inspectionDate": "2026-04-18"
  }'

# Obtener todos los reportes
curl http://localhost:3000/api/reports

# Obtener un reporte específico
curl http://localhost:3000/api/reports/1

# Buscar por patente
curl http://localhost:3000/api/reports/search/by-license/ABCD1234

# Actualizar un reporte
curl -X PUT http://localhost:3000/api/reports/1 \
  -H "Content-Type: application/json" \
  -d '{"engineStatus": "Deficiente"}'

# Eliminar un reporte
curl -X DELETE http://localhost:3000/api/reports/1
```

## Ejemplo con Postman

1. **Nueva solicitud POST**
   - URL: `http://localhost:3000/api/reports`
   - Method: POST
   - Tab "Body" → Raw → JSON
   - Pegar el JSON del reporte completo
   - Click "Send"

2. **Obtener todos los reportes**
   - URL: `http://localhost:3000/api/reports`
   - Method: GET
   - Click "Send"

## Notas Importantes

- ⚠️ **Los datos se pierden al reiniciar el servidor** - Esto es solo para desarrollo
- ✅ Los IDs se generan automáticamente de forma incremental (1, 2, 3...)
- ✅ Los timestamps (`createdAt`, `updatedAt`) se generan automáticamente
- ✅ CORS está habilitado para que el frontend (port 5173) pueda hacer requests
- ✅ Validación básica de campos requeridos
- ✅ Manejo de errores consistente con respuestas JSON

## Próximos Pasos

Cuando estés listo para persistencia:
1. Cambiar de array en memoria a base de datos SQLite
2. Agregar autenticación JWT
3. Agregar rol-based access control
4. Implementar generación de PDF
