import { useNavigate } from 'react-router-dom';
import type { Tour } from '../../types/tour.types';

interface Props {
  tour: Tour;
  onDelete: (id: string) => void;
}

export default function TourCard({ tour, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      {tour.routeImagePath && (
        <img
          src={tour.routeImagePath}
          alt={`${tour.name} route`}
          style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>{tour.name}</h3>
          <span className="badge">{tour.transportType}</span>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
          {tour.from} &rarr; {tour.to}
        </p>
        <p style={{ fontSize: 13, color: '#374151' }}>
          {tour.distance > 0 ? `${tour.distance} km` : 'Distance: N/A'}
          {tour.estimatedTime > 0 && ` · ~${tour.estimatedTime} min`}
        </p>
        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
          Popularity: {tour.popularity} log{tour.popularity !== 1 ? 's' : ''} · {tour.childFriendliness}
        </p>
      </div>
      <div className="stack-mobile" style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button className="btn-secondary btn-sm" onClick={() => navigate(`/tours/${tour.id}`)}>
          View
        </button>
        <button className="btn-danger btn-sm" onClick={() => onDelete(tour.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
