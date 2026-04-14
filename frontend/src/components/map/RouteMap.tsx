import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon issue with bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Props {
  coordinates?: [number, number][] | null;
  fromName?: string;
  toName?: string;
}

export default function RouteMap({ coordinates, fromName, toName }: Props) {
  if (!coordinates || coordinates.length === 0) {
    return (
      <div style={{
        height: 300, background: '#f3f4f6', borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#9ca3af', fontSize: 14
      }}>
        Map preview not available
      </div>
    );
  }

  // ORS returns [lon, lat]; Leaflet expects [lat, lon]
  const positions: [number, number][] = coordinates.map(([lon, lat]) => [lat, lon]);
  const center = positions[Math.floor(positions.length / 2)];

  return (
    <MapContainer center={center} zoom={10} style={{ height: 300, borderRadius: 8 }} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={positions} color="#2563eb" weight={4} />
      {positions.length > 0 && (
        <Marker position={positions[0]}>
          <Popup>{fromName ?? 'Start'}</Popup>
        </Marker>
      )}
      {positions.length > 1 && (
        <Marker position={positions[positions.length - 1]}>
          <Popup>{toName ?? 'End'}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
