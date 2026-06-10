import api from '@/lib/axios';
import type { UserCreate, UserCreateResponse, UserRead, UserResetPasswordResponse, UserUpdate } from '@/types/api';

export const listUsers = async (): Promise<UserRead[]> => {
  const { data } = await api.get<UserRead[]>('/users');
  return data;
};

export const createUser = async (payload: UserCreate): Promise<UserCreateResponse> => {
  const { data } = await api.post<UserCreateResponse>('/users', payload);
  return data;
};

export const updateUser = async (userId: number, payload: UserUpdate): Promise<UserRead> => {
  const { data } = await api.patch<UserRead>(`/users/${userId}`, payload);
  return data;
};

export const resetUserPassword = async (userId: number): Promise<UserResetPasswordResponse> => {
  const { data } = await api.post<UserResetPasswordResponse>(`/users/${userId}/reset-password`);
  return data;
};

export const deleteUser = async (userId: number): Promise<void> => {
  await api.delete(`/users/${userId}`);
};
