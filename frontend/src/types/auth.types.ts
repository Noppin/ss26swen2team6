export interface AuthResponse {
  accessToken: string;
  userId: string;
  username: string;
  email: string;
}

export interface UserInfo {
  userId: string;
  username: string;
  email: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
