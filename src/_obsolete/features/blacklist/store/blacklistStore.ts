import { create } from 'zustand';
import type { BlacklistState, RegisterBlacklistPayload } from '../types';
import * as blacklistService from '../services/blacklistService';

export const useBlacklistStore = create<BlacklistState>((set) => ({
  entries: [],
  isLoading: false,
  isRegistering: false,
  error: null,

  fetchEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await blacklistService.getHistory();
      set({ entries: Array.isArray(data) ? data : [], isLoading: false });
    } catch (error: any) {
      set({
        entries: [],
        error: error.response?.data?.message || 'Error al obtener blacklist',
        isLoading: false,
      });
    }
  },

  registerBlock: async (payload: RegisterBlacklistPayload) => {
    set({ isRegistering: true, error: null });
    try {
      const newEntry = await blacklistService.registerBlock(payload);
      set((state) => ({
        entries: [newEntry, ...(Array.isArray(state.entries) ? state.entries : [])],
        isRegistering: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Error al registrar bloqueo',
        isRegistering: false,
      });
      throw error;
    }
  },

  removeBlock: async (id: string) => {
    try {
      await blacklistService.removeBlock(id);
      set((state) => ({
        entries: (Array.isArray(state.entries) ? state.entries : []).map((entry) =>
          entry.id === id
            ? { ...entry, status: 'removed', removedAt: new Date().toISOString(), removedBy: 'Agente Soporte' }
            : entry
        ),
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Error al retirar bloqueo' });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
