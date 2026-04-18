import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Footer from './components/Footer.jsx';
import serviceImage from './assets/service.jpg';
import inspectionImage from './assets/inspection.jpg';
import InspectionReport from './components/InspectionReport';

function App() {
  return (
    <>
      <Navbar />
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
        <div id="descargar" />
        <div id="contacto" className="contact-content">
          <div>
            <p className="eyebrow">Contacto</p>
            <h2>Agendá tu inspección hoy</h2>
            <p>
              Completa el formulario, envíanos tus datos y obtén un informe profesional de tu auto.
              Estamos listos para ayudarte con cualquier consulta.
            </p>
          </div>

          <div className="contact-details">
            <p><strong>Email:</strong> contacto@chelsancars.com</p>
            <p><strong>Teléfono:</strong> +54 9 11 1234 5678</p>
            <p><strong>Ubicación:</strong> Buenos Aires, Argentina</p>
          </div>
        </div>
      </section>
      <InspectionReport />
      <Footer />
    </>
  );
}

export default App;
