import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import type { AuthSession, LoginPayload } from '../types';

function getLoginErrorMessage(error: unknown) {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = (error as { response?: { data?: { detail?: string } } }).response;
    return response?.data?.detail || 'Error de autenticación. Verifica tus credenciales.';
  }

  return 'Error de autenticación. Verifica tus credenciales.';
}

export function useLogin() {
  const { login: authenticate, isLoading, error, clearError } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);

  const login = async (payload: LoginPayload): Promise<AuthSession> => {
    setLocalError(null);
    try {
      return await authenticate(payload);
    } catch (err) {
      setLocalError(getLoginErrorMessage(err));
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
