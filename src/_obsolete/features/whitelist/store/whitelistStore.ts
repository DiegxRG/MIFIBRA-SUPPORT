import { create } from 'zustand';
import type { WhitelistState, RegisterIPPayload } from '../types';
import * as whitelistService from '../services/whitelistService';

export const useWhitelistStore = create<WhitelistState>((set) => ({
  entries: [],
  isLoading: false,
  isRegistering: false,
  error: null,

  fetchEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await whitelistService.getHistory();
      set({ entries: Array.isArray(data) ? data : [], isLoading: false });
    } catch (error: any) {
      set({
        entries: [],
        error: error.response?.data?.message || 'Error al obtener historial',
        isLoading: false,
      });
    }
  },

  registerIP: async (payload: RegisterIPPayload) => {
    set({ isRegistering: true, error: null });
    try {
      const newEntry = await whitelistService.registerIP(payload);
      set((state) => ({
        entries: [newEntry, ...(Array.isArray(state.entries) ? state.entries : [])],
        isRegistering: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al registrar IP',
        isRegistering: false,
      });
      throw error;
    }
  },

  revokeEntry: async (id: string) => {
    try {
      await whitelistService.revokeIP(id);
      set((state) => ({
        entries: (Array.isArray(state.entries) ? state.entries : []).map((entry) =>
          entry.id === id ? { ...entry, status: 'revoked' } : entry
        ),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al revocar IP' });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
