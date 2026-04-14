import type { TourLog } from '../../types/tourLog.types';

interface Props {
  log: TourLog;
  onEdit: (log: TourLog) => void;
  onDelete: (id: string) => void;
}

const STAR = '★';
const EMPTY_STAR = '☆';

function Stars({ n, max = 5 }: { n: number; max?: number }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: 14 }}>
      {Array.from({ length: max }, (_, i) => i < n ? STAR : EMPTY_STAR).join('')}
    </span>
  );
}

export default function TourLogCard({ log, onEdit, onDelete }: Props) {
  const date = new Date(log.dateTime).toLocaleDateString();
  return (
    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{date}</span>
          <Stars n={log.rating} />
          <span style={{ fontSize: 12, color: '#6b7280' }}>Difficulty: {log.difficulty}/5</span>
        </div>
        <p style={{ fontSize: 13, color: '#374151', marginBottom: 4 }}>{log.comment || <em style={{ color: '#9ca3af' }}>No comment</em>}</p>
        <p style={{ fontSize: 12, color: '#9ca3af' }}>
          {log.totalDistance} km · {log.totalTime} min
        </p>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button className="btn-secondary btn-sm" onClick={() => onEdit(log)}>Edit</button>
        <button className="btn-danger btn-sm" onClick={() => onDelete(log.id)}>Delete</button>
      </div>
    </div>
  );
}
