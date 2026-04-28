import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cierra el menú al hacer click en un link
  const handleLinkClick = () => setMenuOpen(false);

  // Bloquea el scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen])

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Chelsan Cars Logo" />
        </div>

        {/* Links — desktop */}
        <ul className={`navbar-links ${menuOpen ? 'navbar-links--open' : ''}`}>
          <li><a href="#servicios" onClick={handleLinkClick}>Servicios</a></li>
          <li><a href="#contacto" onClick={handleLinkClick}>Contacto</a></li>
          <li>
            <a href="#descargar" className="navbar-cta" onClick={handleLinkClick}>
              Descargar Informe
            </a>
          </li>
        </ul>

        {/* Botón hamburguesa — solo mobile */}
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