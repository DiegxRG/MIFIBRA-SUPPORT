import api from '@/lib/axios';
import type {
  AccessRequestCreate,
  AccessRequestRead,
  AccessRequestReview,
  IpCheckResponse,
} from '@/types/api';

export interface RequestListParams {
  status?: string;
  date?: string;
  email?: string;
}

export const checkIp = async (ip: string): Promise<IpCheckResponse> => {
  const { data } = await api.get<IpCheckResponse>('/requests/check-ip', { params: { ip } });
  return data;
};

export const createRequest = async (payload: AccessRequestCreate): Promise<AccessRequestRead> => {
  const { data } = await api.post<AccessRequestRead>('/requests', payload);
  return data;
};

export const listRequests = async (params?: RequestListParams): Promise<AccessRequestRead[]> => {
  const { data } = await api.get<AccessRequestRead[]>('/requests', { params });
  return data;
};

export const getRequest = async (requestId: number): Promise<AccessRequestRead> => {
  const { data } = await api.get<AccessRequestRead>(`/requests/${requestId}`);
  return data;
};

export const approveRequest = async (
  requestId: number,
  payload?: AccessRequestReview
): Promise<AccessRequestRead> => {
  const { data } = await api.post<AccessRequestRead>(`/requests/${requestId}/approve`, payload ?? {});
  return data;
};

export const rejectRequest = async (
  requestId: number,
  payload: AccessRequestReview
): Promise<AccessRequestRead> => {
  const { data } = await api.post<AccessRequestRead>(`/requests/${requestId}/reject`, payload);
  return data;
};
