// Configuración de la API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper para construir URLs de API
export const apiUrl = (path: string) => `${API_URL}${path}`;
