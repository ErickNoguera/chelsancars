import { FaInstagram, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaTiktok, FaTwitter } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>Chelsan Cars</h3>
          <p>Servicio premium de inspección automotriz para vehículos confiables y seguros.</p>
        </div>

        <div className="footer-links">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://wa.me/5491112345678" target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <FaWhatsapp />
          </a>
          <a href="tel:+5491112345678" aria-label="Phone">
            <FaPhoneAlt />
          </a>
          <a href="mailto:contacto@chelsancars.com" aria-label="Email">
            <FaEnvelope />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok">
            <FaTiktok />
          </a>
          <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
