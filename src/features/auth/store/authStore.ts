import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, LoginPayload } from '../types';
import { login as loginService } from '../services/authService';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (payload: LoginPayload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginService(payload);
          // Assuming sessionStorage is handled by the middleware, but we can also set it explicitly if needed
          sessionStorage.setItem('gs-token', response.token);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Error de autenticación',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        sessionStorage.removeItem('gs-token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'gs-auth-storage', // unique name
      storage: createJSONStorage(() => sessionStorage), // use sessionStorage
    }
  )
);
