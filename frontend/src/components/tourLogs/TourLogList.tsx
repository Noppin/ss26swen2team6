import type { TourLog } from '../../types/tourLog.types';
import TourLogCard from './TourLogCard';

interface Props {
  logs: TourLog[];
  onEdit: (log: TourLog) => void;
  onDelete: (id: string) => void;
}

export default function TourLogList({ logs, onEdit, onDelete }: Props) {
  if (logs.length === 0) {
    return <p style={{ color: '#6b7280', textAlign: 'center', padding: 24 }}>No logs yet. Record your first trip!</p>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {logs.map((log) => (
        <TourLogCard key={log.id} log={log} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
