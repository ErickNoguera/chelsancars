import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import logo from '../assets/logo.png';
import '../styles/InspectionReport.css';

export default function InspectionReport() {
  const [formData, setFormData] = useState({
    // Datos del Cliente / Vehículo
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    licensePlate: '',
    vin: '',
    mileage: '',
    inspectionDate: '',

    // Verificación Legal
    registrationStatus: '',
    registrationObservations: '',
    documentsStatus: '',
    documentsObservations: '',

    // Inspección Mecánica
    engineStatus: '',
    engineObservations: '',
    transmissionStatus: '',
    transmissionObservations: '',
    brakesStatus: '',
    brakesObservations: '',
    suspensionStatus: '',
    suspensionObservations: '',
    coolantStatus: '',
    coolantObservations: '',

    // Scanner
    scannerStatus: '',
    codesDetected: '',
    scannerObservations: '',


    // Carrocería
    paintCondition: '',
    paintObservations: '',
    rustPresence: '',
    rustObservations: '',
    glassCondition: '',
    glassObservations: '',
    lightsStatus: '',
    lightsObservations: '',

    // Interior
    upholsteryCondition: '',
    upholsteryObservations: '',
    dashboardStatus: '',
    dashboardObservations: '',
    electricalStatus: '',
    electricalObservations: '',
    airconditioningStatus: '',
    airconditioningObservations: '',

    // Conclusión Final
    overallStatus: '',
    recommendedRepairs: '',
    finalObservations: '',

    // Firmas
    inspectorName: '',
    inspectorSignature: '',
    clientSignature: '',
  });

  const [charCount, setCharCount] = useState({
    registrationObservations: 0,
    documentsObservations: 0,
    engineObservations: 0,
    transmissionObservations: 0,
    brakesObservations: 0,
    suspensionObservations: 0,
    coolantObservations: 0,
    scannerObservations: 0,
    paintObservations: 0,
    rustObservations: 0,
    glassObservations: 0,
    lightsObservations: 0,
    upholsteryObservations: 0,
    dashboardObservations: 0,
    electricalObservations: 0,
    airconditioningObservations: 0,
    recommendedRepairs: 0,
    finalObservations: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [aiSuggestions, setAiSuggestions] = useState({});

  // Cargar datos guardados en localStorage al montar el componente
  useEffect(() => {
    const savedData = localStorage.getItem('inspectionFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        // Actualizar contadores de caracteres
        const newCharCount = {};
        Object.keys(parsedData).forEach(key => {
          if (typeof parsedData[key] === 'string') {
            newCharCount[key] = parsedData[key].length;
          }
        });
        setCharCount(prev => ({ ...prev, ...newCharCount }));
      } catch (error) {
        console.error('Error al cargar datos de localStorage:', error);
      }
    }
  }, []);

  // Guardar automáticamente formData en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('inspectionFormData', JSON.stringify(formData));
  }, [formData]);

  const handleTextareaChange = (e) => {
    const { name, value } = e.target;

    // Limitar a 800 caracteres
    if (value.length <= 800) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      setCharCount(prev => ({
        ...prev,
        [name]: value.length
      }));

      // Ocultar sugerencia si el usuario edita el texto
      setAiSuggestions(prev => ({
        ...prev,
        [name]: {
          ...(prev[name] || {}),
          showPreview: false,
        },
      }));
    }
  };

  const updateAiSuggestion = (name, updates) => {
    setAiSuggestions(prev => ({
      ...prev,
      [name]: {
        ...(prev[name] || { loading: false, suggestion: '', showPreview: false }),
        ...updates,
      },
    }));
  };

  // Función mock para mejorar texto (simula llamada a API)
  const mockImproveText = (text) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const baseText = text.trim()
          ? `Este vehículo presenta ${text.trim().toLowerCase()}`
          : 'Este vehículo presenta una evaluación clara y profesional de sus condiciones actuales';
        resolve(`${baseText}. Se recomienda revisar los detalles específicos y mantener un seguimiento periódico de las observaciones.`);
      }, 700);
    });
  };

  const handleImproveText = async (fieldName) => {
    const originalText = formData[fieldName] || '';
    updateAiSuggestion(fieldName, {
      loading: true,
      showPreview: false,
      suggestion: '',
    });

    const suggestion = await mockImproveText(originalText);

    updateAiSuggestion(fieldName, {
      loading: false,
      suggestion,
      showPreview: true,
    });
  };

  const handleUseSuggestion = (fieldName) => {
    const suggestionText = aiSuggestions[fieldName]?.suggestion || '';
    if (!suggestionText) return;

    setFormData(prev => ({
      ...prev,
      [fieldName]: suggestionText,
    }));

    setCharCount(prev => ({
      ...prev,
      [fieldName]: suggestionText.length,
    }));

    updateAiSuggestion(fieldName, {
      showPreview: false,
    });
  };

  const handleCancelSuggestion = (fieldName) => {
    updateAiSuggestion(fieldName, {
      showPreview: false,
      suggestion: '',
    });
  };

  const renderAiSuggestion = (fieldName) => {
    const state = aiSuggestions[fieldName] || {};

    return (
      <div className="textarea-ai-container">
        <button
          type="button"
          className="btn-ai-improve"
          onClick={() => handleImproveText(fieldName)}
          disabled={state.loading}
          title="Mejorar texto con IA"
        >
          {state.loading ? 'Mejorando...' : '✨ Mejorar'}
        </button>

        {state.showPreview && state.suggestion && (
          <div className="ai-suggestion-compact">
            <div className="suggestion-text">
              <strong>Texto sugerido:</strong><br />
              {state.suggestion}
            </div>
            <div className="suggestion-actions">
              <button
                type="button"
                className="btn-suggestion btn-use"
                onClick={() => handleUseSuggestion(fieldName)}
              >
                Usar
              </button>
              <button
                type="button"
                className="btn-suggestion btn-cancel"
                onClick={() => handleCancelSuggestion(fieldName)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleReset = () => {
    
    setFormData({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      licensePlate: '',
      vin: '',
      mileage: '',
      inspectionDate: '',
      registrationStatus: '',
      registrationObservations: '',
      documentsStatus: '',
      documentsObservations: '',
      engineStatus: '',
      engineObservations: '',
      transmissionStatus: '',
      transmissionObservations: '',
      brakesStatus: '',
      brakesObservations: '',
      suspensionStatus: '',
      suspensionObservations: '',
      coolantStatus: '',
      coolantObservations: '',
      scannerStatus: '',
      scannerObservations: '',
      codesDetected: '',
      paintCondition: '',
      paintObservations: '',
      rustPresence: '',
      rustObservations: '',
      glassCondition: '',
      glassObservations: '',
      lightsStatus: '',
      lightsObservations: '',
      upholsteryCondition: '',
      upholsteryObservations: '',
      dashboardStatus: '',
      dashboardObservations: '',
      electricalStatus: '',
      electricalObservations: '',
      airconditioningStatus: '',
      airconditioningObservations: '',
      overallStatus: '',
      recommendedRepairs: '',
      finalObservations: '',
      inspectorName: '',
      inspectorSignature: '',
      clientSignature: '',
    });
    setCharCount({
      registrationObservations: 0,
      documentsObservations: 0,
      engineObservations: 0,
      transmissionObservations: 0,
      brakesObservations: 0,
      suspensionObservations: 0,
      coolantObservations: 0,
      scannerObservations: 0,
      paintObservations: 0,
      rustObservations: 0,
      glassObservations: 0,
      lightsObservations: 0,
      upholsteryObservations: 0,
      dashboardObservations: 0,
      electricalObservations: 0,
      airconditioningObservations: 0,
      recommendedRepairs: 0,
      finalObservations: 0,
    });
    // Limpiar datos del localStorage
    localStorage.removeItem('inspectionFormData');
  };
  const handleSubmit = (e) => {
  e.preventDefault();
  console.log(formData);
    // Simular guardado
  localStorage.setItem('inspectionReport', JSON.stringify(formData));

  alert('Informe guardado correctamente ✅');
};

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let yPosition = 0;

    // HEADER CON IDENTIDAD VISUAL Y SOMBRA
    // Sombra simulada
    doc.setFillColor(20, 20, 20);
    doc.rect(0, 2, 210, 25, 'F');

    // Header principal
    doc.setFillColor(30, 30, 30);
    doc.rect(0, 0, 210, 25, 'F');

    // Logo con proporción correcta (2:1)
    doc.addImage(logo, 'PNG', 10, 2.5, 40, 20);

    // Título CHELSAN CARS más prominente
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('CHELSAN CARS', 60, 14);

    // Subtítulo
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Informe de Inspección Vehicular', 60, 22);

    // Fecha a la derecha
    const currentDate = new Date().toLocaleDateString('es-ES');
    const dateWidth = doc.getTextWidth(currentDate);
    doc.text(currentDate, 200 - dateWidth, 15);

    yPosition = 35;

    // TARJETA RESUMEN
    // Sombra simulada
    doc.setFillColor(200, 200, 200);
    doc.roundedRect(15, yPosition + 1, 180, 36, 3, 3, 'F');

    // Caja principal
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(15, yPosition, 180, 36, 3, 3, 'F');

    // Contenido en 2 columnas
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Cliente:', 25, yPosition + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.clientName || 'No especificado', 45, yPosition + 8);

    doc.setFont('helvetica', 'bold');
    doc.text('Teléfono:', 25, yPosition + 15);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.clientPhone || 'No especificado', 45, yPosition + 15);

    doc.setFont('helvetica', 'bold');
    doc.text('VIN:', 25, yPosition + 22);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.vin || 'No especificado', 45, yPosition + 22);

    doc.setFont('helvetica', 'bold');
    doc.text('Vehículo:', 110, yPosition + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.vehicleMake || ''} ${formData.vehicleModel || ''}`.trim() || 'No especificado', 135, yPosition + 8);

    doc.setFont('helvetica', 'bold');
    doc.text('Año:', 110, yPosition + 15);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.vehicleYear || 'No especificado', 135, yPosition + 15);

    doc.setFont('helvetica', 'bold');
    doc.text('Kilometraje:', 110, yPosition + 22);
    doc.setFont('helvetica', 'normal');
    const kmFormatted = formData.mileage ? `${parseInt(formData.mileage).toLocaleString('es-ES')} Km` : 'No especificado';
    doc.text(kmFormatted, 135, yPosition + 22);

    doc.setFont('helvetica', 'bold');
    doc.text('Patente:', 110, yPosition + 29);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.licensePlate || 'No especificada', 135, yPosition + 29);

    yPosition += 60;

    // Función para interpolar color (gradiente)
    const interpolateColor = (startHex, endHex, step, totalSteps) => {
      const start = { r: 254, g: 212, b: 42 }; // #FED42A amarillo
      const end = { r: 137, g: 107, b: 62 }; // #896B3E marrón
      const ratio = step / totalSteps;
      return {
        r: Math.round(start.r + (end.r - start.r) * ratio),
        g: Math.round(start.g + (end.g - start.g) * ratio),
        b: Math.round(start.b + (end.b - start.b) * ratio)
      };
    };

    // Función para dibujar sección con layout dinámico y seguro
    const drawSection = (title, items) => {
      // === SISTEMA DE LAYOUT DINÁMICO ===
      const marginLeft = 20;
      const marginRight = 190;
      const boxWidth = marginRight - marginLeft;
      const padding = 5;
      const textStartX = marginLeft + padding;
      const maxTextWidth = boxWidth - (padding * 2);
      const lineHeight = 4;
      const labelValueHeight = 7;
      const titleHeight = 10;
      const titleRadius = 3;
      const boxRadius = 3;
      const spaceBetweenItems = 3;
      const spaceAfterObservation = 10;
      const paddingBetweenTitleAndContent = 8;
      const spaceBetweenSections = 12;
      const shadowOffset = 0.5;


      // Control de página
      if (yPosition > 260) {
        drawFooter();
        doc.addPage();
        yPosition = 20;
      }

      // Título con degradado simulado amarillo a marrón y bordes redondeados
      // Dibujar degradado
      for (let i = 0; i < titleHeight; i++) {
        const color = interpolateColor('#FED42A', '#896B3E', i, titleHeight);
        doc.setFillColor(color.r, color.g, color.b);
        doc.rect(marginLeft, yPosition + i, boxWidth, 1, 'F');
      }
      
      // Simular borde redondeado con trazo
      doc.setDrawColor(137, 107, 62);
      doc.setLineWidth(0.3);
      doc.roundedRect(marginLeft, yPosition, boxWidth, titleHeight, titleRadius, titleRadius);

      doc.setTextColor(20, 20, 20);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const titleCenterX = marginLeft + boxWidth / 2;
      doc.text(title, titleCenterX, yPosition + titleHeight / 2 + 2, { align: 'center' });

      yPosition += titleHeight;
      yPosition += paddingBetweenTitleAndContent;

      // Contenido
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);

      items.forEach(item => {
        // === CÁLCULO DINÁMICO DE ALTURA DEL BLOQUE ===
        let totalBlockHeight = 0;
        
        // 1. Calcular altura de label + value
        doc.setFont('helvetica', 'bold');
        const labelText = item.label + ': ';
        const labelWidth = doc.getTextWidth(labelText);
        doc.setFont('helvetica', 'normal');
        
        const valueMaxWidth = maxTextWidth - labelWidth - 2;
        const valueLines = valueMaxWidth > 20 ? doc.splitTextToSize(item.value, valueMaxWidth) : [item.value];
        const valueHeight = valueLines.length * lineHeight;
        
        const labelValueBlockHeight = Math.max(labelValueHeight, valueHeight);
        totalBlockHeight += labelValueBlockHeight;

        // 2. Calcular altura de observación si existe
        let observationBlockHeight = 0;
        let observationLines = [];
        if (item.observation && item.observation.trim()) {
          observationLines = doc.splitTextToSize(item.observation, maxTextWidth);
          const textHeight = observationLines.length * lineHeight;
          observationBlockHeight = textHeight + (padding * 2);
          totalBlockHeight += observationBlockHeight + spaceAfterObservation;
        } else {
          totalBlockHeight += spaceBetweenItems;
        }
        
        // === VERIFICAR SALTO DE PÁGINA ANTES DE RENDERIZAR ===
        if (yPosition + totalBlockHeight > 270) {
          drawFooter();
          doc.addPage();
          yPosition = 20;
        }
        
        // === RENDERIZAR LABEL + VALUE ===
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(labelText, textStartX, yPosition);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        
        // Renderizar value (puede ser multiline)
        if (valueLines.length === 1) {
          doc.text(valueLines[0], textStartX + labelWidth + 2, yPosition);
        } else {
          // Si value ocupa múltiples líneas
          doc.text(valueLines, textStartX + labelWidth + 2, yPosition);
        }
        
        yPosition += labelValueBlockHeight;

        // === RENDERIZAR OBSERVACIÓN SI EXISTE ===
        if (item.observation && item.observation.trim()) {
          const boxHeight = observationBlockHeight;

          // Sombra
          doc.setFillColor(220, 220, 220);
          doc.roundedRect(marginLeft, yPosition + shadowOffset, boxWidth, boxHeight, boxRadius, boxRadius, 'F');

          // Caja principal
          doc.setFillColor(245, 245, 245);
          doc.roundedRect(marginLeft, yPosition, boxWidth, boxHeight, boxRadius, boxRadius, 'F');

          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
          doc.text(observationLines, textStartX, yPosition + padding + 2);

          yPosition += boxHeight + spaceAfterObservation;
        } else {
          yPosition += spaceBetweenItems;
        }
      });

      yPosition += spaceBetweenSections;
    };

    // Función para footer
    const drawFooter = () => {
      const footerY = 285;
      doc.setDrawColor(200, 200, 200);
      doc.line(15, footerY, 195, footerY);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      const footerText = 'CHELSAN CARS - Informe generado automáticamente';
      const footerWidth = doc.getTextWidth(footerText);
      doc.text(footerText, (210 - footerWidth) / 2, footerY + 5);
    };

    // SECCIONES con nueva estructura
    drawSection('VERIFICACIÓN LEGAL', [
      { label: 'Estado Matrícula', value: formData.registrationStatus || 'No evaluado', observation: formData.registrationObservations },
      { label: 'Estado Documentos', value: formData.documentsStatus || 'No evaluado', observation: formData.documentsObservations }
    ]);

    drawSection('INSPECCIÓN MECÁNICA', [
      { label: 'Motor', value: formData.engineStatus || 'No evaluado', observation: formData.engineObservations },
      { label: 'Transmisión', value: formData.transmissionStatus || 'No evaluado', observation: formData.transmissionObservations },
      { label: 'Frenos', value: formData.brakesStatus || 'No evaluado', observation: formData.brakesObservations },
      { label: 'Suspensión', value: formData.suspensionStatus || 'No evaluado', observation: formData.suspensionObservations },
      { label: 'Refrigeración', value: formData.coolantStatus || 'No evaluado', observation: formData.coolantObservations }
    ]);

    drawSection('SCANNER', [
      { label: 'Estado', value: formData.scannerStatus || 'No evaluado' },
      { label: 'Códigos Detectados', value: formData.codesDetected || 'Ninguno', observation: formData.scannerObservations }
    ]);

    drawSection('CARROCERÍA', [
      { label: 'Pintura', value: formData.paintCondition || 'No evaluado', observation: formData.paintObservations },
      { label: 'Óxido', value: formData.rustPresence || 'No evaluado', observation: formData.rustObservations },
      { label: 'Cristales', value: formData.glassCondition || 'No evaluado', observation: formData.glassObservations },
      { label: 'Iluminación', value: formData.lightsStatus || 'No evaluado', observation: formData.lightsObservations }
    ]);

    drawSection('INTERIOR', [
      { label: 'Tapizados', value: formData.upholsteryCondition || 'No evaluado', observation: formData.upholsteryObservations },
      { label: 'Tablero', value: formData.dashboardStatus || 'No evaluado', observation: formData.dashboardObservations },
      { label: 'Eléctricos', value: formData.electricalStatus || 'No evaluado', observation: formData.electricalObservations },
      { label: 'Aire Acondicionado', value: formData.airconditioningStatus || 'No evaluado', observation: formData.airconditioningObservations }
    ]);

    drawSection('CONCLUSIÓN FINAL', [
      { label: 'Evaluación General', value: formData.overallStatus || 'No evaluado', observation: formData.recommendedRepairs },
      { label: 'Observaciones Finales', value: '', observation: formData.finalObservations }
    ]);

    // FIRMA
    if (yPosition > 260) {
      drawFooter();
      doc.addPage();
      yPosition = 20;
    }

    yPosition += 20;
    doc.setDrawColor(0, 0, 0);
    doc.line(60, yPosition, 150, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const inspectorName = formData.inspectorName || 'Inspector no especificado';
    const nameWidth = doc.getTextWidth(inspectorName);
    doc.text(inspectorName, (210 - nameWidth) / 2, yPosition);

    // Footer final
    drawFooter();

    // Guardar el PDF
    doc.save('informe-inspeccion.pdf');
  };

  return (
    <div className="inspection-report-container">
      <form className="inspection-form" onSubmit={handleSubmit}>
        {/* HEADER */}
        <div className="form-header">
          <h1>Informe de Inspección Vehicular</h1>
          <p className="form-subtitle">Complete todos los campos requeridos</p>
        </div>

        {/* SECCIÓN 1: DATOS DEL CLIENTE / VEHÍCULO */}
        <section className="form-section">
          <h2 className="section-title">Datos del Cliente / Vehículo</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="clientName">Nombre del Cliente *</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="clientPhone">Teléfono *</label>
              <input
                type="tel"
                id="clientPhone"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleInputChange}
                placeholder="Ej: +56912345678"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="clientEmail">Correo Electrónico</label>
              <input
                type="email"
                id="clientEmail"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleInputChange}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="inspectionDate">Fecha de Inspección *</label>
              <input
                type="date"
                id="inspectionDate"
                name="inspectionDate"
                value={formData.inspectionDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="vehicleMake">Marca *</label>
              <input
                type="text"
                id="vehicleMake"
                name="vehicleMake"
                value={formData.vehicleMake}
                onChange={handleInputChange}
                placeholder="Ej: Toyota"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="vehicleModel">Modelo *</label>
              <input
                type="text"
                id="vehicleModel"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleInputChange}
                placeholder="Ej: Corolla"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="vehicleYear">Año *</label>
              <input
                type="number"
                id="vehicleYear"
                name="vehicleYear"
                value={formData.vehicleYear}
                onChange={handleInputChange}
                placeholder="Ej: 2020"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="licensePlate">Número de Patente *</label>
              <input
                type="text"
                id="licensePlate"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleInputChange}
                placeholder="Ej: ABCD1234"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="vin">VIN (Número de Chasis)</label>
              <input
                type="text"
                id="vin"
                name="vin"
                value={formData.vin}
                onChange={handleInputChange}
                placeholder="Número de identificación del vehículo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mileage">Kilometraje *</label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                placeholder="Ej: 85000"
                required
              />
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: VERIFICACIÓN LEGAL */}
        <section className="form-section">
          <h2 className="section-title">Verificación Legal</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="registrationStatus">Estado de Inscripción *</label>
              <select
                id="registrationStatus"
                name="registrationStatus"
                value={formData.registrationStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Observado">Observado</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="documentsStatus">Documentación *</label>
              <select
                id="documentsStatus"
                name="documentsStatus"
                value={formData.documentsStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Observado">Observado</option>
              </select>
            </div>
          </div>

          <div className="form-full-width">
            <div className="form-group">
              <label htmlFor="registrationObservations">Observaciones - Inscripción</label>
              <textarea
                id="registrationObservations"
                name="registrationObservations"
                value={formData.registrationObservations}
                onChange={handleTextareaChange}
                placeholder="Describa detalles relevantes..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.registrationObservations}/800 caracteres
              </div>
              {renderAiSuggestion('registrationObservations')}
            </div>

            <div className="form-group">
              <label htmlFor="documentsObservations">Observaciones - Documentación</label>
              <textarea
                id="documentsObservations"
                name="documentsObservations"
                value={formData.documentsObservations}
                onChange={handleTextareaChange}
                placeholder="Describa detalles relevantes..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.documentsObservations}/800 caracteres
              </div>
              {renderAiSuggestion('documentsObservations')}
            </div>
          </div>
        </section>

        {/* SECCIÓN 3: INSPECCIÓN MECÁNICA */}
        <section className="form-section">
          <h2 className="section-title">Inspección Mecánica</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="engineStatus">Motor *</label>
              <select
                id="engineStatus"
                name="engineStatus"
                value={formData.engineStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Óptimo">Óptimo</option>
                <option value="Aceptable">Aceptable</option>
                <option value="Deficiente">Deficiente</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="transmissionStatus">Transmisión *</label>
              <select
                id="transmissionStatus"
                name="transmissionStatus"
                value={formData.transmissionStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Óptimo">Óptimo</option>
                <option value="Aceptable">Aceptable</option>
                <option value="Deficiente">Deficiente</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="brakesStatus">Sistema de Frenos *</label>
              <select
                id="brakesStatus"
                name="brakesStatus"
                value={formData.brakesStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Óptimo">Óptimo</option>
                <option value="Aceptable">Aceptable</option>
                <option value="Deficiente">Deficiente</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="suspensionStatus">Suspensión *</label>
              <select
                id="suspensionStatus"
                name="suspensionStatus"
                value={formData.suspensionStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Óptimo">Óptimo</option>
                <option value="Aceptable">Aceptable</option>
                <option value="Deficiente">Deficiente</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="coolantStatus">Sistema de Refrigeración *</label>
              <select
                id="coolantStatus"
                name="coolantStatus"
                value={formData.coolantStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Óptimo">Óptimo</option>
                <option value="Aceptable">Aceptable</option>
                <option value="Deficiente">Deficiente</option>
              </select>
            </div>
          </div>

          <div className="form-full-width">
            <div className="form-group">
              <label htmlFor="engineObservations">Observaciones - Motor</label>
              <textarea
                id="engineObservations"
                name="engineObservations"
                value={formData.engineObservations}
                onChange={handleTextareaChange}
                placeholder="Describa detalles relevantes..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.engineObservations}/800 caracteres
              </div>
              {renderAiSuggestion('engineObservations')}
            </div>

            <div className="form-group">
              <label htmlFor="transmissionObservations">Observaciones - Transmisión</label>
              <textarea
                id="transmissionObservations"
                name="transmissionObservations"
                value={formData.transmissionObservations}
                onChange={handleTextareaChange}
                placeholder="Describa detalles relevantes..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.transmissionObservations}/800 caracteres
              </div>
              {renderAiSuggestion('transmissionObservations')}
            </div>

            <div className="form-group">
              <label htmlFor="brakesObservations">Observaciones - Frenos</label>
              <textarea
                id="brakesObservations"
                name="brakesObservations"
                value={formData.brakesObservations}
                onChange={handleTextareaChange}
                placeholder="Describa detalles relevantes..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.brakesObservations}/800 caracteres
              </div>
              {renderAiSuggestion('brakesObservations')}
            </div>

            <div className="form-group">
              <label htmlFor="suspensionObservations">Observaciones - Suspensión</label>
              <textarea
                id="suspensionObservations"
                name="suspensionObservations"
                value={formData.suspensionObservations}
                onChange={handleTextareaChange}
                placeholder="Describa detalles relevantes..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.suspensionObservations}/800 caracteres
              </div>
              {renderAiSuggestion('suspensionObservations')}
            </div>

            <div className="form-group">
              <label htmlFor="coolantObservations">Observaciones - Refrigeración</label>
              <textarea
                id="coolantObservations"
                name="coolantObservations"
                value={formData.coolantObservations}
                onChange={handleTextareaChange}
                placeholder="Describa detalles relevantes..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.coolantObservations}/800 caracteres
              </div>
              {renderAiSuggestion('coolantObservations')}
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: SCANNER */}
        <section className="form-section">
          <h2 className="section-title">Scanner</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="scannerStatus">Estado del Scanner *</label>
              <select
                id="scannerStatus"
                name="scannerStatus"
                value={formData.scannerStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Observado">Observado</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="codesDetected">Códigos de Error Detectados</label>
              <input
                type="text"
                id="codesDetected"
                name="codesDetected"
                value={formData.codesDetected}
                onChange={handleInputChange}
                placeholder="Ej: P0300, P0171"
              />
            </div>
          </div>

          <div className="form-full-width">
            <div className="form-group">
              <label htmlFor="scannerObservations">Observaciones - Scanner</label>
              <textarea
                id="scannerObservations"
                name="scannerObservations"
                value={formData.scannerObservations}
                onChange={handleTextareaChange}
                placeholder="Describa los resultados del escaneo..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.scannerObservations}/800 caracteres
              </div>
              {renderAiSuggestion('scannerObservations')}
            </div>
          </div>
        </section>

        {/* SECCIÓN 5: CARROCERÍA */}
        <section className="form-section">
          <h2 className="section-title">Carrocería</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="paintCondition">Condición de Pintura *</label>
              <select
                id="paintCondition"
                name="paintCondition"
                value={formData.paintCondition}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Óptimo">Óptimo</option>
                <option value="Aceptable">Aceptable</option>
                <option value="Deficiente">Deficiente</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rustPresence">Presencia de Óxido *</label>
              <select
                id="rustPresence"
                name="rustPresence"
                value={formData.rustPresence}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Sin óxido">Sin óxido</option>
                <option value="Óxido superficial">Óxido superficial</option>
                <option value="Óxido estructural">Óxido estructural</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="glassCondition">Condición de Cristales *</label>
              <select
                id="glassCondition"
                name="glassCondition"
                value={formData.glassCondition}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Óptimo">Óptimo</option>
                <option value="Aceptable">Aceptable</option>
                <option value="Deficiente">Deficiente</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="lightsStatus">Sistema de Iluminación *</label>
              <select
                id="lightsStatus"
                name="lightsStatus"
                value={formData.lightsStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Óptimo">Óptimo</option>
                <option value="Aceptable">Aceptable</option>
                <option value="Deficiente">Deficiente</option>
              </select>
            </div>
          </div>

          <div className="form-full-width">
            <div className="form-group">
              <label htmlFor="paintObservations">Observaciones - Pintura</label>
              <textarea
                id="paintObservations"
                name="paintObservations"
                value={formData.paintObservations}
                onChange={handleTextareaChange}
                placeholder="Describa detalles relevantes..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.paintObservations}/800 caracteres
              </div>
              {renderAiSuggestion('paintObservations')}
            </div>

            <div className="form-group">
              <label htmlFor="rustObservations">Observaciones - Óxido</label>
              <textarea
                id="rustObservations"
                name="rustObservations"
                value={formData.rustObservations}
                onChange={handleTextareaChange}
                placeholder="Describa detalles relevantes..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.rustObservations}/800 caracteres
              </div>
              {renderAiSuggestion('rustObservations')}
            </div>

            <div className="form-group">
              <label htmlFor="glassObservations">Observaciones - Cristales</label>
              <textarea
                id="glassObservations"
                name="glassObservations"
                value={formData.glassObservations}
                onChange={handleTextareaChange}
                placeholder="Describa detalles relevantes..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.glassObservations}/800 caracteres
              </div>
              {renderAiSuggestion('glassObservations')}
            </div>

            <div className="form-group">
              <label htmlFor="lightsObservations">Observaciones - Iluminación</label>
              <textarea
                id="lightsObservations"
                name="lightsObservations"
                value={formData.lightsObservations}
                onChange={handleTextareaChange}
                placeholder="Describa detalles relevantes..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.lightsObservations}/800 caracteres
              </div>
              {renderAiSuggestion('lightsObservations')}
            </div>
          </div>
        </section>

        {/* SECCIÓN 6: INTERIOR */}
        <section className="form-section">
          <h2 className="section-title">Interior</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="upholsteryCondition">Condición de Tapizados *</label>
              <select
                id="upholsteryCondition"
                name="upholsteryCondition"
                value={formData.upholsteryCondition}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Óptimo">Óptimo</option>
                <option value="Aceptable">Aceptable</option>
                <option value="Deficiente">Deficiente</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dashboardStatus">Estado del Tablero *</label>
              <select
                id="dashboardStatus"
                name="dashboardStatus"
                value={formData.dashboardStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Óptimo">Óptimo</option>
                <option value="Aceptable">Aceptable</option>
                <option value="Deficiente">Deficiente</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="electricalStatus">Sistemas Eléctricos *</label>
              <select
                id="electricalStatus"
                name="electricalStatus"
                value={formData.electricalStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Óptimo">Óptimo</option>
                <option value="Aceptable">Aceptable</option>
                <option value="Deficiente">Deficiente</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="airconditioningStatus">Aire Acondicionado *</label>
              <select
                id="airconditioningStatus"
                name="airconditioningStatus"
                value={formData.airconditioningStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Óptimo">Óptimo</option>
                <option value="Aceptable">Aceptable</option>
                <option value="Deficiente">Deficiente</option>
              </select>
            </div>
          </div>

          <div className="form-full-width">
            <div className="form-group">
              <label htmlFor="upholsteryObservations">Observaciones - Tapizados</label>
              <textarea
                id="upholsteryObservations"
                name="upholsteryObservations"
                value={formData.upholsteryObservations}
                onChange={handleTextareaChange}
                placeholder="Describa detalles relevantes..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.upholsteryObservations}/800 caracteres
              </div>
              {renderAiSuggestion('upholsteryObservations')}
            </div>

            <div className="form-group">
              <label htmlFor="dashboardObservations">Observaciones - Tablero</label>
              <textarea
                id="dashboardObservations"
                name="dashboardObservations"
                value={formData.dashboardObservations}
                onChange={handleTextareaChange}
                placeholder="Describa detalles relevantes..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.dashboardObservations}/800 caracteres
              </div>
              {renderAiSuggestion('dashboardObservations')}
            </div>

            <div className="form-group">
              <label htmlFor="electricalObservations">Observaciones - Eléctricos</label>
              <textarea
                id="electricalObservations"
                name="electricalObservations"
                value={formData.electricalObservations}
                onChange={handleTextareaChange}
                placeholder="Describa detalles relevantes..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.electricalObservations}/800 caracteres
              </div>
              {renderAiSuggestion('electricalObservations')}
            </div>

            <div className="form-group">
              <label htmlFor="airconditioningObservations">Observaciones - Aire Acondicionado</label>
              <textarea
                id="airconditioningObservations"
                name="airconditioningObservations"
                value={formData.airconditioningObservations}
                onChange={handleTextareaChange}
                placeholder="Describa detalles relevantes..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.airconditioningObservations}/800 caracteres
              </div>
              {renderAiSuggestion('airconditioningObservations')}
            </div>
          </div>
        </section>

        {/* SECCIÓN 7: CONCLUSIÓN FINAL */}
        <section className="form-section">
          <h2 className="section-title">Conclusión Final</h2>

          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="overallStatus">Evaluación General del Vehículo *</label>
              <select
                id="overallStatus"
                name="overallStatus"
                value={formData.overallStatus}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Óptimo">Óptimo</option>
                <option value="Aceptable">Aceptable</option>
                <option value="Deficiente">Deficiente</option>
              </select>
            </div>
          </div>

          <div className="form-full-width">
            <div className="form-group">
              <label htmlFor="recommendedRepairs">Reparaciones Recomendadas</label>
              <textarea
                id="recommendedRepairs"
                name="recommendedRepairs"
                value={formData.recommendedRepairs}
                onChange={handleTextareaChange}
                placeholder="Liste todas las reparaciones recomendadas..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.recommendedRepairs}/800 caracteres
              </div>
              {renderAiSuggestion('recommendedRepairs')}
            </div>

            <div className="form-group">
              <label htmlFor="finalObservations">Observaciones Finales</label>
              <textarea
                id="finalObservations"
                name="finalObservations"
                value={formData.finalObservations}
                onChange={handleTextareaChange}
                placeholder="Comentarios adicionales importantes..."
                maxLength="800"
              ></textarea>
              <div className="char-counter">
                {charCount.finalObservations}/800 caracteres
              </div>
              {renderAiSuggestion('finalObservations')}
            </div>
          </div>
        </section>

        {/* SECCIÓN 8: FIRMAS */}
        <section className="form-section">
          <h2 className="section-title">Firmas</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="inspectorName">Nombre del Inspector *</label>
              <input
                type="text"
                id="inspectorName"
                name="inspectorName"
                value={formData.inspectorName}
                onChange={handleInputChange}
                placeholder="Nombre completo"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="inspectorSignature">Firma del Inspector *</label>
              <input
                type="text"
                id="inspectorSignature"
                name="inspectorSignature"
                value={formData.inspectorSignature}
                onChange={handleInputChange}
                placeholder="(Próximamente: Firma digital)"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="clientSignature">Firma del Cliente *</label>
              <input
                type="text"
                id="clientSignature"
                name="clientSignature"
                value={formData.clientSignature}
                onChange={handleInputChange}
                placeholder="(Próximamente: Firma digital)"
                required
              />
            </div>
          </div>
        </section>

        {/* BOTONES DE ACCIÓN */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Guardar Informe
          </button>
          <button type="button" className="btn btn-success" onClick={handleDownloadPDF}>
            Descargar PDF
          </button>
          <button type="reset" className="btn btn-secondary" onClick={handleReset}>
            Limpiar Formulario
          </button>
        </div>
      </form>
    </div>
  );
}
