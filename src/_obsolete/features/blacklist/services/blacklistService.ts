import api from '@/lib/axios';
import type { BlacklistEntry, BlacklistStats, RegisterBlacklistPayload } from '../types';

export const getHistory = async (): Promise<BlacklistEntry[]> => {
  const { data } = await api.get<{ data: BlacklistEntry[] }>('/blacklist/history');
  return data.data;
};

export const registerBlock = async (payload: RegisterBlacklistPayload): Promise<BlacklistEntry> => {
  const { data } = await api.post<{ data: BlacklistEntry }>('/blacklist/register', payload);
  return data.data;
};

export const removeBlock = async (id: string): Promise<void> => {
  await api.post(`/blacklist/${id}/remove`);
};

export const getStats = async (): Promise<BlacklistStats> => {
  const { data } = await api.get<{ data: BlacklistStats }>('/blacklist/stats');
  return data.data;
};
