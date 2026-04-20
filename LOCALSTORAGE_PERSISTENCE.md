# Persistencia en localStorage - InspectionReport

## Cambios Implementados

### 1. Import de useEffect
```js
import { useState, useEffect } from 'react';
```

### 2. useEffect para Cargar Datos
- Se ejecuta solo una vez al montar el componente (`[]`)
- Carga datos de `localStorage.getItem('inspectionFormData')`
- Si existen datos, hace `JSON.parse` y actualiza `formData`
- También actualiza los contadores de caracteres

### 3. useEffect para Guardar Datos
- Se ejecuta cada vez que `formData` cambia
- Guarda automáticamente con `localStorage.setItem('inspectionFormData', JSON.stringify(formData))`

### 4. Modificación de handleReset
- Añadido `localStorage.removeItem('inspectionFormData')` al final
- Limpia tanto el estado como el almacenamiento local

## Comportamiento

- ✅ **Al recargar la página**: Los datos se mantienen
- ✅ **Al editar**: Se guarda automáticamente
- ✅ **Al hacer reset**: Se limpia todo (estado + localStorage)
- ✅ **Primera visita**: Formulario vacío (sin datos previos)

## Ventajas

- Persistencia automática sin intervención del usuario
- No interfiere con la lógica existente
- Manejo de errores básico (try/catch)
- Actualización automática de contadores

## Consideraciones

- Los datos se pierden si se borra el localStorage del navegador
- No hay límite de tamaño (localStorage tiene ~5-10MB)
- Los datos persisten entre sesiones del navegador