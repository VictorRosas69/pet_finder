import { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from '../components/MapView';

export default function Map() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number]>([1.2136, -77.2811]);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('No se pudo obtener la ubicación:', error);
        }
      );
    }
  };

  const fetchReports = async () => {
    try {
      const response = await axios.get(apiUrl('/reports'));
      setReports(response.data || []);
    } catch (error) {
      console.error('Error cargando reportes:', error);
      setReports([]);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const filteredReports = selectedType 
    ? reports.filter((r: any) => r.type === selectedType)
    : reports;

  const stats = {
    total: reports.length,
    lost: reports.filter((r: any) => r.type === 'LOST').length,
    found: reports.filter((r: any) => r.type === 'FOUND').length,
    sighting: reports.filter((r: any) => r.type === 'SIGHTING').length,
  };

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={headerSection}>
        <div className="container">
          <div style={headerContent}>
            <div>
              <h1 style={titleStyle}>🗺️ Mapa Interactivo</h1>
              <p style={subtitleStyle}>Explora reportes cerca de ti en Pasto</p>
            </div>
            <div style={legendContainer}>
              <div style={legendItem}>
                <span style={{ fontSize: '1.25rem' }}>🔴</span>
                <span style={legendText}>Perdida</span>
              </div>
              <div style={legendItem}>
                <span style={{ fontSize: '1.25rem' }}>🟢</span>
                <span style={legendText}>Encontrada</span>
              </div>
              <div style={legendItem}>
                <span style={{ fontSize: '1.25rem' }}>🟡</span>
                <span style={legendText}>Avistamiento</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="container" style={{ padding: '0 1rem 2rem 1rem' }}>
        <div style={mapContainer} className="animate-fade-in">
          {loading ? (
            <div style={loadingContainer}>
              <div className="float-animation">
                <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</span>
              </div>
              <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#6B5B4F' }}>
                Cargando mapa...
              </p>
            </div>
          ) : (
            <MapView reports={filteredReports} center={userLocation} zoom={13} />
          )}
        </div>

        {/* Filter Buttons */}
        <div style={filterContainer}>
          <button
            onClick={() => setSelectedType(null)}
            style={selectedType === null ? activeFilterBtn : filterBtn}
          >
            Todos ({stats.total})
          </button>
          <button
            onClick={() => setSelectedType('LOST')}
            style={selectedType === 'LOST' ? activeFilterBtn : filterBtn}
          >
            🔴 Perdidas ({stats.lost})
          </button>
          <button
            onClick={() => setSelectedType('FOUND')}
            style={selectedType === 'FOUND' ? activeFilterBtn : filterBtn}
          >
            🟢 Encontradas ({stats.found})
          </button>
          <button
            onClick={() => setSelectedType('SIGHTING')}
            style={selectedType === 'SIGHTING' ? activeFilterBtn : filterBtn}
          >
            🟡 Avistamientos ({stats.sighting})
          </button>
        </div>

        {/* Stats Grid */}
        <div style={statsGrid}>
          <div style={statCard}>
            <div style={statIcon}>📊</div>
            <div>
              <div style={statNumber}>{stats.total}</div>
              <div style={statLabel}>Reportes Totales</div>
            </div>
          </div>
          <div style={statCard}>
            <div style={statIcon}>🔴</div>
            <div>
              <div style={statNumber}>{stats.lost}</div>
              <div style={statLabel}>Mascotas Perdidas</div>
            </div>
          </div>
          <div style={statCard}>
            <div style={statIcon}>🟢</div>
            <div>
              <div style={statNumber}>{stats.found}</div>
              <div style={statLabel}>Mascotas Encontradas</div>
            </div>
          </div>
          <div style={statCard}>
            <div style={statIcon}>🟡</div>
            <div>
              <div style={statNumber}>{stats.sighting}</div>
              <div style={statLabel}>Avistamientos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const headerSection: React.CSSProperties = {
  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
  padding: '2rem 0',
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
  fontSize: '1rem',
  color: 'rgba(255, 255, 255, 0.9)',
  fontWeight: 500,
};

const legendContainer: React.CSSProperties = {
  display: 'flex',
  gap: '1.5rem',
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  padding: '1rem 1.5rem',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
};

const legendItem: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const legendText: React.CSSProperties = {
  color: 'white',
  fontWeight: 600,
  fontSize: '0.875rem',
};

const mapContainer: React.CSSProperties = {
  background: 'white',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  marginBottom: '2rem',
  border: '3px solid #FFE5D9',
};

const loadingContainer: React.CSSProperties = {
  minHeight: '500px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #FFE5D9 0%, #FFF5F0 100%)',
};

const filterContainer: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '2rem',
  flexWrap: 'wrap',
};

const filterBtn: React.CSSProperties = {
  padding: '0.875rem 1.5rem',
  borderRadius: '12px',
  border: '2px solid #FFE5D9',
  background: 'white',
  color: '#6B5B4F',
  fontWeight: 700,
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
};

const activeFilterBtn: React.CSSProperties = {
  ...filterBtn,
  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
  color: 'white',
  border: '2px solid transparent',
  boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
  transform: 'translateY(-2px)',
};

const statsGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1.5rem',
};

const statCard: React.CSSProperties = {
  background: 'white',
  borderRadius: '16px',
  padding: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  border: '2px solid #FFE5D9',
  transition: 'all 0.3s ease',
};

const statIcon: React.CSSProperties = {
  fontSize: '2.5rem',
};

const statNumber: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 800,
  color: '#FF6B35',
  lineHeight: 1,
  marginBottom: '0.25rem',
};

const statLabel: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#6B5B4F',
  fontWeight: 600,
};

