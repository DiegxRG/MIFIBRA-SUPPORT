// ===== Whitelist Types =====

export type ExclusionHours = number;
export type WhitelistStatus = 'active' | 'expired' | 'revoked';

export interface RegisterIPPayload {
  clientIP: string;
  ticketId: string;
  exclusionHours: ExclusionHours;
}

export interface WhitelistEntry {
  id: string;
  clientIP: string;
  ticketId: string;
  agentId: string;
  agentName: string;
  registeredAt: string;
  expiresAt: string;
  status: WhitelistStatus;
  revokedAt?: string;
  revokedBy?: string;
}

export interface WhitelistState {
  entries: WhitelistEntry[];
  isLoading: boolean;
  isRegistering: boolean;
  error: string | null;
  fetchEntries: () => Promise<void>;
  registerIP: (payload: RegisterIPPayload) => Promise<void>;
  revokeEntry: (id: string) => Promise<void>;
  clearError: () => void;
}

export interface WhitelistStats {
  totalActive: number;
  expiredLast24h: number;
  registeredToday: number;
  revokedToday: number;
}
