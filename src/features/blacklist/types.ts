export type BlockHours = number;
export type BlacklistStatus = 'active' | 'expired' | 'removed';

export interface RegisterBlacklistPayload {
  clientIP: string;
  ticketId: string;
  reason: string;
  blockHours: BlockHours;
}

export interface BlacklistEntry {
  id: string;
  clientIP: string;
  ticketId: string;
  reason: string;
  agentId: string;
  agentName: string;
  blockedAt: string;
  expiresAt: string;
  status: BlacklistStatus;
  removedAt?: string;
  removedBy?: string;
}

export interface BlacklistState {
  entries: BlacklistEntry[];
  isLoading: boolean;
  isRegistering: boolean;
  error: string | null;
  fetchEntries: () => Promise<void>;
  registerBlock: (payload: RegisterBlacklistPayload) => Promise<void>;
  removeBlock: (id: string) => Promise<void>;
  clearError: () => void;
}

export interface BlacklistStats {
  totalActive: number;
  blockedToday: number;
  removedToday: number;
  expiringSoon: number;
}
