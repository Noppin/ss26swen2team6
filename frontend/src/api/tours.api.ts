import axiosClient from './axiosClient';
import type { Tour, CreateTourRequest, UpdateTourRequest } from '../types/tour.types';

export const getTours = () =>
  axiosClient.get<Tour[]>('/tours').then((r) => r.data);

export const getTourById = (id: string) =>
  axiosClient.get<Tour>(`/tours/${id}`).then((r) => r.data);

export const createTour = (data: CreateTourRequest) =>
  axiosClient.post<Tour>('/tours', data).then((r) => r.data);

export const updateTour = (id: string, data: UpdateTourRequest) =>
  axiosClient.put<Tour>(`/tours/${id}`, data).then((r) => r.data);

export const deleteTour = (id: string) =>
  axiosClient.delete(`/tours/${id}`);
