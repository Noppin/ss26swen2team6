import axiosClient from './axiosClient';
import type { Tour, CreateTourRequest, UpdateTourRequest } from '../types/tour.types';

function toFormData(data: CreateTourRequest | UpdateTourRequest, image?: File | null): FormData {
  const fd = new FormData();
  fd.append('name', data.name);
  fd.append('description', data.description);
  fd.append('from', data.from);
  fd.append('to', data.to);
  fd.append('transportType', data.transportType);
  if (image) fd.append('image', image);
  return fd;
}

export const getTours = () =>
  axiosClient.get<Tour[]>('/tours').then((r) => r.data);

export const getTourById = (id: string) =>
  axiosClient.get<Tour>(`/tours/${id}`).then((r) => r.data);

export const createTour = (data: CreateTourRequest, image?: File | null) =>
  axiosClient.post<Tour>('/tours', toFormData(data, image), {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);

export const updateTour = (id: string, data: UpdateTourRequest, image?: File | null) =>
  axiosClient.put<Tour>(`/tours/${id}`, toFormData(data, image), {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);

export const deleteTour = (id: string) =>
  axiosClient.delete(`/tours/${id}`);
