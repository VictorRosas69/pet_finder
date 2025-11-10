import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { apiUrl } from '../config/api';

export default function ReportPet() {
  const [formData, setFormData] = useState({
    type: 'LOST',
    description: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      alert('Debes iniciar sesión para reportar');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        apiUrl('/reports'),
        {
          ...formData,
          location: { latitude: 1.2136, longitude: -77.2811 },
          contactInfo: {
            name: formData.contactName,
            phone: formData.contactPhone,
            email: formData.contactEmail,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('✅ Reporte creado exitosamente');
      navigate('/map');
    } catch (error) {
      console.error('Error creando reporte:', error);
      alert('❌ Error al crear el reporte');
    }
  };

  const getTypeInfo = (type: string) => {
    const info: any = {
      LOST: { emoji: '🔴', label: 'Mascota Perdida', color: '#D32F2F', bg: '#FFE5E5' },
      FOUND: { emoji: '🟢', label: 'Mascota Encontrada', color: '#388E3C', bg: '#E8F5E9' },
      SIGHTING: { emoji: '🟡', label: 'Avistamiento', color: '#F57C00', bg: '#FFF9E6' }
    };
    return info[type];
  };

  const currentTypeInfo = getTypeInfo(formData.type);

  return (
    <div style={containerStyle}>
      <div className="container" style={{ maxWidth: '600px' }}>
        {/* Header */}
        <div style={headerSection} className="animate-fade-in">
          <div style={iconContainer}>
            <span style={{ fontSize: '3rem' }}>📍</span>
          </div>
          <h1 style={titleStyle}>Reportar Mascota</h1>
          <p style={subtitleStyle}>
            Ayúdanos a reunir familias en Pasto
          </p>
        </div>

        {/* Progress Steps */}
        <div style={progressContainer}>
          <div style={step >= 1 ? activeStep : inactiveStep}>
            <span style={stepNumber}>1</span>
            <span style={stepLabel}>Tipo</span>
          </div>
          <div style={progressLine} />
          <div style={step >= 2 ? activeStep : inactiveStep}>
            <span style={stepNumber}>2</span>
            <span style={stepLabel}>Detalles</span>
          </div>
          <div style={progressLine} />
          <div style={step >= 3 ? activeStep : inactiveStep}>
            <span style={stepNumber}>3</span>
            <span style={stepLabel}>Contacto</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={formContainer} className="animate-slide-up">
          {step === 1 && (
            <div>
              <h2 style={sectionTitle}>Selecciona el tipo de reporte</h2>
              <div style={typeGrid}>
                {['LOST', 'FOUND', 'SIGHTING'].map((type) => {
                  const info = getTypeInfo(type);
                  const isSelected = formData.type === type;
                  return (
                    <div
                      key={type}
                      onClick={() => setFormData({ ...formData, type })}
                      style={{
                        ...typeCard,
                        border: isSelected ? `3px solid ${info.color}` : '3px solid #FFE5D9',
                        background: isSelected ? info.bg : 'white',
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      <span style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{info.emoji}</span>
                      <span style={{ fontWeight: 700, color: info.color }}>{info.label}</span>
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '2rem' }}
              >
                Continuar →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={sectionTitle}>Describe a la mascota</h2>
              <div style={fieldContainer}>
                <label>Descripción Detallada</label>
                <textarea
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ej: Perro Labrador dorado, collar rojo, muy amigable, responde al nombre de Max..."
                  required
                  style={textareaStyle}
                />
                <p style={helperText}>
                  💡 Incluye: raza, color, tamaño, señas particulares, collar, comportamiento
                </p>
              </div>
              <div style={buttonGroup}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  ← Atrás
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={!formData.description}
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={sectionTitle}>Información de contacto</h2>
              <div style={fieldContainer}>
                <label>Nombre Completo</label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="Juan Pérez"
                  required
                />
              </div>
              <div style={fieldContainer}>
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="+57 300 1234567"
                />
              </div>
              <div style={fieldContainer}>
                <label>Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              {/* Summary */}
              <div style={summaryCard}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#2D1810' }}>
                  📋 Resumen del reporte
                </h3>
                <div style={summaryItem}>
                  <span style={{ color: '#6B5B4F' }}>Tipo:</span>
                  <span style={{ fontWeight: 700, color: currentTypeInfo.color }}>
                    {currentTypeInfo.emoji} {currentTypeInfo.label}
                  </span>
                </div>
                <div style={summaryItem}>
                  <span style={{ color: '#6B5B4F' }}>Descripción:</span>
                  <span style={{ fontWeight: 600 }}>{formData.description.substring(0, 50)}...</span>
                </div>
              </div>

              <div style={buttonGroup}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  ← Atrás
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  🚀 Publicar Reporte
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  minHeight: 'calc(100vh - 140px)',
  padding: '2rem 1rem',
  background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE5D9 100%)',
};

const headerSection: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '2rem',
};

const iconContainer: React.CSSProperties = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 1rem auto',
  boxShadow: '0 8px 24px rgba(255, 107, 53, 0.3)',
};

const titleStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 800,
  color: '#2D1810',
  marginBottom: '0.5rem',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#6B5B4F',
  fontWeight: 500,
};

const progressContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '2rem',
  padding: '1.5rem',
  background: 'white',
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
};

const activeStep: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
};

const inactiveStep: React.CSSProperties = {
  ...activeStep,
  opacity: 0.4,
};

const stepNumber: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: '1.125rem',
};

const stepLabel: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '#2D1810',
  textTransform: 'uppercase',
};

const progressLine: React.CSSProperties = {
  width: '60px',
  height: '3px',
  background: 'linear-gradient(90deg, #FF6B35 0%, #FF8C42 100%)',
  margin: '0 1rem',
};

const formContainer: React.CSSProperties = {
  background: 'white',
  borderRadius: '20px',
  padding: '2rem',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
};

const sectionTitle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 800,
  color: '#2D1810',
  marginBottom: '1.5rem',
  textAlign: 'center',
};

const typeGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '1rem',
};

const typeCard: React.CSSProperties = {
  padding: '2rem 1rem',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
};

const fieldContainer: React.CSSProperties = {
  marginBottom: '1.5rem',
};

const textareaStyle: React.CSSProperties = {
  resize: 'vertical',
  minHeight: '120px',
};

const helperText: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#9CA3AF',
  marginTop: '0.5rem',
  fontStyle: 'italic',
};

const buttonGroup: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  marginTop: '2rem',
};

const summaryCard: React.CSSProperties = {
  background: '#FFF9E6',
  borderRadius: '12px',
  padding: '1.5rem',
  marginTop: '1.5rem',
  border: '2px solid #FFE5D9',
};

const summaryItem: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '0.75rem',
  fontSize: '0.875rem',
};

