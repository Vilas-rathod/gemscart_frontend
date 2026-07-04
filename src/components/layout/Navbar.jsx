import { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../context/AuthContext';
import { navLinks } from '../../data/products';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const handleSignOut = useCallback(() => {
    closeMobile();
    logout();
    // Replace history so the Back button can't return to a protected page.
    navigate('/', { replace: true });
  }, [closeMobile, logout, navigate]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isHome = location.pathname === '/';

  return (
    <header className={`navbar ${scrolled || !isHome ? 'navbar--scrolled' : ''}`}>
      {/* ── Search Overlay ── */}
      {searchOpen && (
        <div className="search-overlay">
          <div className="search-inner container">
            <Search size={20} className="search-icon-inline" />
            <input
              autoFocus
              type="text"
              placeholder="Search rings, necklaces, bangles…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button onClick={() => setSearchOpen(false)} className="search-close" aria-label="Close search">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="navbar__inner container">
        {/* ── Hamburger (mobile) ── */}
        <button className="navbar__hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* ── Logo ── */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-word">LUXE</span>
          <span className="navbar__logo-sub">Jewellery</span>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <nav className="navbar__links">
          {navLinks.slice(0, 7).map(link => (
            <NavLink
              key={link.label}
              to={link.path}
              className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* ── Icon Actions ── */}
        <div className="navbar__actions">
          <button className="navbar__icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
            <Search size={20} />
          </button>
          <Link to={isAuthenticated ? '/profile' : '/login'} className="navbar__icon-btn" aria-label="Account">
            <User size={20} />
          </Link>
          <Link to="/wishlist" className="navbar__icon-btn" aria-label="Wishlist">
            <Heart size={20} />
            {wishlistItems.length > 0 && <span className="navbar__badge">{wishlistItems.length}</span>}
          </Link>
          <Link to="/cart" className="navbar__icon-btn navbar__cart-btn" aria-label="Cart">
            <ShoppingBag size={20} />
            {itemCount > 0 && <span className="navbar__badge">{itemCount}</span>}
          </Link>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <div
        className={`navbar__mobile-drawer ${mobileOpen ? 'open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <div className="navbar__mobile-header">
          <Link to="/" className="navbar__logo" onClick={closeMobile}>
            <span className="navbar__mobile-logo-word">LUXE</span>
            <span className="navbar__mobile-logo-sub">Jewellery</span>
          </Link>
          <button className="navbar__mobile-close" onClick={closeMobile} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        <div className="navbar__mobile-inner">
          {navLinks.map(link => (
            <NavLink key={link.label} to={link.path} className="navbar__mobile-link" onClick={closeMobile}>
              {link.label}
            </NavLink>
          ))}
          <div className="navbar__mobile-divider" />
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className="navbar__mobile-link" onClick={closeMobile}>My Account</NavLink>
              <button type="button" className="navbar__mobile-link navbar__mobile-link--btn" onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <NavLink to="/login" className="navbar__mobile-link" onClick={closeMobile}>Login / Register</NavLink>
          )}
          <NavLink to="/wishlist" className="navbar__mobile-link" onClick={closeMobile}>Wishlist ({wishlistItems.length})</NavLink>
          <NavLink to="/cart" className="navbar__mobile-link" onClick={closeMobile}>Cart ({itemCount})</NavLink>
        </div>
      </div>

      {/* ── Mobile Backdrop ── */}
      <div
        className={`navbar__backdrop ${mobileOpen ? 'open' : ''}`}
        onClick={closeMobile}
        aria-hidden="true"
      />
    </header>
  );
};

export default Navbar;
