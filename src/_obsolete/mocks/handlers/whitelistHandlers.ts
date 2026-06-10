import { http, HttpResponse, delay } from 'msw';
import { mockWhitelistData } from '../data/mockWhitelist';
import { generateId, calculateExpiresAt } from '../../lib/utils';
import type { RegisterIPPayload, WhitelistEntry } from '../../features/whitelist/types';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const whitelistHandlers = [
  // GET /whitelist/history
  http.get(`${API_URL}/whitelist/history`, async () => {
    await delay(800);
    
    // Auto-update expired status before returning
    const updatedData = mockWhitelistData.map(entry => {
      if (entry.status === 'active' && new Date(entry.expiresAt) < new Date()) {
        return { ...entry, status: 'expired' as const };
      }
      return entry;
    });
    
    // Assign back to update "DB"
    mockWhitelistData.length = 0;
    mockWhitelistData.push(...updatedData);

    return HttpResponse.json({ data: mockWhitelistData, success: true });
  }),

  // GET /whitelist/stats
  http.get(`${API_URL}/whitelist/stats`, async () => {
    await delay(600);
    
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const stats = {
      totalActive: mockWhitelistData.filter(e => e.status === 'active').length,
      expiredLast24h: mockWhitelistData.filter(e => e.status === 'expired' && new Date(e.expiresAt) > oneDayAgo).length,
      registeredToday: mockWhitelistData.filter(e => new Date(e.registeredAt) > startOfToday).length,
      revokedToday: mockWhitelistData.filter(e => e.status === 'revoked' && e.revokedAt && new Date(e.revokedAt) > startOfToday).length,
    };

    return HttpResponse.json({ data: stats, success: true });
  }),

  // POST /whitelist/register
  http.post(`${API_URL}/whitelist/register`, async ({ request }) => {
    await delay(1200);
    const payload = (await request.json()) as RegisterIPPayload;

    // Check for duplicates
    const isDuplicate = mockWhitelistData.some(
      entry => entry.clientIP === payload.clientIP && entry.status === 'active'
    );

    if (isDuplicate) {
      return HttpResponse.json(
        { message: 'Esta IP ya se encuentra activa en la Whitelist.', success: false },
        { status: 409 }
      );
    }

    const newEntry: WhitelistEntry = {
      id: generateId(),
      clientIP: payload.clientIP,
      ticketId: payload.ticketId,
      agentId: 'u-1', // Hardcoded for mock, normally from token
      agentName: 'Agente Soporte', 
      registeredAt: new Date().toISOString(),
      expiresAt: calculateExpiresAt(payload.exclusionHours),
      status: 'active',
    };

    mockWhitelistData.unshift(newEntry);

    return HttpResponse.json({ data: newEntry, success: true }, { status: 201 });
  }),

  // POST /whitelist/:id/revoke
  http.post(`${API_URL}/whitelist/:id/revoke`, async ({ params }) => {
    await delay(800);
    const { id } = params;

    const entryIndex = mockWhitelistData.findIndex(e => e.id === id);
    if (entryIndex === -1) {
      return HttpResponse.json({ message: 'Registro no encontrado', success: false }, { status: 404 });
    }

    mockWhitelistData[entryIndex] = {
      ...mockWhitelistData[entryIndex],
      status: 'revoked',
      revokedAt: new Date().toISOString(),
      revokedBy: 'Agente Soporte',
    };

    return HttpResponse.json({ success: true, message: 'IP revocada correctamente' });
  }),
];
