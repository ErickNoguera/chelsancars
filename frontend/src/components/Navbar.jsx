import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

function Navbar({ onCrearInforme, onDescargarInforme, onCerrarSesion, modoFormulario }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Modo formulario: solo muestra logo y botón de cerrar sesión
  if (modoFormulario) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <img src={logo} alt="Chelsan Cars Logo" />
          </div>
          <ul className="navbar-links">
            <li>
              <button className="navbar-cta" onClick={onCerrarSesion} style={{ cursor: 'pointer' }}>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  // Modo landing: navegación completa
  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Chelsan Cars Logo" />
        </div>

        <ul className={`navbar-links ${menuOpen ? 'navbar-links--open' : ''}`}>
          <li><a href="#servicios" onClick={handleLinkClick}>Servicios</a></li>
          <li><a href="#contacto" onClick={handleLinkClick}>Contacto</a></li>
          <li>
            <button
              className="navbar-link-btn"
              onClick={() => { handleLinkClick(); onDescargarInforme?.(); }}
            >
              Descargar Informe
            </button>
          </li>
          <li>
            <button
              className="navbar-cta"
              onClick={() => { handleLinkClick(); onCrearInforme?.(); }}
            >
              Crear Informe
            </button>
          </li>
        </ul>

        <button
          className={`navbar-hamburger ${menuOpen ? 'navbar-hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
