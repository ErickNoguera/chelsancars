import { useState } from 'react';
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
    scannerObservations: '',
    codesDetected: '',

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
  };
  const handleSubmit = (e) => {
  e.preventDefault();
  console.log(formData);
    // Simular guardado
  localStorage.setItem('inspectionReport', JSON.stringify(formData));

  alert('Informe guardado correctamente ✅');
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
                <option value="Óptimo">Sin óxido</option>
                <option value="Aceptable">Óxido superficial</option>
                <option value="Deficiente">Óxido estructural</option>
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
          <button type="reset" className="btn btn-secondary" onClick={handleReset}>
            Limpiar Formulario
          </button>
        </div>
      </form>
    </div>
  );
}
