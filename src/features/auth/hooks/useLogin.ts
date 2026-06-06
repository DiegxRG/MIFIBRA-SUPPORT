import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import type { LoginPayload } from '../types';

export function useLogin() {
  const { login: authenticate, isLoading, error, clearError } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);

  const login = async (payload: LoginPayload) => {
    setLocalError(null);
    try {
      await authenticate(payload);
    } catch (err: any) {
      setLocalError(err.response?.data?.message || 'Error de autenticación. Verifica tus credenciales.');
      throw err;
    }
  };

  return {
    login,
    isLoading,
    error: localError || error,
    clearError: () => {
      clearError();
      setLocalError(null);
    },
  };
}
