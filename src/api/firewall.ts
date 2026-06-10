import api from '@/lib/axios';
import type { FirewallRuleListItem, FirewallListType, AccessType, FirewallWhitelistRuleUpdate } from '@/types/api';

export interface FirewallRuleListParams {
  list_type?: FirewallListType;
  is_active?: boolean;
  access_type?: AccessType;
  ip?: string;
}

export const listFirewallRules = async (
  params?: FirewallRuleListParams
): Promise<FirewallRuleListItem[]> => {
  const { data } = await api.get<FirewallRuleListItem[]>('/admin/firewall/rules', { params });
  return data;
};

export const disableFirewallRule = async (ruleId: number): Promise<FirewallRuleListItem> => {
  const { data } = await api.post<FirewallRuleListItem>(`/admin/firewall/rules/${ruleId}/disable`);
  return data;
};

export const updateWhitelistRule = async (
  ruleId: number,
  payload: FirewallWhitelistRuleUpdate
): Promise<FirewallRuleListItem> => {
  const { data } = await api.patch<FirewallRuleListItem>(`/admin/firewall/rules/${ruleId}`, payload);
  return data;
};

export const syncFirewallRules = async (): Promise<Record<string, string | number>> => {
  const { data } = await api.post<Record<string, string | number>>('/admin/firewall/sync');
  return data;
};
