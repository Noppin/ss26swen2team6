import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTourById, updateTour, deleteTour } from '../api/tours.api';
import { getTourLogs, createTourLog, updateTourLog, deleteTourLog } from '../api/tourLogs.api';
import { getRoute } from '../api/route.api';
import type { Tour, UpdateTourRequest, RouteData } from '../types/tour.types';
import type { TourLog, CreateTourLogRequest } from '../types/tourLog.types';
import TourForm from '../components/tours/TourForm';
import TourLogList from '../components/tourLogs/TourLogList';
import TourLogForm from '../components/tourLogs/TourLogForm';
import RouteMap from '../components/map/RouteMap';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tour, setTour] = useState<Tour | null>(null);
  const [logs, setLogs] = useState<TourLog[]>([]);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [editingLog, setEditingLog] = useState<TourLog | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const [tourData, logData] = await Promise.all([getTourById(id), getTourLogs(id)]);
      setTour(tourData);
      setLogs(logData);
      // Fetch route for map
      try {
        const route = await getRoute(tourData.from, tourData.to, tourData.transportType);
        setRouteData(route);
      } catch {
        // Route fetch failure is non-critical
      }
    } catch {
      setError('Tour not found.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  const handleUpdate = async (data: UpdateTourRequest) => {
    if (!id) return;
    const updated = await updateTour(id, data);
    setTour(updated);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!id || !confirm('Delete this tour and all its logs?')) return;
    await deleteTour(id);
    navigate('/');
  };

  const handleCreateLog = async (data: CreateTourLogRequest) => {
    if (!id) return;
    const log = await createTourLog(id, data);
    setLogs((prev) => [log, ...prev]);
    setShowLogForm(false);
  };

  const handleUpdateLog = async (data: CreateTourLogRequest) => {
    if (!id || !editingLog) return;
    const updated = await updateTourLog(id, editingLog.id, data);
    setLogs((prev) => prev.map((l) => l.id === updated.id ? updated : l));
    setEditingLog(null);
  };

  const handleDeleteLog = async (logId: string) => {
    if (!id || !confirm('Delete this log?')) return;
    await deleteTourLog(id, logId);
    setLogs((prev) => prev.filter((l) => l.id !== logId));
  };

  if (loading) return <LoadingSpinner />;
  if (error || !tour) return (
    <div className="page">
      <p className="error">{error || 'Tour not found.'}</p>
      <button className="btn-secondary mt-4" onClick={() => navigate('/')}>Back</button>
    </div>
  );

  return (
    <div className="page-wide">
      <button className="btn-secondary btn-sm mb-4" onClick={() => navigate('/')}>&larr; Back</button>

      {editing ? (
        <TourForm initial={tour} onSubmit={handleUpdate} onCancel={() => setEditing(false)} />
      ) : (
        <div className="card mb-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700 }}>{tour.name}</h1>
                <span className="badge">{tour.transportType}</span>
              </div>
              <p style={{ color: '#6b7280', marginBottom: 6 }}>{tour.from} &rarr; {tour.to}</p>
              {tour.description && <p style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>{tour.description}</p>}
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#6b7280' }}>
                <span>{tour.distance > 0 ? `${tour.distance} km` : 'Distance: N/A'}</span>
                {tour.estimatedTime > 0 && <span>~{tour.estimatedTime} min</span>}
                <span>Popularity: {tour.popularity}</span>
                <span>{tour.childFriendliness}</span>
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
          fromName={tour.from}
          toName={tour.to}
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
