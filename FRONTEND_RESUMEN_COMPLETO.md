# 📱 RESUMEN COMPLETO DEL FRONTEND - CHELSAN CARS

**Versión:** v0.0.1  
**Última actualización:** 29 de abril de 2026  
**Estado:** Activo y funcional

---

## 📋 TABLA DE CONTENIDOS

1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Dependencias](#dependencias)
5. [Estructura de Carpetas](#estructura-de-carpetas)
6. [Componentes](#componentes)
7. [Sistema de Estilos](#sistema-de-estilos)
8. [Funcionalidades Principales](#funcionalidades-principales)
9. [Persistencia de Datos](#persistencia-de-datos)
10. [Generación de PDF](#generación-de-pdf)
11. [Características UX/UI](#características-uxui)
12. [Scripts y Comandos](#scripts-y-comandos)
13. [Cómo Funciona (Flujo de Usuario)](#cómo-funciona-flujo-de-usuario)

---

## 🎯 Descripción General

**CHELSAN CARS** es una aplicación web moderna de **inspección vehicular premium** que proporciona:

- **Landing page atractiva** con presentación de servicios
- **Formulario interactivo de inspección** detallado con 60+ campos
- **Sugerencias de IA** para mejorar observaciones
- **Generación de PDFs profesionales** con diseño personalizado
- **Persistencia automática** en localStorage
- **Interfaz responsiva** (mobile-first)
- **Componentes modulares** de React con hooks

**Objetivo principal:** Permitir que inspectores profesionales completen reportes de inspección vehicular de forma rápida, profesional y con salida PDF lista para entregar.

---

## 🏗️ Arquitectura

### Patrón Arquitectónico

```
ARCHITECTURE: Component-Based + Hook-Based State Management
├── Componentes Funcionales (React 18+)
├── Hooks (useState, useEffect)
├── State Management: localStorage (persistencia)
└── Rendering: Conditional Rendering + Dynamic Forms
```

### Flujo de Datos

```
Usuario Input
    ↓
handleInputChange / handleTextareaChange
    ↓
setFormData (state update)
    ↓
useEffect (localStorage sync)
    ↓
localStorage.setItem('inspectionFormData')
    ↓
Renderizado (DOM update)
    ↓
PDF Generation / Export
```

### Capas de la Aplicación

| Capa | Componentes | Responsabilidad |
|------|-------------|-----------------|
| **Presentación** | Navbar, Hero, Footer | UI visual |
| **Lógica** | InspectionReport | Formulario + estado |
| **Persistencia** | localStorage | Guardar datos |
| **Exportación** | jsPDF | Generación de PDF |

---

## 🛠️ Stack Tecnológico

### Frontend Framework
- **React 18.3.1** - Librería UI con hooks y functional components
- **Vite 5.4.0** - Build tool ultrarrápido (dev server + production build)
- **@vitejs/plugin-react 4.3.1** - Plugin para soporte de JSX

### Herramientas de Generación de Documentos
- **jsPDF 4.2.1** - Generación de PDFs desde JavaScript
- **html2canvas 1.4.1** - Captura de elementos HTML como imagen (para PDFs)

### Iconografía
- **react-icons 5.6.0** - Biblioteca de iconos (Font Awesome, Feather, etc.)

### Lenguaje y Versionado
- **Node.js LTS** - Runtime de JavaScript
- **npm** - Package manager

---

## 📦 Dependencias

### package.json

```json
{
  "name": "chelsancars-frontend",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "html2canvas": "^1.4.1",
    "jspdf": "^4.2.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-icons": "^5.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.0"
  }
}
```

### Detalles de Librerías

| Librería | Versión | Uso |
|----------|---------|-----|
| **React** | 18.3.1 | Framework principal, hooks (useState, useEffect) |
| **React-DOM** | 18.3.1 | Renderizado DOM, ReactDOM.createRoot |
| **Vite** | 5.4.0 | Dev server (puerto 5173), HMR, build production |
| **jsPDF** | 4.2.1 | Generación de PDFs (reportes, descargas) |
| **html2canvas** | 1.4.1 | Convertir HTML a canvas → imagen en PDF |
| **react-icons** | 5.6.0 | Iconos (Instagram, WhatsApp, Phone, Email, etc.) |

---

## 📁 Estructura de Carpetas

```
frontend/
├── 📄 index.html                          # Punto de entrada HTML
├── 📄 package.json                        # Dependencias y scripts
├── 📄 vite.config.js                      # Configuración de Vite
│
├── src/
│   ├── 📄 main.jsx                        # Entry point de React
│   ├── 📄 App.jsx                         # Componente raíz
│   ├── 📄 styles.css                      # Estilos globales + variables CSS
│   │
│   ├── components/
│   │   ├── 📄 Navbar.jsx                  # Barra de navegación con logo
│   │   ├── 📄 Hero.jsx                    # Sección hero/banner
│   │   ├── 📄 InspectionReport.jsx        # 🔴 Componente PRINCIPAL (formulario)
│   │   └── 📄 Footer.jsx                  # Pie de página con redes
│   │
│   ├── styles/
│   │   └── 📄 InspectionReport.css        # Estilos específicos del formulario
│   │
│   └── assets/
│       ├── 🖼️ logo.png                    # Logo de Chelsan Cars
│       ├── 🖼️ hero.jpg                    # Imagen hero/banner
│       ├── 🖼️ service.jpg                 # Imagen servicios
│       └── 🖼️ inspection.jpg              # Imagen inspección
```

### Desglose de Responsabilidades

```
App.jsx
├─ Navbar.jsx ────────────── Navegación + Links
├─ Hero.jsx ───────────────── Sección banner principal
├─ Servicios (HTML inline) ── 2 secciones de servicios
├─ Contacto (HTML inline) ─── Info contacto
├─ InspectionReport.jsx ────── 🔴 FORMULARIO COMPLETO (1500+ líneas)
└─ Footer.jsx ──────────────── Redes sociales + info

styles.css
├─ Variables CSS globales
├─ Navbar responsive
├─ Hero section
├─ Feature sections
├─ Contact section
├─ Footer
└─ Tipografía (Montserrat)

InspectionReport.css
└─ Form styling + layout dinámico
```

---

## 🧩 Componentes

### 1. **Navbar.jsx** - Barra de Navegación

**Propósito:** Navegación principal con logo y links a secciones

**Características:**
- ✅ Logo de Chelsan Cars (imagen importada)
- ✅ Links a #servicios, #contacto, #descargar
- ✅ Menú hamburguesa (mobile)
- ✅ Cambio de estilo al scroll (sticky)
- ✅ Bloqueo de scroll cuando menú está abierto

**Hooks utilizados:**
```javascript
const [isScrolled, setIsScrolled] = useState(false);  // Control de scroll
const [menuOpen, setMenuOpen] = useState(false);      // Toggle menú mobile
```

**Eventos:**
```javascript
window.addEventListener('scroll', handleScroll);     // Detectar scroll
onClick={() => setMenuOpen(!menuOpen)};              // Toggle hamburguesa
```

**Flujo:**
```
User interactúa
  ↓
setMenuOpen(true/false)
  ↓
className actualiza: navbar-links--open
  ↓
CSS muestra/oculta menú
  ↓
document.body.style.overflow bloqueado mientras menú abierto
```

---

### 2. **Hero.jsx** - Sección Banner

**Propósito:** Hero section con call-to-action

**Características:**
- ✅ Imagen de fondo con overlay oscuro (gradiente)
- ✅ Texto principal: "Tu auto inspeccionado con precisión"
- ✅ Descripción
- ✅ CTA button → #contacto

**Implementación:**
```javascript
style={{ 
  backgroundImage: `linear-gradient(...), url(${heroImage})` 
}}
```

**No tiene estado** - Componente puramente presentacional

---

### 3. **Footer.jsx** - Pie de Página

**Propósito:** Links de redes sociales y contacto

**Características:**
- ✅ Logo + descripción brand
- ✅ 6 iconos: Instagram, WhatsApp, Phone, Email, TikTok, Twitter/X
- ✅ Links externos (target="_blank")
- ✅ aria-label para accesibilidad

**Librerías usadas:**
```javascript
import { FaInstagram, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaTiktok, FaTwitter } 
  from 'react-icons/fa';
```

**No tiene estado** - Componente puramente presentacional

---

### 4. **InspectionReport.jsx** - 🔴 COMPONENTE PRINCIPAL

**Propósito:** Formulario interactivo de inspección vehicular con 60+ campos

**Tamaño:** ~1500+ líneas (componente más importante)

#### Estado Principal

```javascript
const [formData, setFormData] = useState({
  // Cliente (5 campos)
  clientName, clientPhone, clientEmail,
  
  // Vehículo (7 campos)
  vehicleMake, vehicleModel, vehicleYear, 
  licensePlate, vin, mileage, inspectionDate,
  
  // Verificación Legal (4 campos)
  registrationStatus, registrationObservations,
  documentsStatus, documentsObservations,
  
  // Inspección Mecánica (12 campos)
  engineStatus, engineObservations,
  transmissionStatus, transmissionObservations,
  brakesStatus, brakesObservations,
  suspensionStatus, suspensionObservations,
  coolantStatus, coolantObservations,
  scannerStatus, codesDetected, scannerObservations,
  
  // Carrocería (8 campos)
  paintCondition, paintObservations,
  rustPresence, rustObservations,
  glassCondition, glassObservations,
  lightsStatus, lightsObservations,
  
  // Interior (8 campos)
  upholsteryCondition, upholsteryObservations,
  dashboardStatus, dashboardObservations,
  electricalStatus, electricalObservations,
  airconditioningStatus, airconditioningObservations,
  
  // Conclusión (3 campos)
  overallStatus, recommendedRepairs, finalObservations,
  
  // Firmas (3 campos)
  inspectorName, inspectorSignature, clientSignature
});

const [charCount, setCharCount] = useState({...});      // Contador de caracteres
const [aiSuggestions, setAiSuggestions] = useState({...}); // Sugerencias IA
```

**Total de campos:** 61 campos en el formulario

#### Hooks Utilizados

```javascript
useEffect(() => {
  // Al montar: cargar datos de localStorage
  const savedData = localStorage.getItem('inspectionFormData');
  if (savedData) setFormData(JSON.parse(savedData));
}, []);

useEffect(() => {
  // Guardar automáticamente cada cambio en formData
  localStorage.setItem('inspectionFormData', JSON.stringify(formData));
}, [formData]);
```

#### Funcionalidades Clave

##### a) **Entrada de Formulario**

```javascript
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const handleTextareaChange = (e) => {
  const { name, value } = e.target;
  if (value.length <= 800) {  // Límite 800 caracteres
    setFormData(prev => ({ ...prev, [name]: value }));
    setCharCount(prev => ({ ...prev, [name]: value.length }));
  }
};
```

##### b) **Sugerencias de IA (Mock)**

```javascript
const mockImproveText = (text) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const suggestion = `Este vehículo presenta ${text.trim().toLowerCase()}...`;
      resolve(suggestion);
    }, 700);
  });
};

const handleImproveText = async (fieldName) => {
  updateAiSuggestion(fieldName, { loading: true });
  const suggestion = await mockImproveText(formData[fieldName]);
  updateAiSuggestion(fieldName, { 
    loading: false, 
    suggestion, 
    showPreview: true 
  });
};
```

**Características IA:**
- ✅ Mejora de texto con button "✨ Mejorar"
- ✅ Preview de sugerencia
- ✅ Botones "Usar" / "Cancelar"
- ✅ Simulación de loading (700ms delay)

##### c) **Reset del Formulario**

```javascript
const handleReset = () => {
  setFormData({...todos los campos en vacío});
  setCharCount({...reset a 0});
  localStorage.removeItem('inspectionFormData');
};
```

##### d) **Envío del Formulario**

```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  localStorage.setItem('inspectionReport', JSON.stringify(formData));
  alert('Informe guardado correctamente ✅');
};
```

##### e) **Generación de PDF**

```javascript
const handleDownloadPDF = () => {
  const doc = new jsPDF();
  
  // 1. HEADER (logo + título + fecha)
  doc.setFillColor(30, 30, 30);
  doc.addImage(logo, 'PNG', 10, 2.5, 40, 20);
  doc.text('CHELSAN CARS', 60, 14);
  
  // 2. TARJETA RESUMEN (2 columnas)
  doc.text('Cliente:', 25, 8);
  doc.text(formData.clientName, 45, 8);
  
  // 3. SECCIONES DINÁMICAS CON LAYOUT
  drawSection('VERIFICACIÓN LEGAL', [...items]);
  drawSection('INSPECCIÓN MECÁNICA', [...items]);
  // ... más secciones
  
  // 4. FOOTER + PAGINACIÓN
  doc.save(`Informe-${formData.licensePlate || 'auto'}.pdf`);
};
```

**Características del PDF:**
- ✅ Header con logo y estilo profesional
- ✅ Tarjeta resumen (cliente + vehículo en 2 columnas)
- ✅ Secciones con títulos con degradado (amarillo → marrón)
- ✅ Layout dinámico: ajusta altura según contenido
- ✅ Cajas redondeadas para observaciones
- ✅ Paginación automática
- ✅ Footer en cada página
- ✅ Líneas multisenso para textos largos

**Renderizado de PDF:**

```javascript
const drawSection = (title, items) => {
  // Verificar espacio en página
  if (yPosition > 260) {
    drawFooter();
    doc.addPage();
    yPosition = 20;
  }
  
  // Título con degradado
  for (let i = 0; i < titleHeight; i++) {
    const color = interpolateColor('#FED42A', '#896B3E', i, titleHeight);
    doc.setFillColor(color.r, color.g, color.b);
    doc.rect(marginLeft, yPosition + i, boxWidth, 1, 'F');
  }
  
  // Renderizar items
  items.forEach(item => {
    // Calcular altura dinámica
    const labelLines = doc.splitTextToSize(item.label, maxWidth);
    const valueLines = doc.splitTextToSize(item.value, maxWidth);
    
    // Dibujar label + value
    doc.text(item.label, x, y);
    doc.text(item.value, x + offset, y);
    
    // Dibujar observación en caja redondeada
    if (item.observation) {
      doc.roundedRect(x, y, width, height, radius, radius);
      doc.text(item.observation, x + padding, y + padding);
    }
  });
};
```

---

## 🎨 Sistema de Estilos

### Variables CSS (Custom Properties)

```css
:root {
  /* Colores Principal */
  --background: #FFFFFF;              /* Blanco */
  --section-bg: #F8F9FA;              /* Gris muy claro */
  --text: #060706;                    /* Casi negro */
  --text-secondary: rgba(6, 7, 6, 0.7);
  
  /* Colores Brand */
  --accent: #FED42A;                  /* Amarillo brillante */
  --secondary: #896B3E;               /* Marrón oscuro */
  
  /* Componentes */
  --navbar-bg: #060706;               /* Negro */
  --card-bg: #FFFFFF;                 /* Blanco */
  --border: rgba(6, 7, 6, 0.12);     /* Gris frontera */
  
  /* Tipografía */
  font-family: 'Montserrat', sans-serif;
}
```

### Paleta de Colores

| Uso | Color | Hex |
|-----|-------|-----|
| Acento principal | Amarillo | #FED42A |
| Acento secundario | Marrón | #896B3E |
| Texto | Casi negro | #060706 |
| Fondo | Blanco | #FFFFFF |
| Navbar | Negro | #060706 |
| Secciones | Gris claro | #F8F9FA |

### Tipografía

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

font-family: 'Montserrat', sans-serif;
font-weights: 300 (light), 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
```

### Componentes Estilizados

#### Navbar
```css
.navbar {
  background: var(--navbar-bg);       /* Negro */
  position: sticky;
  transition: all 0.3s ease;
}

.navbar.is-scrolled {
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 8px 0;
}

.navbar-hamburger {
  display: none;  /* visible solo en mobile */
}

@media (max-width: 768px) {
  .navbar-hamburger { display: block; }
  .navbar-links { display: none; }
  .navbar-links--open { display: flex; }
}
```

#### Hero Section
```css
.hero-section {
  background-size: cover;
  background-position: center;
  background-attachment: fixed;      /* Parallax en desktop */
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  text-align: center;
  color: white;
  z-index: 2;
}

.hero-button {
  background: var(--accent);          /* Amarillo */
  padding: 12px 30px;
  border-radius: 4px;
  text-decoration: none;
  transition: transform 0.3s;
}

.hero-button:hover {
  transform: scale(1.05);
}
```

#### Feature Sections
```css
.feature-section {
  padding: 80px 24px;
  background: var(--background);
}

.feature-section.section-alt {
  background: var(--section-bg);      /* Gris claro */
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-grid.reverse {
  direction: rtl;
}

@media (max-width: 768px) {
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
```

#### Contact Section
```css
.contact-section {
  padding: 60px 24px;
  background: var(--section-bg);
  text-align: center;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}
```

#### Footer
```css
.footer {
  background: var(--navbar-bg);       /* Negro */
  color: white;
  padding: 40px 24px;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.footer-links a {
  font-size: 24px;
  color: var(--accent);               /* Amarillo */
  transition: transform 0.3s;
}

.footer-links a:hover {
  transform: scale(1.2);
}
```

#### InspectionReport.css
```css
.inspection-form {
  max-width: 900px;
  margin: 40px auto;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.1);
}

.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.form-section h2 {
  color: var(--secondary);            /* Marrón */
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.char-count {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.btn-ai-improve {
  background: var(--accent);          /* Amarillo */
  color: var(--text);
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}

.ai-suggestion-compact {
  margin-top: 12px;
  padding: 12px;
  background: #FEF8E7;                /* Amarillo muy claro */
  border-left: 4px solid var(--accent);
  border-radius: 4px;
}

.suggestion-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-suggestion {
  padding: 6px 12px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}

.btn-use {
  background: var(--accent);
  color: var(--text);
}

.btn-cancel {
  background: #E0E0E0;
  color: var(--text);
}

.btn-submit,
.btn-reset,
.btn-download {
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  transition: all 0.3s;
}

.btn-submit {
  background: var(--secondary);       /* Marrón */
  color: white;
}

.btn-submit:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.btn-reset {
  background: #E0E0E0;
  color: var(--text);
}

.btn-reset:hover {
  background: #CCCCCC;
}

.btn-download {
  background: var(--accent);          /* Amarillo */
  color: var(--text);
}

.btn-download:hover {
  opacity: 0.9;
}
```

---

## 🎯 Funcionalidades Principales

### 1. **Landing Page Responsiva**

- ✅ Navbar con logo + links
- ✅ Hero section con imagen + overlay
- ✅ Secciones de servicios (2 bloques)
- ✅ Sección de contacto
- ✅ Footer con redes sociales
- ✅ Diseño mobile-first
- ✅ Scroll suave entre secciones

### 2. **Formulario de Inspección Interactivo**

**61 campos organizados en 8 secciones:**

```
1. Información del Cliente (5 campos)
   ├─ Nombre
   ├─ Teléfono
   ├─ Email
   ├─ Marca vehículo
   └─ Modelo

2. Información del Vehículo (7 campos)
   ├─ Año
   ├─ Patente
   ├─ VIN
   ├─ Kilometraje
   └─ Fecha inspección

3. Verificación Legal (4 campos)
   ├─ Estado matrícula (dropdown + observación)
   └─ Estado documentos (dropdown + observación)

4. Inspección Mecánica (12 campos)
   ├─ Motor (status + observación)
   ├─ Transmisión (status + observación)
   ├─ Frenos (status + observación)
   ├─ Suspensión (status + observación)
   ├─ Refrigerante (status + observación)
   └─ Scanner (status + códigos + observación)

5. Carrocería (8 campos)
   ├─ Pintura (condition + observación)
   ├─ Óxido (presence + observación)
   ├─ Cristales (condition + observación)
   └─ Luces (status + observación)

6. Interior (8 campos)
   ├─ Tapizado (condition + observación)
   ├─ Tablero (status + observación)
   ├─ Eléctrica (status + observación)
   └─ Aire acondicionado (status + observación)

7. Conclusión Final (3 campos)
   ├─ Estado general (dropdown)
   ├─ Reparaciones recomendadas
   └─ Observaciones finales

8. Firmas (3 campos)
   ├─ Nombre inspector
   ├─ Firma inspector
   └─ Firma cliente
```

**Características:**
- ✅ Dropdown menus para estados (Óptimo, Aceptable, Crítico)
- ✅ Campos de texto libre para observaciones
- ✅ Contador de caracteres (máx 800 en observaciones)
- ✅ Validación en tiempo real

### 3. **Sistema de Sugerencias con IA (Mock)**

**Funcionalidad:**
```
1. Usuario escribe observación
   ↓
2. Click en "✨ Mejorar"
   ↓
3. Loading (700ms)
   ↓
4. Se genera sugerencia automáticamente
   ↓
5. Preview con "Usar" / "Cancelar"
   ↓
6. Acepta o rechaza
```

**Lógica:**
```javascript
// Sugerencia mock
"Motor con evidencia de fugas" 
  ↓
"Este vehículo presenta motor con evidencia de fugas. Se recomienda..."
```

### 4. **Persistencia Automática en localStorage**

```javascript
// Guarda automáticamente cada cambio
useEffect(() => {
  localStorage.setItem('inspectionFormData', JSON.stringify(formData));
}, [formData]);

// Al recargar, recupera datos
useEffect(() => {
  const savedData = localStorage.getItem('inspectionFormData');
  if (savedData) setFormData(JSON.parse(savedData));
}, []);
```

**Ventajas:**
- ✅ No pierde datos si cierra accidentalmente
- ✅ Retoma donde dejó
- ✅ Funciona offline
- ✅ Sin necesidad de backend (por ahora)

### 5. **Generación de PDF Profesional**

**Características del PDF:**

```
📄 ESTRUCTURA DEL PDF
├─ HEADER
│  ├─ Logo + Título "CHELSAN CARS"
│  ├─ Subtítulo "Informe de Inspección Vehicular"
│  └─ Fecha actual
│
├─ TARJETA RESUMEN (2 columnas)
│  ├─ Cliente | Nombre
│  ├─ Teléfono | Vehículo
│  ├─ VIN | Año
│  └─ Patente | Kilometraje
│
├─ SECCIONES DINÁMICAS
│  ├─ Título con degradado (Amarillo → Marrón)
│  ├─ Label + Value en texto
│  ├─ Observación en caja redondeada
│  └─ Salto de página automático si es necesario
│
├─ PÁGINAS
│  ├─ Verificación Legal
│  ├─ Inspección Mecánica
│  ├─ Carrocería
│  ├─ Interior
│  ├─ Conclusión Final
│  └─ Firmas (si aplica)
│
└─ FOOTER (cada página)
   └─ "CHELSAN CARS - Informe generado automáticamente"
```

**Estilos PDF:**
- ✅ Font: Helvetica (bold/normal)
- ✅ Colores: Degradado amarillo → marrón en títulos
- ✅ Bordes redondeados en cajas
- ✅ Sombreado para profundidad
- ✅ Líneas multisenso para textos largos
- ✅ Layout responsivo (ajusta según contenido)

**Descarga:**
```javascript
doc.save(`Informe-${formData.licensePlate || 'auto'}.pdf`);
// Resultado: Informe-ABC123.pdf
```

---

## 💾 Persistencia de Datos

### localStorage

**Claves usadas:**

| Clave | Contenido | Tamaño | Tiempo de vida |
|-------|-----------|--------|----------------|
| `inspectionFormData` | Datos completos del formulario | ~5-10 KB | Permanente hasta limpiar |
| `inspectionReport` | Última inspección guardada | ~5-10 KB | Permanente |

**Flujo:**

```
✍️ Usuario escribe
  ↓
handleInputChange() / handleTextareaChange()
  ↓
setFormData(nuevos datos)
  ↓
useEffect detecta cambio
  ↓
localStorage.setItem('inspectionFormData', JSON.stringify(formData))
  ↓
💾 Guardado en disco del navegador
```

**Recuperación:**

```
🔄 Página recargada/reabierta
  ↓
useEffect en [] (mount)
  ↓
const savedData = localStorage.getItem('inspectionFormData')
  ↓
if (savedData) setFormData(JSON.parse(savedData))
  ↓
✅ Formulario completo restaurado
```

---

## 📄 Generación de PDF

### Librería: jsPDF

**Instalación:**
```bash
npm install jspdf
```

**Importación:**
```javascript
import jsPDF from 'jspdf';
```

### Proceso de Generación

```javascript
const handleDownloadPDF = () => {
  // 1. Crear nuevo documento
  const doc = new jsPDF();
  let yPosition = 0;

  // 2. HEADER
  doc.setFillColor(30, 30, 30);
  doc.rect(0, 0, 210, 25, 'F');
  doc.addImage(logo, 'PNG', 10, 2.5, 40, 20);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('CHELSAN CARS', 60, 14);
  yPosition = 35;

  // 3. TARJETA RESUMEN
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(15, yPosition, 180, 36, 3, 3, 'F');
  doc.text('Cliente:', 25, yPosition + 8);
  doc.text(formData.clientName, 45, yPosition + 8);
  // ... más líneas

  // 4. SECCIONES DINÁMICAS
  drawSection('VERIFICACIÓN LEGAL', [
    { label: 'Estado Matrícula', value: formData.registrationStatus, observation: formData.registrationObservations }
  ]);

  // 5. DESCARGAR
  doc.save(`Informe-${formData.licensePlate}.pdf`);
};
```

### Características Técnicas

#### Colores y Gradientes
```javascript
// Degradado manual (amarillo → marrón)
const interpolateColor = (startHex, endHex, step, totalSteps) => {
  const start = { r: 254, g: 212, b: 42 };  // #FED42A
  const end = { r: 137, g: 107, b: 62 };    // #896B3E
  const ratio = step / totalSteps;
  return {
    r: Math.round(start.r + (end.r - start.r) * ratio),
    g: Math.round(start.g + (end.g - start.g) * ratio),
    b: Math.round(start.b + (end.b - start.b) * ratio)
  };
};

// Aplicar en PDF
for (let i = 0; i < titleHeight; i++) {
  const color = interpolateColor('#FED42A', '#896B3E', i, titleHeight);
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(marginLeft, yPosition + i, boxWidth, 1, 'F');
}
```

#### Manejo de Páginas
```javascript
if (yPosition > 260) {
  drawFooter();           // Dibuja footer en página actual
  doc.addPage();          // Nueva página
  yPosition = 20;         // Reset Y position
}
```

#### Textos Multilínea
```javascript
const valueLines = doc.splitTextToSize(item.value, maxWidth);
doc.text(valueLines, x, y);
```

#### Bordes Redondeados
```javascript
doc.roundedRect(x, y, width, height, radiusX, radiusY, 'F');
// Dibuja rectángulo con esquinas redondeadas
```

---

## 🎨 Características UX/UI

### Diseño Responsivo

**Breakpoints:**
```css
@media (max-width: 1200px) {
  /* Tablets grandes */
}

@media (max-width: 768px) {
  /* Tablets y móviles */
  .feature-grid: grid-template-columns: 1fr;
  .navbar-hamburger: display block;
  .navbar-links: display none;
}

@media (max-width: 480px) {
  /* Móviles pequeños */
  padding: reducido;
  font-size: reducido;
}
```

### Accesibilidad

- ✅ HTML semántico (sections, nav, footer)
- ✅ Labels en inputs
- ✅ aria-label en buttons
- ✅ aria-expanded para menú hamburguesa
- ✅ Texto alternativo en imágenes

### Interactividad

```javascript
// Hover effects
transition: all 0.3s ease;
transform: scale(1.05);  // Botones

// Active states
.navbar-hamburger--open {}
.navbar-links--open {}

// Loading states
disabled={ state.loading }
{state.loading ? 'Mejorando...' : '✨ Mejorar'}
```

### Flujos de Usuario

#### Flujo 1: Completar Inspección
```
1. Usuario abre sitio
   ↓
2. Navega a Descargar Informe
   ↓
3. Rellena formulario (61 campos)
   ↓
4. Datos guardan automáticamente en localStorage
   ↓
5. Usuario completa inspección
   ↓
6. Click en "Descargar PDF"
   ↓
7. Se genera PDF profesional
   ↓
8. Descarga: Informe-ABC123.pdf
```

#### Flujo 2: Reanudar Inspección
```
1. Usuario abre sitio
   ↓
2. Navega a Descargar Informe
   ↓
3. Formulario aparece con datos previos
   ↓
4. Continúa desde donde dejó
   ↓
5. Completa campos faltantes
   ↓
6. Descarga PDF
```

#### Flujo 3: Usar Sugerencias de IA
```
1. Usuario escribe observación
2. Click "✨ Mejorar"
3. Espera loading (700ms)
4. Ve sugerencia mejorada
5. "Usar" → reemplaza texto
6. Continúa rellenando
```

---

## 🔧 Scripts y Comandos

### Instalación

```bash
cd frontend
npm install
```

### Scripts Disponibles

```json
{
  "dev": "vite",           // Inicia servidor desarrollo (puerto 5173)
  "build": "vite build",   // Build producción
  "preview": "vite preview" // Preview del build producción
}
```

### Uso

```bash
# Desarrollo
npm run dev
# Abre http://localhost:5173

# Producción
npm run build
# Genera carpeta dist/

# Preview producción
npm run preview
# Abre http://localhost:4173
```

### Estructura de carpeta después de build

```
dist/
├── index.html
├── assets/
│   ├── main.HASH.js
│   ├── main.HASH.css
│   ├── logo.HASH.png
│   ├── hero.HASH.jpg
│   ├── service.HASH.jpg
│   └── inspection.HASH.jpg
└── ...
```

---

## 🔄 Cómo Funciona (Flujo de Usuario)

### 1. **Página Carga (Index.html)**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <title>Chelsan Cars - Inspección de Autos</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 2. **React Mount (main.jsx)**

```javascript
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 3. **App se Renderiza (App.jsx)**

```javascript
function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <section id="servicios"> ... </section>
      <section id="contacto"> ... </section>
      <InspectionReport />
      <Footer />
    </>
  );
}
```

### 4. **Componentes Renderizan**

- `<Navbar />` → Renderiza navegación
- `<Hero />` → Renderiza banner
- `<InspectionReport />` → Renderiza formulario gigante
- `<Footer />` → Renderiza footer

### 5. **Usuario Interactúa**

```
Usuario llena campo
  ↓
handleInputChange() disparado
  ↓
setFormData() actualiza estado
  ↓
useEffect() detecta cambio en formData
  ↓
localStorage.setItem() guarda datos
  ↓
Componente re-renderiza con nuevos valores
```

### 6. **Descarga PDF**

```
Usuario click "Descargar PDF"
  ↓
handleDownloadPDF() ejecuta
  ↓
Crea instancia jsPDF
  ↓
Dibuja: header → resumen → secciones → footer
  ↓
doc.save('Informe-ABC123.pdf')
  ↓
Browser descarga archivo
```

---

## 📊 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Componentes** | 4 principales |
| **Líneas de código (JSX)** | ~2500+ |
| **Campos de formulario** | 61 |
| **Dependencias** | 5 |
| **Estilos CSS** | 500+ líneas |
| **Paleta de colores** | 6 colores principales |
| **Fuente tipográfica** | Montserrat (5 pesos) |
| **Breakpoints responsive** | 3 (desktop, tablet, mobile) |

---

## 🚀 Próximas Mejoras Planeadas

1. **Integración Backend:**
   - POST /inspection → guardar en PostgreSQL
   - POST /admin/login → autenticación
   - GET /inspection → recuperar reportes

2. **Features Avanzadas:**
   - ✅ IA real (OpenAI API o similar)
   - ✅ Multi-idioma (ES, EN, PT)
   - ✅ Captura de fotos en el formulario
   - ✅ Firma digital
   - ✅ Historial de inspecciones
   - ✅ Búsqueda por patente

3. **UI/UX:**
   - ✅ Dark mode
   - ✅ Animations mejoradas
   - ✅ Validaciones en tiempo real
   - ✅ Error handling robusto

4. **Performance:**
   - ✅ Code splitting
   - ✅ Lazy loading de componentes
   - ✅ Optimization de imágenes
   - ✅ Service workers (PWA)

---

## 📝 Notas Técnicas

### Decisiones de Diseño

1. **Functional Components + Hooks:** React moderno sin clases
2. **localStorage:** Persistencia sin backend (MVP)
3. **jsPDF:** Generación de PDFs sin servidor
4. **CSS Variables:** Fácil tematización
5. **Mobile-first:** Responsive desde inicio

### Limitaciones Actuales

- ❌ Sin backend (datos locales solamente)
- ❌ IA es mock (no conecta a OpenAI)
- ❌ Sin autenticación
- ❌ Sin base de datos
- ❌ Sin validaciones complejas
- ❌ Sin firmas digitales reales

### Ventajas del Setup Actual

- ✅ Muy rápido (Vite + React)
- ✅ Fácil de desplegar (solo HTML/CSS/JS)
- ✅ Sin dependencias pesadas
- ✅ Funciona offline
- ✅ Excelente DX (developer experience)

---

## 🎓 Conclusión

El **Frontend de CHELSAN CARS** es una aplicación moderna, responsiva y funcional que proporciona:

1. **Landing page atractiva** con presentación de servicios
2. **Formulario completo** de 61 campos para inspecciones vehiculares
3. **Sugerencias de IA** para mejorar observaciones
4. **PDF profesional** listo para descargar
5. **Persistencia automática** sin necesidad de servidor
6. **Diseño responsivo** para todos los dispositivos

Es una **MVP funcional y pulida** lista para mejorar con backend, autenticación y más features avanzadas en próximas iteraciones.

---

**Fecha de creación:** 29 de abril de 2026  
**Versión:** 0.0.1 (MVP)  
**Estado:** ✅ Funcional
