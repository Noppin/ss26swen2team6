import { create } from 'zustand';
import type { Tour, CreateTourRequest, UpdateTourRequest, RouteData } from '../types/tour.types';
import { getTours, getTourById, createTour, updateTour, deleteTour } from '../api/tours.api';
import { getRoute } from '../api/route.api';

interface TourState {
  tours: Tour[];
  selectedTour: Tour | null;
  routeData: RouteData | null;
  loading: boolean;
  error: string;

  fetchTours: () => Promise<void>;
  fetchTourById: (id: string) => Promise<void>;
  fetchRoute: (from: string, to: string, type: Tour['transportType']) => Promise<void>;
  addTour: (data: CreateTourRequest, image?: File | null) => Promise<void>;
  editTour: (id: string, data: UpdateTourRequest, image?: File | null) => Promise<void>;
  removeTour: (id: string) => Promise<void>;
  clearSelectedTour: () => void;
}

export const useTourStore = create<TourState>((set) => ({
  tours: [],
  selectedTour: null,
  routeData: null,
  loading: false,
  error: '',

  fetchTours: async () => {
    set({ loading: true, error: '' });
    try {
      const tours = await getTours();
      set({ tours });
    } catch {
      set({ error: 'Failed to load tours.' });
    } finally {
      set({ loading: false });
    }
  },

  fetchTourById: async (id) => {
    set({ loading: true, error: '', selectedTour: null, routeData: null });
    try {
      const tour = await getTourById(id);
      set({ selectedTour: tour });
    } catch {
      set({ error: 'Tour not found.' });
    } finally {
      set({ loading: false });
    }
  },

  fetchRoute: async (from, to, type) => {
    try {
      const routeData = await getRoute(from, to, type);
      set({ routeData });
    } catch {
      // Route fetch failure is non-critical
    }
  },

  addTour: async (data, image) => {
    const tour = await createTour(data, image);
    set((state) => ({ tours: [...state.tours, tour] }));
  },

  editTour: async (id, data, image) => {
    const updated = await updateTour(id, data, image);
    set((state) => ({
      tours: state.tours.map((t) => (t.id === id ? updated : t)),
      selectedTour: updated,
    }));
  },

  removeTour: async (id) => {
    await deleteTour(id);
    set((state) => ({
      tours: state.tours.filter((t) => t.id !== id),
      selectedTour: null,
    }));
  },

  clearSelectedTour: () => set({ selectedTour: null, routeData: null }),
}));
