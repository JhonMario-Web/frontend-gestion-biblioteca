import { User, UserRole } from "./user.model";


export interface LoginRequest {
  correo: string;
  clave: string;
}

export interface RegisterRequest {
  nombreCompleto: string;
  correo: string;
  clave: string;
  role?: UserRole;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  usuario: User;
}