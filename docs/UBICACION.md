# 📍 Configuración de Ubicación - San Juan de Pasto

## Ubicación Principal

La aplicación está configurada para operar en:
- **Ciudad**: San Juan de Pasto
- **Departamento**: Nariño
- **País**: Colombia
- **Coordenadas**: 1.2136° N, 77.2811° W
- **Altitud**: ~2,527 msnm

## Sectores Cubiertos

Los reportes de demostración cubren los principales sectores de Pasto:

### Centro
- **Parque Nariño** (1.2136, -77.2811)
- Centro histórico y comercial

### Norte
- **Universidad de Nariño** (1.2250, -77.2820)
- **La Floresta** (1.2200, -77.2780)
- **Santiago** (1.2180, -77.2850)

### Sur
- **Tamasagra** (1.2080, -77.2700)
- **Unicentro** (1.2050, -77.2750)

### Occidente
- **Pandiaco** (1.2100, -77.2900)
- **Parque Infantil** (1.2160, -77.2790)

## Configuración del Mapa

### Zoom Predeterminado
- **Nivel**: 13
- Permite ver toda la ciudad
- Ajustable por el usuario

### Radio de Búsqueda
- **Predeterminado**: 5 km
- Cubre la mayor parte del área urbana de Pasto
- Configurable en búsquedas cercanas

## Personalización por Sector

Si deseas agregar más sectores o barrios específicos de Pasto, edita:

### Backend
`backend/src/reports/mock-data.ts`

```typescript
{
  id: 'nuevo',
  type: 'LOST',
  description: 'Descripción de la mascota',
  location: {
    latitude: 1.XXXX,  // Coordenada del sector
    longitude: -77.XXXX,
  },
  contactInfo: {
    name: 'Nombre',
    phone: '+57 XXX XXXXXXX',
    email: 'email@example.com',
  },
  status: 'ACTIVE',
  createdAt: new Date(),
}
```

### Frontend
`frontend/src/pages/Map.tsx`

```typescript
// Cambiar ubicación predeterminada
const [userLocation, setUserLocation] = useState<[number, number]>([
  1.XXXX,  // Latitud
  -77.XXXX // Longitud
]);
```

## Coordenadas de Referencia en Pasto

### Lugares Importantes

| Lugar | Latitud | Longitud |
|-------|---------|----------|
| Plaza de Nariño | 1.2136 | -77.2811 |
| Catedral de Pasto | 1.2138 | -77.2813 |
| Universidad de Nariño | 1.2250 | -77.2820 |
| Terminal de Transportes | 1.2050 | -77.2650 |
| Aeropuerto Antonio Nariño | 1.3964 | -77.2914 |
| Parque Bolívar | 1.2140 | -77.2815 |
| Centro Comercial Unicentro | 1.2050 | -77.2750 |
| Hospital Departamental | 1.2180 | -77.2900 |

## Geolocalización Automática

La aplicación detecta automáticamente la ubicación del usuario:

1. **Si está en Pasto**: Centra el mapa en su ubicación exacta
2. **Si está fuera**: Usa las coordenadas predeterminadas de Pasto
3. **Si no permite geolocalización**: Muestra el centro de Pasto

## Búsqueda por Radio

### Endpoint de Búsqueda Cercana
```bash
GET /reports/nearby?lat=1.2136&lng=-77.2811&radius=5
```

### Parámetros
- `lat`: Latitud (requerido)
- `lng`: Longitud (requerido)
- `radius`: Radio en kilómetros (opcional, default: 5)

### Ejemplos de Uso

**Buscar en el centro de Pasto (5km)**
```bash
curl "http://localhost:3000/reports/nearby?lat=1.2136&lng=-77.2811&radius=5"
```

**Buscar cerca de la Universidad (3km)**
```bash
curl "http://localhost:3000/reports/nearby?lat=1.2250&lng=-77.2820&radius=3"
```

**Buscar en todo Pasto (10km)**
```bash
curl "http://localhost:3000/reports/nearby?lat=1.2136&lng=-77.2811&radius=10"
```

## Expansión a Otras Ciudades

Si deseas expandir a otras ciudades de Nariño:

### Ipiales
```typescript
center: [0.8270, -77.6420]
```

### Tumaco
```typescript
center: [1.8000, -78.8000]
```

### Túquerres
```typescript
center: [1.0870, -77.6170]
```

## Consideraciones Técnicas

### Precisión GPS
- **Urbano**: ±10-20 metros
- **Rural**: ±50-100 metros
- Depende de la señal del dispositivo

### Rendimiento
- Búsquedas optimizadas con índices geoespaciales
- Cálculo de distancia usando fórmula de Haversine
- Límite de 10,000 reportes por consulta

### Privacidad
- Ubicación exacta solo visible para el dueño
- Reportes públicos muestran área aproximada
- Opción de anonimizar ubicación

## Recursos Adicionales

- [OpenStreetMap Pasto](https://www.openstreetmap.org/#map=13/1.2136/-77.2811)
- [Coordenadas GPS de Colombia](https://www.coordenadas-gps.com/colombia)
- [Leaflet Documentation](https://leafletjs.com/)

---

**Configuración actual**: San Juan de Pasto, Nariño, Colombia 🇨🇴
