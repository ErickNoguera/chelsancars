import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="Chelsan Cars Logo" />
        </div>
        <ul className="navbar-links">
          <li><a href="#servicios">Servicios</a></li>
          <li><a href="#contacto">Contacto</a></li>
          <li><a href="#descargar" className="navbar-cta">Descargar Informe</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;