export interface TourLog {
  id: string;
  tourId: string;
  dateTime: string;
  comment: string;
  difficulty: number;
  totalDistance: number;
  totalTime: number;
  rating: number;
  createdAt: string;
}

export interface CreateTourLogRequest {
  dateTime: string;
  comment: string;
  difficulty: number;
  totalDistance: number;
  totalTime: number;
  rating: number;
}

export interface UpdateTourLogRequest {
  dateTime: string;
  comment: string;
  difficulty: number;
  totalDistance: number;
  totalTime: number;
  rating: number;
}
