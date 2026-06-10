import { create } from 'zustand';
import type { AuthState, LoginPayload } from '../types';
import { login as loginService, logout as logoutService } from '../services/authService';
import {
  clearAuthSessionStorage,
  getRefreshToken,
  persistLoginSession,
  readStoredSession,
  setMustChangePasswordFlag,
} from '../storage';

const storedSession = readStoredSession();

const initialState = {
  user: storedSession?.user ?? null,
  accessToken: storedSession?.accessToken ?? null,
  refreshToken: storedSession?.refreshToken ?? null,
  mustChangePassword: storedSession?.mustChangePassword ?? false,
  isAuthenticated: Boolean(storedSession),
  isLoading: false,
  error: null,
};

function getAuthErrorMessage(error: unknown) {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = (error as { response?: { data?: { detail?: string } } }).response;
    return response?.data?.detail || 'Error de autenticación';
  }

  return 'Error de autenticación';
}

export const useAuthStore = create<AuthState>()((set) => ({
  ...initialState,

  login: async (payload: LoginPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginService(payload);
      persistLoginSession(payload.email, response);

      const session = readStoredSession();
      if (!session) {
        throw new Error('No se pudo persistir la sesión');
      }

      set({
        user: session.user,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        mustChangePassword: session.mustChangePassword,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return session;
    } catch (error) {
      set({
        error: getAuthErrorMessage(error),
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        await logoutService(refreshToken);
      }
    } finally {
      clearAuthSessionStorage();
      set({ ...initialState });
    }
  },

  clearSession: () => {
    clearAuthSessionStorage();
    set({ ...initialState });
  },

  markPasswordChanged: () => {
    setMustChangePasswordFlag(false);
    set({ mustChangePassword: false });
  },

  clearError: () => set({ error: null }),
}));
