import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../config/api';
import PetImage from '../components/PetImage';

export default function Home() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(apiUrl('/reports'));
      setReports(response.data || []);
    } catch (error) {
      console.error('Error cargando reportes:', error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const filteredReports = reports.filter((r: any) => 
    filter === 'all' ? true : r.type === filter
  );

  const getTypeLabel = (type: string) => {
    const labels: any = {
      LOST: 'Perdida',
      FOUND: 'Encontrada',
      SIGHTING: 'Avistamiento'
    };
    return labels[type] || type;
  };

  const stats = {
    total: reports.length,
    lost: reports.filter((r: any) => r.type === 'LOST').length,
    found: reports.filter((r: any) => r.type === 'FOUND').length,
  };

  return (
    <div>
      {/* Hero Banner with Gradient */}
      <section style={heroStyle}>
        <div className="container">
          <div style={heroContent} className="animate-fade-in">
            <div style={heroImageContainer} className="float-animation">
              <div style={heroImageCircle}>
                <span style={{ fontSize: '6rem' }}>🐕</span>
              </div>
            </div>
            <h1 style={titleStyle}>
              Una App para reportar<br />
              <span style={highlightText}>mascotas extraviadas</span>
            </h1>
            <p style={subtitleStyle}>
              Ayuda a reunir familias en San Juan de Pasto
            </p>
            
            {/* Stats Cards */}
            <div style={statsContainer}>
              <div style={statCard}>
                <div style={statNumber}>{stats.total}</div>
                <div style={statLabel}>Reportes Activos</div>
              </div>
              <div style={statCard}>
                <div style={statNumber}>{stats.lost}</div>
                <div style={statLabel}>Perdidas</div>
              </div>
              <div style={statCard}>
                <div style={statNumber}>{stats.found}</div>
                <div style={statLabel}>Encontradas</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <svg style={waveDivider} viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="#F8F9FA"/>
        </svg>
      </section>

      {/* Filter Tabs */}
      <section style={filterSection} className="glass-effect">
        <div className="container">
          <div style={filterTabs}>
            <button 
              onClick={() => setFilter('all')} 
              style={filter === 'all' ? activeTabStyle : tabStyle}
            >
              <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>📋</span>
              <span>Todos</span>
            </button>
            <button 
              onClick={() => setFilter('LOST')} 
              style={filter === 'LOST' ? activeTabStyle : tabStyle}
            >
              <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>🔴</span>
              <span>Extraviados</span>
            </button>
            <button 
              onClick={() => setFilter('FOUND')} 
              style={filter === 'FOUND' ? activeTabStyle : tabStyle}
            >
              <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>🟢</span>
              <span>Encontrados</span>
            </button>
            <button 
              onClick={() => setFilter('SIGHTING')} 
              style={filter === 'SIGHTING' ? activeTabStyle : tabStyle}
            >
              <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>🟡</span>
              <span>Avistamientos</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pet Cards Grid */}
      <section style={cardsSection}>
        <div className="container">
          {loading ? (
            <div style={gridStyle}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton" style={{ height: '320px', borderRadius: '16px' }} />
              ))}
            </div>
          ) : (
            <div style={gridStyle}>
              {filteredReports.map((report: any, index: number) => (
                <Link 
                  to={`/pet/${report.id}`} 
                  key={report.id} 
                  style={{ textDecoration: 'none' }}
                  className="animate-slide-up"
                >
                  <div className="pet-card" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div style={cardImageContainer}>
                      <PetImage
                        src={report.imageUrl}
                        alt={report.description}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        fallbackType={report.description.toLowerCase().includes('gat') ? 'cat' : 'dog'}
                      />
                      <div style={cardBadgeContainer}>
                        <span className={`badge badge-${report.type.toLowerCase()}`}>
                          {getTypeLabel(report.type)}
                        </span>
                      </div>
                    </div>
                    <div className="pet-card-content" style={{ padding: '1.25rem' }}>
                      <h3 className="pet-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                        {report.contactInfo.name}
                      </h3>
                      <p className="pet-card-description" style={{ marginBottom: '1rem' }}>
                        {report.description.substring(0, 90)}...
                      </p>
                      <div style={cardFooter}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1rem' }}>📍</span>
                          <span style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: 600 }}>Pasto, Nariño</span>
                        </div>
                        <div style={viewButton}>
                          Ver más →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {!loading && filteredReports.length === 0 && (
            <div style={emptyState}>
              <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                No hay reportes
              </h3>
              <p style={{ color: '#6B7280' }}>
                No se encontraron mascotas con este filtro
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const heroStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%)',
  padding: '4rem 1rem 0 1rem',
  position: 'relative',
  overflow: 'hidden',
};

const heroContent: React.CSSProperties = {
  textAlign: 'center',
  maxWidth: '700px',
  margin: '0 auto',
  position: 'relative',
  zIndex: 2,
};

const heroImageContainer: React.CSSProperties = {
  marginBottom: '2rem',
  display: 'flex',
  justifyContent: 'center',
};

const heroImageCircle: React.CSSProperties = {
  width: '140px',
  height: '140px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '3px solid rgba(255, 255, 255, 0.3)',
};

const titleStyle: React.CSSProperties = {
  fontSize: '2.25rem',
  fontWeight: 900,
  color: 'white',
  marginBottom: '1rem',
  lineHeight: 1.2,
  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
};

const highlightText: React.CSSProperties = {
  background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFFFF 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '1.125rem',
  color: 'rgba(255, 255, 255, 0.95)',
  fontWeight: 500,
  marginBottom: '2.5rem',
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
};

const statsContainer: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
  marginBottom: '3rem',
};

const statCard: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '1.25rem 1rem',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const statNumber: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 800,
  color: 'white',
  marginBottom: '0.25rem',
};

const statLabel: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'rgba(255, 255, 255, 0.9)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const waveDivider: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '120px',
};

const emptyState: React.CSSProperties = {
  textAlign: 'center',
  padding: '4rem 2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const filterSection: React.CSSProperties = {
  padding: '1.5rem 0',
  background: 'rgba(255, 255, 255, 0.95)',
  position: 'sticky',
  top: '72px',
  zIndex: 50,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  borderBottom: '1px solid #E5E7EB',
};

const filterTabs: React.CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  overflowX: 'auto',
  padding: '0.25rem',
  scrollbarWidth: 'none',
};

const tabStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.75rem 1.5rem',
  borderRadius: '24px',
  border: '2px solid #E5E7EB',
  background: 'white',
  color: '#6B7280',
  fontWeight: 700,
  fontSize: '0.875rem',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
};

const activeTabStyle: React.CSSProperties = {
  ...tabStyle,
  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  color: 'white',
  border: '2px solid transparent',
  boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
  transform: 'translateY(-2px)',
};

const cardsSection: React.CSSProperties = {
  padding: '2.5rem 0 4rem 0',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '2rem',
};

const cardImageContainer: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '220px',
  background: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)',
  overflow: 'hidden',
};

const cardImageOverlay: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.05) 100%)',
};

const cardImageContent: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const cardBadgeContainer: React.CSSProperties = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
};

const cardFooter: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '1rem',
  borderTop: '1px solid #E5E7EB',
};

const viewButton: React.CSSProperties = {
  color: '#3B82F6',
  fontWeight: 700,
  fontSize: '0.875rem',
  cursor: 'pointer',
};
