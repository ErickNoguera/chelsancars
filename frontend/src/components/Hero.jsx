function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Inspección de autos profesional</p>
        <h1>Tu auto en manos seguras antes de comprar o vender</h1>
        <p>
          Analizamos cada detalle del motor, la carrocería y el historial del vehículo para que tomes
          decisiones con tranquilidad.
        </p>
        <a className="hero-button" href="#contacto">
          Solicitar inspección
        </a>
      </div>
      <div className="hero-image">
        <div className="hero-card">
          <h3>Informe claro</h3>
          <p>Resultados precisos y recomendaciones finales en un documento listo para usar.</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
