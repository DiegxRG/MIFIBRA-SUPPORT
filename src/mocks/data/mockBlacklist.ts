import type { BlacklistEntry } from '../../features/blacklist/types';
import { calculateExpiresAt, generateId } from '../../lib/utils';

const reasons = [
  'Intentos repetidos no permitidos',
  'Riesgo por ubicacion inusual',
  'Acceso fuera de politica',
  'Validacion de seguridad pendiente',
  'IP reportada por monitoreo',
];

export let mockBlacklistData: BlacklistEntry[] = [
  {
    id: generateId(),
    clientIP: '190.119.88.231',
    ticketId: 'TK-2026-8912',
    reason: 'Intentos repetidos no permitidos',
    agentId: 'u-2',
    agentName: 'Supervisor',
    blockedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    expiresAt: calculateExpiresAt(22),
    status: 'active',
  },
  {
    id: generateId(),
    clientIP: '181.65.201.45',
    ticketId: 'TK-2026-8914',
    reason: 'Riesgo por ubicacion inusual',
    agentId: 'u-1',
    agentName: 'Agente Soporte',
    blockedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    status: 'expired',
  },
  {
    id: generateId(),
    clientIP: '200.121.112.9',
    ticketId: 'TK-2026-8920',
    reason: 'Validacion de seguridad pendiente',
    agentId: 'u-1',
    agentName: 'Agente Soporte',
    blockedAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    expiresAt: calculateExpiresAt(65),
    status: 'active',
  },
  {
    id: generateId(),
    clientIP: '190.12.43.67',
    ticketId: 'TK-2026-8922',
    reason: 'Acceso fuera de politica',
    agentId: 'u-2',
    agentName: 'Supervisor',
    blockedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    expiresAt: calculateExpiresAt(140),
    status: 'removed',
    removedAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    removedBy: 'Supervisor',
  },
];

for (let index = 0; index < 14; index++) {
  const isExpired = Math.random() > 0.56;
  const isRemoved = !isExpired && Math.random() > 0.8;
  const blockedAt = new Date(Date.now() - 1000 * 60 * 60 * (Math.random() * 96));

  let status: 'active' | 'expired' | 'removed' = 'active';
  let expiresAt = new Date(blockedAt.getTime() + 1000 * 60 * 60 * 72);
  let removedAt: string | undefined;

  if (isExpired) {
    status = 'expired';
    expiresAt = new Date(Date.now() - 1000 * 60 * 60 * (Math.random() * 36));
  } else if (isRemoved) {
    status = 'removed';
    removedAt = new Date(Date.now() - 1000 * 60 * 60 * (Math.random() * 10)).toISOString();
  }

  mockBlacklistData.push({
    id: generateId(),
    clientIP: `181.65.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    ticketId: `TK-2026-${Math.floor(8900 + Math.random() * 99)}`,
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    agentId: Math.random() > 0.35 ? 'u-1' : 'u-2',
    agentName: Math.random() > 0.35 ? 'Agente Soporte' : 'Supervisor',
    blockedAt: blockedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    status,
    removedAt,
    removedBy: isRemoved ? 'Agente Soporte' : undefined,
  });
}

mockBlacklistData.sort((a, b) => new Date(b.blockedAt).getTime() - new Date(a.blockedAt).getTime());
