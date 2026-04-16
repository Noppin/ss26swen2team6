import { useState, useEffect } from 'react';
import { useTourStore } from '../store/tourStore';
import type { CreateTourRequest } from '../types/tour.types';
import TourList from '../components/tours/TourList';
import TourForm from '../components/tours/TourForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ToursPage() {
  const { tours, loading, error, fetchTours, addTour, removeTour } = useTourStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { void fetchTours(); }, [fetchTours]);

  const handleCreate = async (data: CreateTourRequest, image?: File | null) => {
    await addTour(data, image);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tour?')) return;
    await removeTour(id);
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
