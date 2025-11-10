import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(apiUrl('/auth/register'), formData);
      setAuth(response.data.user, response.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={contentWrapper}>
        {/* Logo and Header */}
        <div style={headerSection}>
          <div style={logoContainer}>
            <span style={{ fontSize: '4rem' }}>🐾</span>
          </div>
          <h1 style={titleStyle}>SABUESOS</h1>
          <p style={subtitleStyle}>Pasto</p>
        </div>

        {/* Register Form */}
        <div style={formCard}>
          <h2 style={formTitle}>Registrarse</h2>
          <p style={formSubtitle}>Crea tu cuenta para comenzar</p>

          {error && <div style={errorStyle}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={fieldStyle}>
              <label>Nombre completo</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Juan Pérez"
                required
              />
            </div>
            <div style={fieldStyle}>
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tu@email.com"
                required
              />
            </div>
            <div style={fieldStyle}>
              <label>Contraseña</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Crear Cuenta
            </button>
          </form>

          <div style={dividerStyle}>
            <span>o</span>
          </div>

          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className="btn btn-secondary" style={{ width: '100%' }}>
              Ya tengo cuenta
            </button>
          </Link>

          <p style={footerText}>
            Al registrarte, aceptas nuestros términos y condiciones
          </p>
        </div>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem 1rem',
};

const contentWrapper: React.CSSProperties = {
  maxWidth: '400px',
  width: '100%',
};

const headerSection: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '2rem',
};

const logoContainer: React.CSSProperties = {
  marginBottom: '1rem',
};

const titleStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 800,
  color: '#111827',
  marginBottom: '0.25rem',
  letterSpacing: '1px',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#3B82F6',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '2px',
};

const formCard: React.CSSProperties = {
  background: 'white',
  borderRadius: '24px',
  padding: '2rem',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
};

const formTitle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#111827',
  marginBottom: '0.5rem',
  textAlign: 'center',
};

const formSubtitle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#6B7280',
  textAlign: 'center',
  marginBottom: '2rem',
};

const fieldStyle: React.CSSProperties = {
  marginBottom: '1.25rem',
};

const errorStyle: React.CSSProperties = {
  backgroundColor: '#FEE2E2',
  color: '#DC2626',
  padding: '0.875rem',
  borderRadius: '12px',
  marginBottom: '1rem',
  fontSize: '0.875rem',
  textAlign: 'center',
  border: '1px solid #FCA5A5',
};

const dividerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  margin: '1.5rem 0',
  color: '#9CA3AF',
  fontSize: '0.875rem',
};

const footerText: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '1.5rem',
  color: '#6B7280',
  fontSize: '0.75rem',
  lineHeight: 1.5,
};
