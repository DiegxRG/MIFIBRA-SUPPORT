import { delay, http, HttpResponse } from 'msw';
import { mockBlacklistData } from '../data/mockBlacklist';
import { calculateExpiresAt, generateId } from '../../lib/utils';
import type { BlacklistEntry, RegisterBlacklistPayload } from '../../features/blacklist/types';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const blacklistHandlers = [
  http.get(`${API_URL}/blacklist/history`, async () => {
    await delay(800);

    const updated = mockBlacklistData.map((entry) => {
      if (entry.status === 'active' && new Date(entry.expiresAt) < new Date()) {
        return { ...entry, status: 'expired' as const };
      }

      return entry;
    });

    mockBlacklistData.length = 0;
    mockBlacklistData.push(...updated);

    return HttpResponse.json({ data: mockBlacklistData, success: true });
  }),

  http.get(`${API_URL}/blacklist/stats`, async () => {
    await delay(500);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const nextSixHours = new Date(now.getTime() + 6 * 60 * 60 * 1000);

    return HttpResponse.json({
      data: {
        totalActive: mockBlacklistData.filter((entry) => entry.status === 'active').length,
        blockedToday: mockBlacklistData.filter((entry) => new Date(entry.blockedAt) > startOfToday).length,
        removedToday: mockBlacklistData.filter((entry) => entry.status === 'removed' && entry.removedAt && new Date(entry.removedAt) > startOfToday).length,
        expiringSoon: mockBlacklistData.filter(
          (entry) => entry.status === 'active' && new Date(entry.expiresAt) <= nextSixHours
        ).length,
      },
      success: true,
    });
  }),

  http.post(`${API_URL}/blacklist/register`, async ({ request }) => {
    await delay(1100);
    const payload = (await request.json()) as RegisterBlacklistPayload;

    const isDuplicate = mockBlacklistData.some(
      (entry) => entry.clientIP === payload.clientIP && entry.status === 'active'
    );

    if (isDuplicate) {
      return HttpResponse.json(
        { message: 'Esta IP ya se encuentra bloqueada.', success: false },
        { status: 409 }
      );
    }

    const newEntry: BlacklistEntry = {
      id: generateId(),
      clientIP: payload.clientIP,
      ticketId: payload.ticketId,
      reason: payload.reason,
      agentId: 'u-1',
      agentName: 'Agente Soporte',
      blockedAt: new Date().toISOString(),
      expiresAt: calculateExpiresAt(payload.blockHours),
      status: 'active',
    };

    mockBlacklistData.unshift(newEntry);

    return HttpResponse.json({ data: newEntry, success: true }, { status: 201 });
  }),

  http.post(`${API_URL}/blacklist/:id/remove`, async ({ params }) => {
    await delay(700);
    const { id } = params;
    const index = mockBlacklistData.findIndex((entry) => entry.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: 'Bloqueo no encontrado', success: false }, { status: 404 });
    }

    mockBlacklistData[index] = {
      ...mockBlacklistData[index],
      status: 'removed',
      removedAt: new Date().toISOString(),
      removedBy: 'Agente Soporte',
    };

    return HttpResponse.json({ success: true, message: 'Bloqueo retirado correctamente' });
  }),
];
