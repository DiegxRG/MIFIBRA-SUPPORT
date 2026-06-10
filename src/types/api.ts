/* ───────── Enum ───────── */

export type UserRole = 'USER' | 'ADMIN';

export type AccessRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';

export type AccessType = 'TEMPORARY' | 'PERMANENT';

export type ProtocolType = 'TCP' | 'UDP';

export type FirewallListType = 'WHITELIST' | 'BLACKLIST';

export type FirewallRuleSourceType = 'MANUAL' | 'REQUEST_APPROVAL' | 'IP_INTELLIGENCE' | 'REJECTION' | 'EXTERNAL_BLACKLIST';

export type RequestRejectionAction = 'REJECT_ONLY' | 'REJECT_AND_BLACKLIST';

/* ───────── Auth ───────── */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  role: UserRole;
  must_change_password: boolean;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface MessageResponse {
  message: string;
}

/* ───────── User ───────── */

export interface UserCreate {
  full_name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UserCreateResponse {
  id: number;
  email: string;
}

export interface UserRead {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  must_change_password: boolean;
  created_by_id: number | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserUpdate {
  full_name?: string | null;
  email?: string | null;
  role?: UserRole | null;
  is_active?: boolean | null;
}

export interface UserResetPasswordResponse {
  id: number;
  temporary_password: string;
}

export interface UserSummary {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
}

/* ───────── Access Request ───────── */

export interface AccessRequestCreate {
  client_ip: string;
  port: number;
  protocol: ProtocolType;
  client_name?: string | null;
  client_document?: string | null;
  reason: string;
  access_type: AccessType;
  requested_duration_minutes?: number | null;
}

export interface AccessRequestRead {
  id: number;
  client_ip: string;
  normalized_ip: string;
  port: number;
  protocol: ProtocolType;
  client_name: string | null;
  client_document: string | null;
  reason: string;
  access_type: AccessType;
  requested_duration_minutes: number | null;
  status: AccessRequestStatus;
  requested_by_id: number;
  requested_by: UserSummary;
  reviewed_by_id: number | null;
  reviewed_by: UserSummary | null;
  review_comment: string | null;
  reviewed_at: string | null;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AccessRequestReview {
  review_comment?: string | null;
  action?: RequestRejectionAction;
}

/* ───────── Firewall Rule ───────── */

export interface FirewallRuleListItem {
  id: number;
  ip: string;
  port: number | null;
  protocol: ProtocolType | null;
  list_type: FirewallListType;
  access_type: AccessType;
  is_active: boolean;
  starts_at: string;
  expires_at: string | null;
  source_type: FirewallRuleSourceType;
  source_name: string | null;
  reason: string | null;
  metadata_json: Record<string, unknown> | null;
  request_id: number | null;
  created_at: string;
}

export interface FirewallWhitelistRuleUpdate {
  expires_at?: string | null;
  reason?: string | null;
}

/* ───────── API Error ───────── */

export interface ApiErrorDetail {
  detail: string;
  error_code?: string;
}

export interface ValidationErrorItem {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationErrorItem[];
}
