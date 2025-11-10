import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Layout() {
  const { isAuthenticated, logout, user } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div>
      <nav style={navStyle}>
        <div className="container" style={navContainerStyle}>
          <Link to="/" style={logoStyle}>
            <span style={{ fontSize: '1.75rem' }}>🐾</span>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>SABUESOS</span>
              <span style={{ fontSize: '0.625rem', color: '#3B82F6', fontWeight: 600 }}>PASTO</span>
            </div>
          </Link>
          <div style={navLinksStyle}>
            {isAuthenticated() && (
              <>
                <span style={userStyle}>👋 {user?.name}</span>
                <button onClick={logout} style={logoutBtn}>
                  Salir
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <main style={{ minHeight: 'calc(100vh - 140px)' }}>
        <Outlet />
      </main>
      
      {/* Bottom Navigation */}
      <nav style={bottomNavStyle}>
        <Link to="/" style={isActive('/') ? activeNavItemStyle : navItemStyle}>
          <span style={{ fontSize: '1.5rem' }}>🏠</span>
          <span style={{ fontSize: '0.625rem', marginTop: '0.25rem' }}>Inicio</span>
        </Link>
        <Link to="/map" style={isActive('/map') ? activeNavItemStyle : navItemStyle}>
          <span style={{ fontSize: '1.5rem' }}>🗺️</span>
          <span style={{ fontSize: '0.625rem', marginTop: '0.25rem' }}>Mapa</span>
        </Link>
        <Link to="/report" style={reportBtnStyle}>
          <span style={{ fontSize: '2rem' }}>📍</span>
        </Link>
        <Link to="/dashboard" style={isActive('/dashboard') ? activeNavItemStyle : navItemStyle}>
          <span style={{ fontSize: '1.5rem' }}>🐕</span>
          <span style={{ fontSize: '0.625rem', marginTop: '0.25rem' }}>Mis Mascotas</span>
        </Link>
        <Link to={isAuthenticated() ? '/dashboard' : '/login'} style={isActive('/login') || isActive('/register') ? activeNavItemStyle : navItemStyle}>
          <span style={{ fontSize: '1.5rem' }}>👤</span>
          <span style={{ fontSize: '0.625rem', marginTop: '0.25rem' }}>Perfil</span>
        </Link>
      </nav>
    </div>
  );
}

const navStyle: React.CSSProperties = {
  backgroundColor: 'white',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  padding: '1rem 0',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

const navContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  textDecoration: 'none',
  color: '#111827',
};

const navLinksStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
};

const userStyle: React.CSSProperties = {
  color: '#6B7280',
  fontSize: '0.875rem',
  fontWeight: 600,
};

const logoutBtn: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  border: '2px solid #E5E7EB',
  background: 'white',
  color: '#374151',
  fontWeight: 600,
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const bottomNavStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'white',
  boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: '0.75rem 0',
  zIndex: 100,
};

const navItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textDecoration: 'none',
  color: '#9CA3AF',
  transition: 'all 0.3s ease',
  padding: '0.5rem',
  fontWeight: 600,
};

const activeNavItemStyle: React.CSSProperties = {
  ...navItemStyle,
  color: '#3B82F6',
};

const reportBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
  textDecoration: 'none',
  marginTop: '-1.5rem',
  transition: 'all 0.3s ease',
};
