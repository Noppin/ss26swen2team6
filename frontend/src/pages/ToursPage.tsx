import { useState, useEffect, useCallback } from 'react';
import { getTours, createTour, deleteTour } from '../api/tours.api';
import type { Tour, CreateTourRequest } from '../types/tour.types';
import TourList from '../components/tours/TourList';
import TourForm from '../components/tours/TourForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const loadTours = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTours();
      setTours(data);
    } catch {
      setError('Failed to load tours.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadTours(); }, [loadTours]);

  const handleCreate = async (data: CreateTourRequest) => {
    await createTour(data);
    setShowForm(false);
    await loadTours();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tour?')) return;
    await deleteTour(id);
    setTours((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>My Tours</h1>
        <button className="btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : '+ New Tour'}
        </button>
      </div>

      {showForm && (
        <TourForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {error && <p className="error mb-4">{error}</p>}
      {loading ? <LoadingSpinner /> : <TourList tours={tours} onDelete={handleDelete} />}
    </div>
  );
}
