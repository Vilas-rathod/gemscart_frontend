import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer__top container">
      <div className="footer__brand">
        <div className="footer__logo">
          <span className="footer__logo-word">LUXE</span>
          <span className="footer__logo-sub">Jewellery</span>
        </div>
        <p className="footer__tagline">
          Timeless jewellery crafted for every woman. Each piece tells a story of artistry, love, and heritage.
        </p>
        <div className="footer__socials">
          {[
            { Icon: Instagram, href: '#', label: 'Instagram' },
            { Icon: Facebook,  href: '#', label: 'Facebook' },
            { Icon: Twitter,   href: '#', label: 'Twitter' },
            { Icon: Youtube,   href: '#', label: 'YouTube' }
          ].map(({ Icon, href, label }) => (
            <a key={label} href={href} className="footer__social-link" aria-label={label}>
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>

      <div className="footer__col">
        <h4 className="footer__heading">Shop</h4>
        {[
          ['New Arrivals', '/shop?filter=new'],
          ['Diamond Rings', '/shop?category=diamond-rings'],
          ['Necklaces', '/shop?category=necklaces'],
          ['Earrings', '/shop?category=earrings'],
          ['Bracelets', '/shop?category=bracelets'],
          ['Wedding Collection', '/shop?category=bridal-collection'],
        ].map(([label, path]) => (
          <Link key={label} to={path} className="footer__link">{label}</Link>
        ))}
      </div>

      <div className="footer__col">
        <h4 className="footer__heading">Customer Care</h4>
        {[
          ['Track Your Order', '/track'],
          ['Return & Exchange', '/returns'],
          ['Jewellery Care Guide', '/care'],
          ['Size Guide', '/size-guide'],
          ['Certification & Purity', '/certification'],
          ['Gift Wrapping', '/gifts'],
        ].map(([label, path]) => (
          <Link key={label} to={path} className="footer__link">{label}</Link>
        ))}
      </div>

      <div className="footer__col">
        <h4 className="footer__heading">Contact</h4>
        <div className="footer__contact-item">
          <Phone size={14} />
          <span>+91 98765 43210</span>
        </div>
        <div className="footer__contact-item">
          <Mail size={14} />
          <span>care@luxejewellery.in</span>
        </div>
        <div className="footer__contact-item">
          <MapPin size={14} />
          <span>Zaveri Bazaar, Mumbai — 400003</span>
        </div>

        <div className="footer__trust">
          <div className="footer__trust-badge">BIS Hallmarked</div>
          <div className="footer__trust-badge">IGI Certified</div>
          <div className="footer__trust-badge">GIA Graded</div>
        </div>
      </div>
    </div>

    <div className="footer__bottom container">
      <p className="footer__copy">© {new Date().getFullYear()} LUXE Jewellery. All rights reserved.</p>
      <div className="footer__legal">
        <Link to="/privacy" className="footer__legal-link">Privacy Policy</Link>
        <Link to="/terms" className="footer__legal-link">Terms of Service</Link>
        <Link to="/sitemap" className="footer__legal-link">Sitemap</Link>
      </div>
      <div className="footer__payments">
        {['Visa', 'MC', 'UPI', 'EMI', 'COD'].map(p => (
          <span key={p} className="footer__payment-chip">{p}</span>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
