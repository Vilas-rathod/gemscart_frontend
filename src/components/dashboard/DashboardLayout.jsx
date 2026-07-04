import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Store, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './dashboard.css';

/**
 * Shared shell for the Seller and Admin panels.
 * @param nav   [{ to, label, icon }]
 * @param title panel name shown in the sidebar sub-label
 */
const DashboardLayout = ({ nav, title }) => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className={`dash ${open ? 'sidebar-open' : ''}`}>
      <aside className="dash-sidebar">
        <Link to="/" className="dash-sidebar__brand">
          <span className="dash-sidebar__brand-word">LUXE</span>
          <span className="dash-sidebar__brand-sub">{title}</span>
        </Link>
        <nav className="dash-sidebar__nav">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className="dash-nav-link" onClick={() => setOpen(false)}>
              {Icon && <Icon size={18} />} {label}
            </NavLink>
          ))}
        </nav>
        <div className="dash-sidebar__foot">
          <Link to="/" className="dash-sidebar__store-link"><Store size={15} /> Back to Store</Link>
          <button className="dash-sidebar__store-link" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer' }} onClick={handleLogout}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {open && <div className="dash-sidebar__backdrop" onClick={() => setOpen(false)} />}

      <div className="dash-main">
        <header className="dash-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="dash-hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
            <span className="dash-topbar__title">{title}</span>
          </div>
          <div className="dash-topbar__right">
            <div className="dash-user">
              <div className="dash-user__avatar">{initials}</div>
              <div className="dash-user__meta">
                <span className="dash-user__name">{user?.name || user?.email}</span>
                <span className="dash-user__role">{user?.role}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
