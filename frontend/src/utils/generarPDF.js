import jsPDF from 'jspdf';
import logo from '../assets/logo.png';

/**
 * Genera y descarga el PDF del informe de inspección.
 * Acepta los datos del formulario (formData) con los mismos nombres de campos
 * que usa InspectionReport.jsx.
 */
export function generarPDF(datos) {
  const doc = new jsPDF();
  let yPosition = 0;

  // HEADER
  doc.setFillColor(20, 20, 20);
  doc.rect(0, 2, 210, 25, 'F');
  doc.setFillColor(30, 30, 30);
  doc.rect(0, 0, 210, 25, 'F');
  doc.addImage(logo, 'PNG', 10, 2.5, 40, 20);

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('CHELSAN CARS', 60, 14);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Informe de Inspección Vehicular', 60, 22);

  const fechaActual = new Date().toLocaleDateString('es-ES');
  const anchoFecha = doc.getTextWidth(fechaActual);
  doc.text(fechaActual, 200 - anchoFecha, 15);

  yPosition = 35;

  // TARJETA RESUMEN
  doc.setFillColor(200, 200, 200);
  doc.roundedRect(15, yPosition + 1, 180, 36, 3, 3, 'F');
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(15, yPosition, 180, 36, 3, 3, 'F');

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);

  doc.setFont('helvetica', 'bold');
  doc.text('Cliente:', 25, yPosition + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.clientName || 'No especificado', 45, yPosition + 8);

  doc.setFont('helvetica', 'bold');
  doc.text('Teléfono:', 25, yPosition + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.clientPhone || 'No especificado', 45, yPosition + 15);

  doc.setFont('helvetica', 'bold');
  doc.text('VIN:', 25, yPosition + 22);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.vin || 'No especificado', 45, yPosition + 22);

  doc.setFont('helvetica', 'bold');
  doc.text('Vehículo:', 110, yPosition + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${datos.vehicleMake || ''} ${datos.vehicleModel || ''}`.trim() || 'No especificado', 135, yPosition + 8);

  doc.setFont('helvetica', 'bold');
  doc.text('Año:', 110, yPosition + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(String(datos.vehicleYear || 'No especificado'), 135, yPosition + 15);

  doc.setFont('helvetica', 'bold');
  doc.text('Kilometraje:', 110, yPosition + 22);
  doc.setFont('helvetica', 'normal');
  const kmFormateado = datos.mileage
    ? `${parseInt(datos.mileage).toLocaleString('es-ES')} Km`
    : 'No especificado';
  doc.text(kmFormateado, 135, yPosition + 22);

  doc.setFont('helvetica', 'bold');
  doc.text('Patente:', 110, yPosition + 29);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.licensePlate || 'No especificada', 135, yPosition + 29);

  yPosition += 60;

  // Interpolador de color para el degradado amarillo → marrón
  const interpolarColor = (paso, totalPasos) => {
    const inicio = { r: 254, g: 212, b: 42 };
    const fin = { r: 137, g: 107, b: 62 };
    const ratio = paso / totalPasos;
    return {
      r: Math.round(inicio.r + (fin.r - inicio.r) * ratio),
      g: Math.round(inicio.g + (fin.g - inicio.g) * ratio),
      b: Math.round(inicio.b + (fin.b - inicio.b) * ratio),
    };
  };

  const dibujarFooter = () => {
    const footerY = 285;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, footerY, 195, footerY);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const textoFooter = 'CHELSAN CARS - Informe generado automáticamente';
    const anchoTexto = doc.getTextWidth(textoFooter);
    doc.text(textoFooter, (210 - anchoTexto) / 2, footerY + 5);
  };

  const dibujarSeccion = (titulo, items) => {
    const margenIzq = 20;
    const margenDer = 190;
    const anchoBox = margenDer - margenIzq;
    const padding = 5;
    const xTexto = margenIzq + padding;
    const anchoMaxTexto = anchoBox - padding * 2;
    const alturaLinea = 4;
    const alturaLabelValor = 7;
    const alturaTitulo = 10;
    const radioTitulo = 3;
    const radioBox = 3;
    const espacioItems = 3;
    const espacioPostObservacion = 10;
    const paddingTituloContenido = 8;
    const espacioEntreSecciones = 12;
    const offsetSombra = 0.5;

    if (yPosition > 260) {
      dibujarFooter();
      doc.addPage();
      yPosition = 20;
    }

    // Título con degradado
    for (let i = 0; i < alturaTitulo; i++) {
      const color = interpolarColor(i, alturaTitulo);
      doc.setFillColor(color.r, color.g, color.b);
      doc.rect(margenIzq, yPosition + i, anchoBox, 1, 'F');
    }
    doc.setDrawColor(137, 107, 62);
    doc.setLineWidth(0.3);
    doc.roundedRect(margenIzq, yPosition, anchoBox, alturaTitulo, radioTitulo, radioTitulo);

    doc.setTextColor(20, 20, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(titulo, margenIzq + anchoBox / 2, yPosition + alturaTitulo / 2 + 2, { align: 'center' });

    yPosition += alturaTitulo + paddingTituloContenido;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    items.forEach((item) => {
      let alturaBloque = 0;

      doc.setFont('helvetica', 'bold');
      const textoLabel = item.label + ': ';
      const anchoLabel = doc.getTextWidth(textoLabel);
      doc.setFont('helvetica', 'normal');

      const anchoMaxValor = anchoMaxTexto - anchoLabel - 2;
      const lineasValor = anchoMaxValor > 20
        ? doc.splitTextToSize(item.value, anchoMaxValor)
        : [item.value];
      const alturaValor = lineasValor.length * alturaLinea;
      const alturaBloqueLabel = Math.max(alturaLabelValor, alturaValor);
      alturaBloque += alturaBloqueLabel;

      let alturaObservacion = 0;
      let lineasObservacion = [];
      if (item.observation && item.observation.trim()) {
        lineasObservacion = doc.splitTextToSize(item.observation, anchoMaxTexto);
        const alturaTexto = lineasObservacion.length * alturaLinea;
        alturaObservacion = alturaTexto + padding * 2;
        alturaBloque += alturaObservacion + espacioPostObservacion;
      } else {
        alturaBloque += espacioItems;
      }

      if (yPosition + alturaBloque > 270) {
        dibujarFooter();
        doc.addPage();
        yPosition = 20;
      }

      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(textoLabel, xTexto, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);

      if (lineasValor.length === 1) {
        doc.text(lineasValor[0], xTexto + anchoLabel + 2, yPosition);
      } else {
        doc.text(lineasValor, xTexto + anchoLabel + 2, yPosition);
      }

      yPosition += alturaBloqueLabel;

      if (item.observation && item.observation.trim()) {
        doc.setFillColor(220, 220, 220);
        doc.roundedRect(margenIzq, yPosition + offsetSombra, anchoBox, alturaObservacion, radioBox, radioBox, 'F');
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(margenIzq, yPosition, anchoBox, alturaObservacion, radioBox, radioBox, 'F');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(lineasObservacion, xTexto, yPosition + padding + 2);
        yPosition += alturaObservacion + espacioPostObservacion;
      } else {
        yPosition += espacioItems;
      }
    });

    yPosition += espacioEntreSecciones;
  };

  dibujarSeccion('VERIFICACIÓN LEGAL', [
    { label: 'Estado Matrícula', value: datos.registrationStatus || 'No evaluado', observation: datos.registrationObservations },
    { label: 'Estado Documentos', value: datos.documentsStatus || 'No evaluado', observation: datos.documentsObservations },
  ]);

  dibujarSeccion('INSPECCIÓN MECÁNICA', [
    { label: 'Motor', value: datos.engineStatus || 'No evaluado', observation: datos.engineObservations },
    { label: 'Transmisión', value: datos.transmissionStatus || 'No evaluado', observation: datos.transmissionObservations },
    { label: 'Frenos', value: datos.brakesStatus || 'No evaluado', observation: datos.brakesObservations },
    { label: 'Suspensión', value: datos.suspensionStatus || 'No evaluado', observation: datos.suspensionObservations },
    { label: 'Refrigeración', value: datos.coolantStatus || 'No evaluado', observation: datos.coolantObservations },
  ]);

  dibujarSeccion('SCANNER', [
    { label: 'Estado', value: datos.scannerStatus || 'No evaluado' },
    { label: 'Códigos Detectados', value: datos.codesDetected || 'Ninguno', observation: datos.scannerObservations },
  ]);

  dibujarSeccion('CARROCERÍA', [
    { label: 'Pintura', value: datos.paintCondition || 'No evaluado', observation: datos.paintObservations },
    { label: 'Óxido', value: datos.rustPresence || 'No evaluado', observation: datos.rustObservations },
    { label: 'Cristales', value: datos.glassCondition || 'No evaluado', observation: datos.glassObservations },
    { label: 'Iluminación', value: datos.lightsStatus || 'No evaluado', observation: datos.lightsObservations },
  ]);

  dibujarSeccion('INTERIOR', [
    { label: 'Tapizados', value: datos.upholsteryCondition || 'No evaluado', observation: datos.upholsteryObservations },
    { label: 'Tablero', value: datos.dashboardStatus || 'No evaluado', observation: datos.dashboardObservations },
    { label: 'Eléctricos', value: datos.electricalStatus || 'No evaluado', observation: datos.electricalObservations },
    { label: 'Aire Acondicionado', value: datos.airconditioningStatus || 'No evaluado', observation: datos.airconditioningObservations },
  ]);

  dibujarSeccion('CONCLUSIÓN FINAL', [
    { label: 'Evaluación General', value: datos.overallStatus || 'No evaluado', observation: datos.recommendedRepairs },
    { label: 'Observaciones Finales', value: '', observation: datos.finalObservations },
  ]);

  // FIRMA
  if (yPosition > 260) {
    dibujarFooter();
    doc.addPage();
    yPosition = 20;
  }

  yPosition += 20;
  doc.setDrawColor(0, 0, 0);
  doc.line(60, yPosition, 150, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const nombreInspector = datos.inspectorName || 'Inspector no especificado';
  const anchoNombre = doc.getTextWidth(nombreInspector);
  doc.text(nombreInspector, (210 - anchoNombre) / 2, yPosition);

  dibujarFooter();

  const parteCliente = datos.clientName
    ? datos.clientName.trim().replace(/\s+/g, '-')
    : 'cliente';
  const partePatente = datos.licensePlate
    ? datos.licensePlate.toUpperCase().trim()
    : 'patente';
  doc.save(`informe-${parteCliente}-${partePatente}.pdf`);
}
