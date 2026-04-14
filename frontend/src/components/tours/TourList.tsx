import type { Tour } from '../../types/tour.types';
import TourCard from './TourCard';

interface Props {
  tours: Tour[];
  onDelete: (id: string) => void;
}

export default function TourList({ tours, onDelete }: Props) {
  if (tours.length === 0) {
    return <p style={{ color: '#6b7280', textAlign: 'center', padding: 32 }}>No tours found. Create your first tour!</p>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} onDelete={onDelete} />
      ))}
    </div>
  );
}
