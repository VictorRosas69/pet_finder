import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix para los iconos de Leaflet en Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface Report {
  id: string;
  type: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  contactInfo: {
    name: string;
    phone?: string;
  };
  createdAt: string;
}

interface MapViewProps {
  reports: Report[];
  center?: [number, number];
  zoom?: number;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
}

export default function MapView({ reports, center = [1.2136, -77.2811], zoom = 13 }: MapViewProps) {
  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'LOST':
        return '🔴';
      case 'FOUND':
        return '🟢';
      case 'SIGHTING':
        return '🟡';
      default:
        return '📍';
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%', minHeight: '500px', borderRadius: '0.75rem' }}
    >
      <MapUpdater center={center} />
      
      {/* OpenStreetMap - Completamente gratuito */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcadores de reportes */}
      {reports.map((report) => (
        <Marker
          key={report.id}
          position={[report.location.latitude, report.location.longitude]}
        >
          <Popup>
            <div style={{ minWidth: '200px' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
                {getMarkerColor(report.type)} {report.type}
              </h3>
              <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
                <strong>Descripción:</strong> {report.description}
              </p>
              <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
                <strong>Contacto:</strong> {report.contactInfo.name}
              </p>
              {report.contactInfo.phone && (
                <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
                  <strong>Teléfono:</strong> {report.contactInfo.phone}
                </p>
              )}
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6B7280' }}>
                {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
