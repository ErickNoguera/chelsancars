import heroImage from '../assets/hero.jpg';

function Hero() {
  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `linear-gradient(rgba(6, 7, 6, 0.45), rgba(6, 7, 6, 0.45)), url(${heroImage})` }}
    >
      <div className="hero-content">
        <p className="eyebrow">Inspección de autos premium</p>
        <h1>Tu auto inspeccionado con precisión y confianza</h1>
        <p>
          Evaluaciones completas con recomendaciones claras para que cada viaje sea seguro y tu
          inversión esté protegida.
        </p>
        <a className="hero-button" href="#contacto">
          Solicitar inspección
        </a>
      </div>
    </section>
  );
}

export default Hero;
