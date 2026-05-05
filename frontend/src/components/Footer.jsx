import { FaInstagram, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaTiktok, FaTwitter, FaFacebook } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>Chelsan Cars</h3>
          <p>Servicio premium de inspección automotriz para vehículos confiables y seguros.</p>
        </div>

        <div className="footer-links">
          <a href="https://www.instagram.com/chelsancars?igsh=MWhmeTFuNHIzNDExeA==" target="_blank" rel="noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://wa.me/56921759721" target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <FaWhatsapp />
          </a>
          <a href="tel:+56921759721" aria-label="Phone">
            <FaPhoneAlt />
          </a>
          <a href="mailto:chelsancars@gmail.com" aria-label="Email">
            <FaEnvelope />
          </a>
          <a href="https://www.facebook.com/share/18sT5fHV7U/" target="_blank" rel="noreferrer" aria-label="Facebook">
            <FaFacebook />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
