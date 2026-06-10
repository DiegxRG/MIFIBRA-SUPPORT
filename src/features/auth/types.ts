export interface LoginPayload {
  email: string;
  password: string;
}

export type UserRole = 'USER' | 'ADMIN';

export interface AuthUser {
  email: string;
  role: UserRole;
  name: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  expires_in: number;
  role: UserRole;
  must_change_password: boolean;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  expires_in: number;
}

export interface MessageResponse {
  message: string;
}

export interface ApiError {
  detail: string;
  error_code: string;
  errors?: unknown[];
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  tokenType: 'bearer';
  expiresIn: number;
  mustChangePassword: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  mustChangePassword: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<AuthSession>;
  logout: () => Promise<void>;
  clearSession: () => void;
  markPasswordChanged: () => void;
  clearError: () => void;
}
