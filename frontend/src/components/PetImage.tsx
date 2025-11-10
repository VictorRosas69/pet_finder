import { useState } from 'react';

interface PetImageProps {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  fallbackType?: 'dog' | 'cat';
}

export default function PetImage({ src, alt, style, fallbackType = 'dog' }: PetImageProps) {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [attemptCount, setAttemptCount] = useState(0);

  // Lista de URLs de respaldo confiables con alta calidad
  const fallbackImages = {
    dog: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop&q=80',
    ],
    cat: [
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1573865526739-10c1d3a1f0cc?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800&h=600&fit=crop&q=80',
    ],
  };

  const handleImageError = () => {
    const fallbacks = fallbackImages[fallbackType];
    
    if (attemptCount < fallbacks.length) {
      // Intentar con la siguiente imagen de respaldo
      setCurrentSrc(fallbacks[attemptCount]);
      setAttemptCount(attemptCount + 1);
    } else {
      // Si todas las imágenes fallaron, mostrar el emoji
      setImageError(true);
    }
  };

  if (imageError) {
    return (
      <div style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)',
      }}>
        <span style={{ fontSize: '5rem' }}>
          {fallbackType === 'dog' ? '🐕' : '🐈'}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={currentSrc}
      alt={alt}
      style={{
        ...style,
        objectFit: 'contain',
        objectPosition: 'center',
        imageRendering: 'auto',
        backgroundColor: '#F3F4F6',
      }}
      onError={handleImageError}
      loading="lazy"
    />
  );
}
