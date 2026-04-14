import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <section id="servicios" className="services-section">
        <div className="section-content">
          <h2>Servicios de inspección</h2>
          <p>
            Realizamos una revisión completa de tu auto para detectar fallas en motor, carrocería,
            electrónica y seguridad. Nuestro informe te da claridad antes de comprar o vender.
          </p>
          <ul>
            <li>Inspección mecánica detallada</li>
            <li>Evaluación de carrocería y pintura</li>
            <li>Reporte claro con recomendaciones</li>
          </ul>
        </div>
      </section>

      <section id="contacto" className="contact-section">
        <div className="section-content">
          <h2>Contacto</h2>
          <p>Escríbenos para agendar tu inspección y recibir un informe profesional.</p>
          <p>Email: contacto@chelsancars.com</p>
          <p>Teléfono: +54 9 11 1234 5678</p>
        </div>
      </section>
    </div>
  );
}

export default App;
