import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTourStore } from '../store/tourStore';
import { useTourLogStore } from '../store/tourLogStore';
import type { UpdateTourRequest } from '../types/tour.types';
import type { TourLog, CreateTourLogRequest } from '../types/tourLog.types';
import TourForm from '../components/tours/TourForm';
import TourLogList from '../components/tourLogs/TourLogList';
import TourLogForm from '../components/tourLogs/TourLogForm';
import RouteMap from '../components/map/RouteMap';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { selectedTour, routeData, loading, error, fetchTourById, fetchRoute, editTour, removeTour, clearSelectedTour } = useTourStore();
  const { logs, fetchLogs, addLog, editLog, removeLog, clearLogs } = useTourLogStore();

  const [editing, setEditing] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [editingLog, setEditingLog] = useState<TourLog | null>(null);

  useEffect(() => {
    if (!id) return;
    void fetchTourById(id);
    void fetchLogs(id);
    return () => {
      clearSelectedTour();
      clearLogs();
    };
  }, [id, fetchTourById, fetchLogs, clearSelectedTour, clearLogs]);

  useEffect(() => {
    if (selectedTour) {
      void fetchRoute(selectedTour.from, selectedTour.to, selectedTour.transportType);
    }
  }, [selectedTour, fetchRoute]);

  const handleUpdate = async (data: UpdateTourRequest) => {
    if (!id) return;
    await editTour(id, data);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!id || !confirm('Delete this tour and all its logs?')) return;
    await removeTour(id);
    navigate('/');
  };

  const handleCreateLog = async (data: CreateTourLogRequest) => {
    if (!id) return;
    await addLog(id, data);
    setShowLogForm(false);
  };

  const handleUpdateLog = async (data: CreateTourLogRequest) => {
    if (!id || !editingLog) return;
    await editLog(id, editingLog.id, data);
    setEditingLog(null);
  };

  const handleDeleteLog = async (logId: string) => {
    if (!id || !confirm('Delete this log?')) return;
    await removeLog(id, logId);
  };

  if (loading) return <LoadingSpinner />;
  if (error || !selectedTour) return (
    <div className="page">
      <p className="error">{error || 'Tour not found.'}</p>
      <button className="btn-secondary mt-4" onClick={() => navigate('/')}>Back</button>
    </div>
  );

  return (
    <div className="page-wide">
      <button className="btn-secondary btn-sm mb-4" onClick={() => navigate('/')}>&larr; Back</button>

      {editing ? (
        <TourForm initial={selectedTour} onSubmit={handleUpdate} onCancel={() => setEditing(false)} />
      ) : (
        <div className="card mb-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700 }}>{selectedTour.name}</h1>
                <span className="badge">{selectedTour.transportType}</span>
              </div>
              <p style={{ color: '#6b7280', marginBottom: 6 }}>{selectedTour.from} &rarr; {selectedTour.to}</p>
              {selectedTour.description && <p style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>{selectedTour.description}</p>}
              {selectedTour.routeImagePath && (
                <img
                  src={`/api${selectedTour.routeImagePath}`}
                  alt={`${selectedTour.name} route`}
                  style={{ maxWidth: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#6b7280' }}>
                <span>{selectedTour.distance > 0 ? `${selectedTour.distance} km` : 'Distance: N/A'}</span>
                {selectedTour.estimatedTime > 0 && <span>~{selectedTour.estimatedTime} min</span>}
                <span>Popularity: {selectedTour.popularity}</span>
                <span>{selectedTour.childFriendliness}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary btn-sm" onClick={() => setEditing(true)}>Edit</button>
              <button className="btn-danger btn-sm" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <RouteMap
          coordinates={routeData?.coordinates as [number, number][] | null}
          fromName={selectedTour.from}
          toName={selectedTour.to}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Tour Logs ({logs.length})</h2>
        {!showLogForm && !editingLog && (
          <button className="btn-primary btn-sm" onClick={() => setShowLogForm(true)}>+ Add Log</button>
        )}
      </div>

      {showLogForm && (
        <TourLogForm onSubmit={handleCreateLog} onCancel={() => setShowLogForm(false)} />
      )}
      {editingLog && (
        <TourLogForm initial={editingLog} onSubmit={handleUpdateLog} onCancel={() => setEditingLog(null)} />
      )}

      <TourLogList
        logs={logs}
        onEdit={(log) => { setEditingLog(log); setShowLogForm(false); }}
        onDelete={handleDeleteLog}
      />
    </div>
  );
}
