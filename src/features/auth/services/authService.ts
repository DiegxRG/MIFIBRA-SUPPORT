import api from '@/lib/axios';
import type {
  ChangePasswordPayload,
  LoginPayload,
  LoginResponse,
  MessageResponse,
  RefreshTokenResponse,
} from '../types';

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);
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

export const changePassword = async (payload: ChangePasswordPayload): Promise<MessageResponse> => {
  const { data } = await api.post<MessageResponse>('/auth/change-password', payload);
  return data;
};
