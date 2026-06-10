import type { LoginResponse, RefreshTokenResponse, AuthSession, AuthUser, UserRole } from './types';

export const AUTH_STORAGE_KEYS = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  role: 'role',
  mustChangePassword: 'must_change_password',
  email: 'auth_email',
  expiresIn: 'expires_in',
  tokenType: 'token_type',
} as const;

function isBrowser() {
  return typeof window !== 'undefined';
}

function buildUser(email: string, role: UserRole): AuthUser {
  return {
    email,
    role,
    name: email.split('@')[0] || email,
  };
}

export function getAccessToken() {
  if (!isBrowser()) {
    return null;
  }

  return localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
}

export function getRefreshToken() {
  if (!isBrowser()) {
    return null;
  }

  return localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken);
}

export function readStoredSession(): AuthSession | null {
  if (!isBrowser()) {
    return null;
  }

  const accessToken = localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);
  const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken);
  const email = localStorage.getItem(AUTH_STORAGE_KEYS.email);
  const role = localStorage.getItem(AUTH_STORAGE_KEYS.role) as UserRole | null;

  if (!accessToken || !refreshToken || !email || !role) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    tokenType: (localStorage.getItem(AUTH_STORAGE_KEYS.tokenType) as 'bearer' | null) ?? 'bearer',
    expiresIn: Number(localStorage.getItem(AUTH_STORAGE_KEYS.expiresIn) ?? 0),
    mustChangePassword: localStorage.getItem(AUTH_STORAGE_KEYS.mustChangePassword) === 'true',
    user: buildUser(email, role),
  };
}

export function persistLoginSession(email: string, session: LoginResponse) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, session.access_token);
  localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, session.refresh_token);
  localStorage.setItem(AUTH_STORAGE_KEYS.role, session.role);
  localStorage.setItem(AUTH_STORAGE_KEYS.mustChangePassword, String(session.must_change_password));
  localStorage.setItem(AUTH_STORAGE_KEYS.email, email);
  localStorage.setItem(AUTH_STORAGE_KEYS.expiresIn, String(session.expires_in));
  localStorage.setItem(AUTH_STORAGE_KEYS.tokenType, session.token_type);
}

export function persistRefreshSession(session: RefreshTokenResponse) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, session.access_token);
  localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, session.refresh_token);
  localStorage.setItem(AUTH_STORAGE_KEYS.expiresIn, String(session.expires_in));
  localStorage.setItem(AUTH_STORAGE_KEYS.tokenType, session.token_type);
}

export function clearAuthSessionStorage() {
  if (!isBrowser()) {
    return;
  }

  Object.values(AUTH_STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

export function setMustChangePasswordFlag(value: boolean) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEYS.mustChangePassword, String(value));
}
