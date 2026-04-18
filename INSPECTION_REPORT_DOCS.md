# Componente InspectionReport - Documentación

## Ubicación
- **Componente**: `frontend/src/components/InspectionReport.jsx`
- **Estilos**: `frontend/src/styles/InspectionReport.css`

## Descripción
Componente React profesional para crear informes de inspección vehicular con 8 secciones claramente definidas, validación de datos y preparación de estructura para envío a backend.

## Cómo Usar

### Importar el componente
```jsx
import InspectionReport from './components/InspectionReport';

function App() {
  return (
    <InspectionReport />
  );
}
```

## Características

### 1. Secciones del Formulario
1. **Datos del Cliente / Vehículo** - Información básica del cliente y vehículo
2. **Verificación Legal** - Inscripción y documentación
3. **Inspección Mecánica** - Motor, transmisión, frenos, suspensión, refrigeración
4. **Scanner** - Códigos de error y estado
5. **Carrocería** - Pintura, óxido, cristales, iluminación
6. **Interior** - Tapizados, tablero, eléctricos, aire acondicionado
7. **Conclusión Final** - Evaluación general y reparaciones recomendadas
8. **Firmas** - Nombre e información de firmas (digitales en futuro)

### 2. Validaciones y Valores

**Para campos de Evaluación Mecánica:**
- Óptimo
- Aceptable
- Deficiente

**Para campos de Validación Legal:**
- Aprobado
- Observado

### 3. Controles de Entrada

- **Text Inputs**: Nombre, teléfono, patente, marca, modelo, etc.
- **Number Inputs**: Año, kilometraje
- **Date Inputs**: Fecha de inspección
- **Email Input**: Correo electrónico
- **Tel Input**: Teléfono
- **Select Dropdowns**: Evaluaciones y validaciones
- **Textareas**: Observaciones con contador de 800 caracteres

### 4. Comportamiento

- **Componentes Controlados**: Todo el estado se maneja con `useState`
- **Validación de Caracteres**: Textareas limitadas a 800 caracteres con contador en tiempo real
- **Contador Dinámico**: Muestra caracteres usados/límite en cada textarea
- **Reset**: Botón para limpiar el formulario completamente
- **Submit**: Botón para guardar (prepara datos, aún sin envío a backend)

## Estructura de Datos

Cuando se envía el formulario, la estructura de datos en `formData` es:

```javascript
{
  // Datos del Cliente / Vehículo
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

  // Verificación Legal
  registrationStatus: "Aprobado",  // o "Observado"
  registrationObservations: "Documentos en orden",
  documentsStatus: "Aprobado",
  documentsObservations: "Todos los documentos presentes",

  // Inspección Mecánica
  engineStatus: "Óptimo",  // o "Aceptable", "Deficiente"
  engineObservations: "Motor en perfecto estado",
  transmissionStatus: "Aceptable",
  transmissionObservations: "Cambios suaves",
  brakesStatus: "Óptimo",
  brakesObservations: "Pastillas en buen estado",
  suspensionStatus: "Aceptable",
  suspensionObservations: "Amortiguadores funcionales",
  coolantStatus: "Óptimo",
  coolantObservations: "Niveles adecuados",

  // Scanner
  scannerStatus: "Aprobado",
  scannerObservations: "Sin códigos de error",
  codesDetected: "",

  // Carrocería
  paintCondition: "Óptimo",
  paintObservations: "Pintura original en buen estado",
  rustPresence: "Óptimo",
  rustObservations: "Sin óxido visible",
  glassCondition: "Óptimo",
  glassObservations: "Todos los cristales integros",
  lightsStatus: "Óptimo",
  lightsObservations: "Luces funcionando correctamente",

  // Interior
  upholsteryCondition: "Aceptable",
  upholsteryObservations: "Algunos desgastes menores",
  dashboardStatus: "Óptimo",
  dashboardObservations: "Sin grietas",
  electricalStatus: "Óptimo",
  electricalObservations: "Todos los sistemas eléctricos funcionan",
  airconditioningStatus: "Aceptable",
  airconditioningObservations: "Refrigera adecuadamente",

  // Conclusión Final
  overallStatus: "Aceptable",
  recommendedRepairs: "1. Revisar tapizados\n2. Chequeo de aire acondicionado",
  finalObservations: "Vehículo en condiciones aceptables para circulación",

  // Firmas
  inspectorName: "Carlos López",
  inspectorSignature: "Firma digital del inspector",
  clientSignature: "Firma digital del cliente"
}
```

## Ejemplo de Implementación Futura (Backend)

Cuando estés listo para conectar al backend, modificarás el `handleSubmit`:

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Para verificar que es admin
      },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Informe guardado:', result);
      // Limpiar formulario o redirigir
      handleReset();
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Estilos y Diseño

- **Variables CSS**: Tema con colores primarios, secundarios, estados
- **Responsive**: Adaptado para desktop, tablet y móvil
- **Accesibilidad**: Labels asociados, focus visible, contraste adecuado
- **Animaciones**: Transiciones suaves en inputs y botones
- **Gradient**: Encabezado con gradiente profesional

## Próximos Pasos

1. Integrar componente en la app principal
2. Agregar validación de campos requeridos
3. Implementar autenticación (verificar rol admin)
4. Conectar al backend para guardar en base de datos
5. Agregar firmas digitales (canvas o librería similar)
6. Implementar descarga de PDF con los datos del informe
7. Agregar manejo de errores y notificaciones
