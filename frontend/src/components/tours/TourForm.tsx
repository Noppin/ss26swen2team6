import { useState } from 'react';
import type { CreateTourRequest, Tour, TransportType } from '../../types/tour.types';

interface Props {
  initial?: Tour;
  onSubmit: (data: CreateTourRequest) => Promise<void>;
  onCancel: () => void;
}

const TRANSPORT_TYPES: TransportType[] = ['Bike', 'Hike', 'Running', 'Vacation'];

export default function TourForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [from, setFrom] = useState(initial?.from ?? '');
  const [to, setTo] = useState(initial?.to ?? '');
  const [transportType, setTransportType] = useState<TransportType>(initial?.transportType ?? 'Bike');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !from.trim() || !to.trim()) {
      setError('Name, From, and To are required.');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ name, description, from, to, transportType });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Failed to save tour.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-3" style={{ marginBottom: 20 }}>
      <h3 style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
        {initial ? 'Edit Tour' : 'Create New Tour'}
      </h3>
      <div>
        <label className="label">Name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tour name" />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the tour..." rows={3} style={{ resize: 'vertical' }} />
      </div>
      <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label className="label">From *</label>
          <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g. Vienna" />
        </div>
        <div>
          <label className="label">To *</label>
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="e.g. Salzburg" />
        </div>
      </div>
      <div>
        <label className="label">Transport Type</label>
        <select value={transportType} onChange={(e) => setTransportType(e.target.value as TransportType)}>
          {TRANSPORT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      {error && <p className="error">{error}</p>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : (initial ? 'Update Tour' : 'Create Tour')}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
