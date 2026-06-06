import api from '@/lib/axios';
import type { LoginPayload, AuthResponse } from '../types';

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
};
