import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PetImage from '../components/PetImage';
import { apiUrl } from '../config/api';

export default function Dashboard() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await axios.get(apiUrl('/pets'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(response.data || []);
    } catch (error) {
      console.error('Error cargando mascotas:', error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const getPetEmoji = (type: string) => {
    const emojis: any = {
      DOG: '🐕',
      CAT: '🐈',
      BIRD: '🐦',
      OTHER: '🐾',
    };
    return emojis[type] || '🐾';
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      ACTIVE: { label: 'Activa', color: '#059669', bg: '#D1FAE5' },
      LOST: { label: 'Perdida', color: '#DC2626', bg: '#FEE2E2' },
      FOUND: { label: 'Encontrada', color: '#D97706', bg: '#FEF3C7' },
    };
    return badges[status] || badges.ACTIVE;
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerSection}>
        <div className="container">
          <div style={headerContent}>
            <div>
              <h1 style={titleStyle}>👋 Hola, {user?.name}</h1>
              <p style={subtitleStyle}>Gestiona tus mascotas registradas</p>
            </div>
            <button className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
              <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>+</span>
              Agregar Mascota
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '2rem 1rem' }}>
        {loading ? (
          <div style={gridStyle}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: '400px', borderRadius: '20px' }} />
            ))}
          </div>
        ) : pets.length === 0 ? (
          <div style={emptyState} className="animate-fade-in">
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🐾</div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>
              No tienes mascotas registradas
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem', fontSize: '1.125rem' }}>
              Comienza agregando tu primera mascota
            </p>
            <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>+</span>
              Agregar Mi Primera Mascota
            </button>
          </div>
        ) : (
          <div style={gridStyle}>
            {pets.map((pet: any, index: number) => {
              const statusBadge = getStatusBadge(pet.status);
              return (
                <div key={pet.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div style={petCard}>
                    {/* Imagen de la mascota */}
                    <div style={petImageContainer}>
                      <PetImage
                        src={pet.imageUrl}
                        alt={pet.name}
                        style={petImage}
                        fallbackType={pet.type === 'CAT' ? 'cat' : 'dog'}
                      />
                      <div style={statusBadgeOverlay}>
                        <div style={{ ...statusBadgeStyle, background: statusBadge.bg, color: statusBadge.color }}>
                          {statusBadge.label}
                        </div>
                      </div>
                    </div>

                    {/* Info principal */}
                    <div style={petCardBody}>
                      <h3 style={petName}>{pet.name}</h3>
                      <p style={petBreed}>{pet.breed}</p>
                      
                      <div style={petDetails}>
                        <div style={detailItem}>
                          <span style={detailIcon}>🎂</span>
                          <span style={detailText}>{pet.age} {pet.age === 1 ? 'año' : 'años'}</span>
                        </div>
                        <div style={detailItem}>
                          <span style={detailIcon}>🎨</span>
                          <span style={detailText}>{pet.color}</span>
                        </div>
                        {pet.weight && (
                          <div style={detailItem}>
                            <span style={detailIcon}>⚖️</span>
                            <span style={detailText}>{pet.weight}</span>
                          </div>
                        )}
                      </div>

                      {pet.description && (
                        <p style={petDescription}>{pet.description.substring(0, 100)}...</p>
                      )}

                      {/* Info adicional */}
                      <div style={petFooter}>
                        <div style={infoChip}>
                          <span style={{ fontSize: '1rem' }}>💉</span>
                          <span style={{ fontSize: '0.75rem' }}>
                            {pet.vaccinated ? 'Vacunado' : 'Sin vacunar'}
                          </span>
                        </div>
                        {pet.microchipId && (
                          <div style={infoChip}>
                            <span style={{ fontSize: '1rem' }}>🔖</span>
                            <span style={{ fontSize: '0.75rem' }}>Con chip</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div style={petCardActions}>
                      <button style={actionButton}>
                        <span style={{ fontSize: '1.25rem' }}>📱</span>
                        <span>Ver QR</span>
                      </button>
                      <button style={actionButton}>
                        <span style={{ fontSize: '1.25rem' }}>✏️</span>
                        <span>Editar</span>
                      </button>
                      {pet.status === 'ACTIVE' && (
                        <button style={{ ...actionButton, color: '#DC2626' }}>
                          <span style={{ fontSize: '1.25rem' }}>🚨</span>
                          <span>Reportar Perdida</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  minHeight: 'calc(100vh - 140px)',
  background: '#F8F9FA',
};

const headerSection: React.CSSProperties = {
  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  padding: '2.5rem 0',
  marginBottom: '2rem',
};

const headerContent: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1.5rem',
};

const titleStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 800,
  color: 'white',
  marginBottom: '0.5rem',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '1.125rem',
  color: 'rgba(255, 255, 255, 0.9)',
  fontWeight: 500,
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '2rem',
};

const emptyState: React.CSSProperties = {
  textAlign: 'center',
  padding: '5rem 2rem',
  background: 'white',
  borderRadius: '20px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
};

const petCard: React.CSSProperties = {
  background: 'white',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  border: '2px solid #E5E7EB',
};

const petImageContainer: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '280px',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)',
};

const petImage: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const petImageFallback: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)',
};

const statusBadgeOverlay: React.CSSProperties = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
};

const petEmoji: React.CSSProperties = {
  fontSize: '4rem',
};

const statusBadgeStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const petCardBody: React.CSSProperties = {
  padding: '1.5rem',
};

const petName: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 800,
  color: '#111827',
  marginBottom: '0.25rem',
};

const petBreed: React.CSSProperties = {
  fontSize: '1rem',
  color: '#6B7280',
  fontWeight: 600,
  marginBottom: '1rem',
};

const petDetails: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '1rem',
  flexWrap: 'wrap',
};

const detailItem: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: '#F3F4F6',
  padding: '0.5rem 0.75rem',
  borderRadius: '8px',
};

const detailIcon: React.CSSProperties = {
  fontSize: '1rem',
};

const detailText: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#374151',
};

const petDescription: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#6B7280',
  lineHeight: 1.6,
  marginBottom: '1rem',
};

const petFooter: React.CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  paddingTop: '1rem',
  borderTop: '1px solid #E5E7EB',
};

const infoChip: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  background: '#F9FAFB',
  padding: '0.5rem 0.75rem',
  borderRadius: '8px',
  border: '1px solid #E5E7EB',
};

const petCardActions: React.CSSProperties = {
  display: 'flex',
  borderTop: '2px solid #E5E7EB',
};

const actionButton: React.CSSProperties = {
  flex: 1,
  padding: '1rem',
  border: 'none',
  background: 'white',
  color: '#3B82F6',
  fontWeight: 700,
  fontSize: '0.875rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  transition: 'all 0.3s ease',
  borderRight: '1px solid #E5E7EB',
};
