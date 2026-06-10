import api from '@/lib/axios';
import type { WhitelistEntry, RegisterIPPayload, WhitelistStats } from '../types';

export const getHistory = async (): Promise<WhitelistEntry[]> => {
  const { data } = await api.get<{ data: WhitelistEntry[] }>('/whitelist/history');
  return data.data;
};

export const registerIP = async (payload: RegisterIPPayload): Promise<WhitelistEntry> => {
  const { data } = await api.post<{ data: WhitelistEntry }>('/whitelist/register', payload);
  return data.data;
};

export const revokeIP = async (id: string): Promise<void> => {
  await api.post(`/whitelist/${id}/revoke`);
};

export const getStats = async (): Promise<WhitelistStats> => {
  const { data } = await api.get<{ data: WhitelistStats }>('/whitelist/stats');
  return data.data;
};
