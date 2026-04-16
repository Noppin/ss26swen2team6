import { create } from 'zustand';
import type { TourLog, CreateTourLogRequest, UpdateTourLogRequest } from '../types/tourLog.types';
import { getTourLogs, createTourLog, updateTourLog, deleteTourLog } from '../api/tourLogs.api';

interface TourLogState {
  logs: TourLog[];
  loading: boolean;
  error: string;

  fetchLogs: (tourId: string) => Promise<void>;
  addLog: (tourId: string, data: CreateTourLogRequest) => Promise<void>;
  editLog: (tourId: string, logId: string, data: UpdateTourLogRequest) => Promise<void>;
  removeLog: (tourId: string, logId: string) => Promise<void>;
  clearLogs: () => void;
}

export const useTourLogStore = create<TourLogState>((set) => ({
  logs: [],
  loading: false,
  error: '',

  fetchLogs: async (tourId) => {
    set({ loading: true, error: '' });
    try {
      const logs = await getTourLogs(tourId);
      set({ logs });
    } catch {
      set({ error: 'Failed to load tour logs.' });
    } finally {
      set({ loading: false });
    }
  },

  addLog: async (tourId, data) => {
    const log = await createTourLog(tourId, data);
    set((state) => ({ logs: [log, ...state.logs] }));
  },

  editLog: async (tourId, logId, data) => {
    const updated = await updateTourLog(tourId, logId, data);
    set((state) => ({
      logs: state.logs.map((l) => (l.id === logId ? updated : l)),
    }));
  },

  removeLog: async (tourId, logId) => {
    await deleteTourLog(tourId, logId);
    set((state) => ({ logs: state.logs.filter((l) => l.id !== logId) }));
  },

  clearLogs: () => set({ logs: [] }),
}));
