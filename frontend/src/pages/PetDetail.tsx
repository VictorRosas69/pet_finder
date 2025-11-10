import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PetImage from '../components/PetImage';
import { apiUrl } from '../config/api';

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await axios.get(apiUrl('/reports'));
      const foundReport = response.data.find((r: any) => r.id === id);
      setReport(foundReport);
    } catch (error) {
      console.error('Error cargando reporte:', error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  if (loading) {
    return (
      <div style={loadingContainer} className="animate-fade-in">
        <div className="float-animation">
          <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐾</span>
        </div>
        <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#6B5B4F' }}>Cargando...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={errorContainer}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😢</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Reporte no encontrado</h2>
        <p style={{ color: '#6B5B4F', marginBottom: '2rem' }}>No pudimos encontrar este reporte</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          ← Volver al inicio
        </button>
      </div>
    );
  }

  const getTypeInfo = (type: string) => {
    const info: any = {
      LOST: { emoji: '🔴', label: 'Perdida', color: '#D32F2F', bg: '#FFE5E5', gradient: 'linear-gradient(135deg, #FFE5E5 0%, #FFF0F0 100%)' },
      FOUND: { emoji: '🟢', label: 'Encontrada', color: '#388E3C', bg: '#E8F5E9', gradient: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8F4 100%)' },
      SIGHTING: { emoji: '🟡', label: 'Avistamiento', color: '#F57C00', bg: '#FFF9E6', gradient: 'linear-gradient(135deg, #FFF9E6 0%, #FFFBF0 100%)' }
    };
    return info[type] || info.LOST;
  };

  const typeInfo = getTypeInfo(report.type);

  return (
    <div style={pageContainer}>
      {/* Header with Image */}
      <div style={imageContainer}>
        <PetImage
          src={report.imageUrl}
          alt={report.description}
          style={headerImage}
          fallbackType={report.description.toLowerCase().includes('gat') ? 'cat' : 'dog'}
        />
        
        {/* Gradient overlay for better button visibility */}
        <div style={imageOverlay} />
        
        <button onClick={() => navigate(-1)} style={backButton} className="glass-effect">
          <span style={{ fontSize: '1.25rem' }}>←</span>
          <span>Volver</span>
        </button>

        <div style={statusBadgeTop}>
          <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>{typeInfo.emoji}</span>
          <span style={{ fontWeight: 800, fontSize: '1rem' }}>{typeInfo.label}</span>
        </div>
      </div>

      {/* Content */}
      <div style={contentContainer} className="animate-slide-up">
        <div style={titleContainer}>
          <div style={titleDecoration} />
          <h1 style={titleStyle}>Mascota {typeInfo.label}</h1>
        </div>

        {/* Description Card - Enhanced */}
        <div style={descriptionCard} className="pet-card">
          <div style={iconCircle}>
            <span style={{ fontSize: '2rem' }}>📝</span>
          </div>
          <div style={cardContent}>
            <h3 style={modernCardTitle}>Descripción</h3>
            <p style={modernDescriptionText}>{report.description}</p>
          </div>
        </div>

        {/* Info Grid - Location & Date */}
        <div style={infoGrid}>
          {/* Location Card */}
          <div style={modernInfoCard} className="pet-card">
            <div style={smallIconCircle}>
              <span style={{ fontSize: '1.75rem' }}>📍</span>
            </div>
            <div style={infoCardContent}>
              <span style={infoCardLabel}>Ubicación</span>
              <span style={infoCardValue}>Pasto, Nariño</span>
              <span style={infoCardSubtext}>Colombia</span>
            </div>
          </div>

          {/* Date Card */}
          <div style={modernInfoCard} className="pet-card">
            <div style={smallIconCircle}>
              <span style={{ fontSize: '1.75rem' }}>📅</span>
            </div>
            <div style={infoCardContent}>
              <span style={infoCardLabel}>Fecha</span>
              <span style={infoCardValue}>
                {new Date(report.createdAt).toLocaleDateString('es-CO', {
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
              <span style={infoCardSubtext}>
                {new Date(report.createdAt).toLocaleDateString('es-CO', {
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Coordinates Badge */}
        <div style={coordinatesBadge}>
          <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>📌</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6B7280' }}>
            {report.location.latitude.toFixed(4)}, {report.location.longitude.toFixed(4)}
          </span>
        </div>

        {/* Contact Card - Enhanced */}
        <div style={modernContactCard} className="pet-card">
          <div style={contactHeader}>
            <div style={contactHeaderIcon}>
              <span style={{ fontSize: '2rem' }}>👤</span>
            </div>
            <h3 style={contactHeaderTitle}>Información de Contacto</h3>
          </div>
          
          <div style={modernContactGrid}>
            <div style={modernContactItem}>
              <div style={modernContactIcon}>
                <span style={{ fontSize: '1.5rem' }}>👤</span>
              </div>
              <div style={modernContactInfo}>
                <span style={modernContactLabel}>Nombre</span>
                <span style={modernContactValue}>{report.contactInfo.name}</span>
              </div>
            </div>

            {report.contactInfo.phone && (
              <div style={modernContactItem}>
                <div style={modernContactIcon}>
                  <span style={{ fontSize: '1.5rem' }}>📱</span>
                </div>
                <div style={modernContactInfo}>
                  <span style={modernContactLabel}>Teléfono</span>
                  <span style={modernContactValue}>{report.contactInfo.phone}</span>
                </div>
              </div>
            )}

            {report.contactInfo.email && (
              <div style={modernContactItem}>
                <div style={modernContactIcon}>
                  <span style={{ fontSize: '1.5rem' }}>📧</span>
                </div>
                <div style={modernContactInfo}>
                  <span style={modernContactLabel}>Email</span>
                  <span style={modernContactValue}>{report.contactInfo.email}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Enhanced */}
        <div style={modernActionButtons}>
          <button 
            style={primaryActionButton}
            onClick={() => window.location.href = `tel:${report.contactInfo.phone}`}
          >
            <div style={actionButtonIcon}>
              <span style={{ fontSize: '1.5rem' }}>📞</span>
            </div>
            <div style={actionButtonContent}>
              <span style={actionButtonLabel}>Llamar</span>
              <span style={actionButtonText}>Contactar ahora</span>
            </div>
          </button>
          
          <button 
            style={secondaryActionButton}
            onClick={() => window.location.href = `mailto:${report.contactInfo.email}`}
          >
            <div style={actionButtonIcon}>
              <span style={{ fontSize: '1.5rem' }}>✉️</span>
            </div>
            <div style={actionButtonContent}>
              <span style={actionButtonLabel}>Email</span>
              <span style={actionButtonText}>Enviar mensaje</span>
            </div>
          </button>
        </div>

        {/* Share Button - Enhanced */}
        <button style={modernShareButton}>
          <span style={{ fontSize: '1.25rem' }}>🔗</span>
          <span style={{ fontWeight: 700 }}>Compartir Reporte</span>
        </button>
      </div>
    </div>
  );
}

const pageContainer: React.CSSProperties = {
  minHeight: 'calc(100vh - 140px)',
  background: '#FFF5F0',
};

const loadingContainer: React.CSSProperties = {
  minHeight: 'calc(100vh - 140px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const errorContainer: React.CSSProperties = {
  minHeight: 'calc(100vh - 140px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  textAlign: 'center',
};

const imageContainer: React.CSSProperties = {
  position: 'relative',
  height: '400px',
  borderRadius: '0 0 40px 40px',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const headerImage: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  objectPosition: 'center',
  backgroundColor: '#F3F4F6',
};

const imageOverlay: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.05) 100%)',
  pointerEvents: 'none',
  zIndex: 1,
};

const backButton: React.CSSProperties = {
  position: 'absolute',
  top: '1rem',
  left: '1rem',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: 'none',
  padding: '0.75rem 1.25rem',
  borderRadius: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: '#111827',
  fontSize: '0.875rem',
  transition: 'all 0.3s ease',
  zIndex: 10,
};

const petImageWrapper: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  padding: '2rem 0',
};

const petImageCircle: React.CSSProperties = {
  width: '180px',
  height: '180px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  border: '4px solid rgba(255, 255, 255, 0.5)',
};

const statusBadgeTop: React.CSSProperties = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  display: 'flex',
  alignItems: 'center',
  padding: '0.75rem 1.25rem',
  borderRadius: '24px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  color: '#2D1810',
  zIndex: 10,
};

const contentContainer: React.CSSProperties = {
  maxWidth: '600px',
  margin: '-2rem auto 0 auto',
  padding: '0 1rem 3rem 1rem',
  position: 'relative',
  zIndex: 5,
};

const titleContainer: React.CSSProperties = {
  background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
  borderRadius: '24px',
  padding: '1.5rem 2rem',
  marginBottom: '1.5rem',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)',
  border: '1px solid #E5E7EB',
  position: 'relative',
  overflow: 'hidden',
};

const titleDecoration: React.CSSProperties = {
  position: 'absolute',
  top: '-50%',
  right: '-10%',
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.05) 100%)',
  filter: 'blur(40px)',
  zIndex: 0,
};

const titleStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 900,
  color: '#111827',
  margin: 0,
  textAlign: 'center',
  letterSpacing: '-0.02em',
  background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  position: 'relative',
  zIndex: 1,
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const descriptionCard: React.CSSProperties = {
  background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
  borderRadius: '24px',
  padding: '2rem',
  marginBottom: '1.5rem',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
  border: '1px solid #E5E7EB',
  display: 'flex',
  gap: '1.5rem',
  alignItems: 'flex-start',
};

const iconCircle: React.CSSProperties = {
  width: '64px',
  height: '64px',
  borderRadius: '20px',
  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
  flexShrink: 0,
};

const cardContent: React.CSSProperties = {
  flex: 1,
};

const modernCardTitle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 800,
  color: '#111827',
  marginBottom: '0.75rem',
  letterSpacing: '-0.02em',
};

const modernDescriptionText: React.CSSProperties = {
  fontSize: '1rem',
  color: '#4B5563',
  lineHeight: 1.8,
  margin: 0,
};

const infoGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1rem',
  marginBottom: '1rem',
};

const modernInfoCard: React.CSSProperties = {
  background: 'white',
  borderRadius: '20px',
  padding: '1.5rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
  border: '1px solid #E5E7EB',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '1rem',
};

const smallIconCircle: React.CSSProperties = {
  width: '56px',
  height: '56px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
};

const infoCardContent: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

const infoCardLabel: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '#9CA3AF',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const infoCardValue: React.CSSProperties = {
  fontSize: '1.125rem',
  fontWeight: 800,
  color: '#111827',
  letterSpacing: '-0.02em',
};

const infoCardSubtext: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#6B7280',
  fontWeight: 500,
};

const coordinatesBadge: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem 1.5rem',
  background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
  borderRadius: '16px',
  marginBottom: '1.5rem',
  border: '1px solid #D1D5DB',
};



const modernContactCard: React.CSSProperties = {
  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  borderRadius: '24px',
  padding: '2rem',
  marginBottom: '1.5rem',
  boxShadow: '0 12px 32px rgba(59, 130, 246, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1)',
  border: 'none',
};

const contactHeader: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1.5rem',
};

const contactHeaderIcon: React.CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: '14px',
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid rgba(255, 255, 255, 0.3)',
};

const contactHeaderTitle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 800,
  color: 'white',
  margin: 0,
  letterSpacing: '-0.02em',
};

const modernContactGrid: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const modernContactItem: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '1.25rem',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
};

const modernContactIcon: React.CSSProperties = {
  width: '48px',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
  borderRadius: '12px',
  flexShrink: 0,
};

const modernContactInfo: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  flex: 1,
};

const modernContactLabel: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#6B7280',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const modernContactValue: React.CSSProperties = {
  fontSize: '1rem',
  color: '#111827',
  fontWeight: 700,
  letterSpacing: '-0.01em',
};

const modernActionButtons: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1rem',
  marginBottom: '1rem',
};

const primaryActionButton: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '1.25rem',
  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  border: 'none',
  borderRadius: '16px',
  cursor: 'pointer',
  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
  transition: 'all 0.3s ease',
};

const secondaryActionButton: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '1.25rem',
  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  border: 'none',
  borderRadius: '16px',
  cursor: 'pointer',
  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
  transition: 'all 0.3s ease',
};

const actionButtonIcon: React.CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid rgba(255, 255, 255, 0.3)',
  flexShrink: 0,
};

const actionButtonContent: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.125rem',
  flex: 1,
};

const actionButtonLabel: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'rgba(255, 255, 255, 0.9)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const actionButtonText: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 800,
  color: 'white',
  letterSpacing: '-0.01em',
};

const modernShareButton: React.CSSProperties = {
  width: '100%',
  padding: '1.25rem',
  borderRadius: '16px',
  border: '2px solid #E5E7EB',
  background: 'white',
  color: '#3B82F6',
  fontSize: '1rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.75rem',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
};
