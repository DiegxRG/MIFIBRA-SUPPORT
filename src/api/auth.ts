import api from '@/lib/axios';
import type {
  ChangePasswordRequest,
  LoginRequest,
  MessageResponse,
  RefreshTokenResponse,
  Token,
} from '@/types/api';

export const login = async (payload: LoginRequest): Promise<Token> => {
  const { data } = await api.post<Token>('/auth/login', payload);
  return data;
};

export const refreshToken = async (refresh_token: string): Promise<RefreshTokenResponse> => {
  const { data } = await api.post<RefreshTokenResponse>('/auth/refresh', { refresh_token });
  return data;
};

export const logout = async (refresh_token: string): Promise<MessageResponse> => {
  const { data } = await api.post<MessageResponse>('/auth/logout', { refresh_token });
  return data;
};

export const logoutAll = async (): Promise<MessageResponse> => {
  const { data } = await api.post<MessageResponse>('/auth/logout-all');
  return data;
};

export const changePassword = async (payload: ChangePasswordRequest): Promise<MessageResponse> => {
  const { data } = await api.post<MessageResponse>('/auth/change-password', payload);
  return data;
};
