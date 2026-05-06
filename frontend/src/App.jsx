import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Footer from './components/Footer.jsx';
import LoginForm from './components/LoginForm.jsx';
import InspectionReport from './components/InspectionReport.jsx';
import DescargaPDFModal from './components/DescargaPDFModal.jsx';
import { logoutApi } from './services/api';
import serviceImage from './assets/service.jpg';
import inspectionImage from './assets/inspection.jpg';

// Verifica si hay un token JWT válido guardado en localStorage
function tokenValido() {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function App() {
  // 'landing' | 'login' | 'formulario'
  const [vista, setVista] = useState('landing');
  const [mostrarModalDescarga, setMostrarModalDescarga] = useState(false);

  const handleCrearInforme = () => {
    // Si ya tiene sesión activa, va directo al formulario
    if (tokenValido()) {
      setVista('formulario');
    } else {
      setVista('login');
    }
  };

  const handleLoginExitoso = (token, refreshToken) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    setVista('formulario');
  };

  const handleCerrarSesion = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try { await logoutApi(refreshToken); } catch { /* si falla, igual limpiamos */ }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setVista('landing');
  };

  // ===== VISTA: FORMULARIO DE INSPECCIÓN =====
  if (vista === 'formulario') {
    return (
      <>
        <Navbar modoFormulario onCerrarSesion={handleCerrarSesion} />
        <InspectionReport onCerrarSesion={handleCerrarSesion} />
      </>
    );
  }

  // ===== VISTA: LOGIN =====
  if (vista === 'login') {
    return (
      <LoginForm
        onLoginExitoso={handleLoginExitoso}
        onVolver={() => setVista('landing')}
      />
    );
  }

  // ===== VISTA: LANDING PAGE =====
  return (
    <>
      <Navbar
        onCrearInforme={handleCrearInforme}
        onDescargarInforme={() => setMostrarModalDescarga(true)}
      />

      <Hero />

      <section id="servicios" className="feature-section">
        <div className="feature-grid">
          <div className="feature-copy">
            <p className="eyebrow">Servicios a medida</p>
            <h2>Inspección profesional para cada vehículo</h2>
            <p>
              Chelsan Cars ofrece una evaluación técnica completa con foco en seguridad, motor,
              carrocería y valor de reventa. Nuestro servicio te ayuda a tomar decisiones más
              informadas al comprar, vender o revisar tu auto.
            </p>
            <ul>
              <li>Evaluación completa del motor y transmisión</li>
              <li>Revisión de carrocería, pintura y golpes previos</li>
              <li>Informe detallado con recomendaciones finales</li>
            </ul>
          </div>
          <div className="feature-media">
            <img src={serviceImage} alt="Servicios de inspección" />
          </div>
        </div>
      </section>

      <section className="feature-section section-alt">
        <div className="feature-grid reverse">
          <div className="feature-media">
            <img src={inspectionImage} alt="Inspección de autos" />
          </div>
          <div className="feature-copy">
            <p className="eyebrow">Inspección detallada</p>
            <h2>Detectamos los detalles que otros no ven</h2>
            <p>
              Nuestro proceso combina experiencia mecánica y una revisión visual minuciosa. Cada
              informe está diseñado para que comprendas el verdadero estado del vehículo en pocos
              minutos.
            </p>
            <ul>
              <li>Análisis del estado del motor y sistema eléctrico</li>
              <li>Chequeo de frenos, suspensión y alineación</li>
              <li>Revisión exhaustiva de interiores y exteriores</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div id="contacto" className="contact-content">
          <div>
            <p className="eyebrow">Contacto</p>
            <h2>Agendá tu inspección hoy</h2>
            <p>
              Contáctanos por nuestras redes y agenda tu inspección en minutos.
Recibe un servicio profesional y resuelve cualquier duda con nuestro equipo.
            </p>
          </div>
          <div className="contact-details">
            <p><strong>Email:</strong> chelsancars@gmail.com</p>
            <p><strong>Teléfono:</strong> +56 9 2175 9721</p>
            <p><strong>Ubicación:</strong> Santiago de Chile, Chile</p>
          </div>
        </div>
      </section>

      <Footer />

      {mostrarModalDescarga && (
        <DescargaPDFModal onCerrar={() => setMostrarModalDescarga(false)} />
      )}
    </>
  );
}

export default App;
