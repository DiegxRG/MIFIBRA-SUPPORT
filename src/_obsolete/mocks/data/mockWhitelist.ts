import type { WhitelistEntry } from '../../features/whitelist/types';
import { generateId, calculateExpiresAt } from '../../lib/utils';

// Generate 15-20 initial mock entries
export let mockWhitelistData: WhitelistEntry[] = [
  {
    id: generateId(),
    clientIP: '190.119.45.172',
    ticketId: 'TK-2026-8849',
    agentId: 'u-1',
    agentName: 'Agente Soporte',
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    expiresAt: calculateExpiresAt(22), // Expires in 22h
    status: 'active',
  },
  {
    id: generateId(),
    clientIP: '181.65.122.10',
    ticketId: 'TK-2026-8850',
    agentId: 'u-1',
    agentName: 'Agente Soporte',
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 26 hours ago
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // Expired 2h ago
    status: 'expired',
  },
  {
    id: generateId(),
    clientIP: '200.121.2.55',
    ticketId: 'TK-2026-8851',
    agentId: 'u-2',
    agentName: 'Supervisor',
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    expiresAt: calculateExpiresAt(43),
    status: 'active',
  },
  {
    id: generateId(),
    clientIP: '179.6.14.88',
    ticketId: 'TK-2026-8852',
    agentId: 'u-1',
    agentName: 'Agente Soporte',
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    expiresAt: calculateExpiresAt(62),
    status: 'active',
  },
  {
    id: generateId(),
    clientIP: '190.12.77.100',
    ticketId: 'TK-2026-8853',
    agentId: 'u-1',
    agentName: 'Agente Soporte',
    registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    expiresAt: calculateExpiresAt(12),
    status: 'revoked',
    revokedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    revokedBy: 'Supervisor',
  },
];

for (let i = 0; i < 15; i++) {
  const isExpired = Math.random() > 0.5;
  const isRevoked = !isExpired && Math.random() > 0.8;
  const registeredAt = new Date(Date.now() - 1000 * 60 * 60 * (Math.random() * 100));
  
  let status: 'active' | 'expired' | 'revoked' = 'active';
  let expiresAt = new Date(registeredAt.getTime() + 1000 * 60 * 60 * 24);
  let revokedAt = undefined;

  if (isExpired) {
    status = 'expired';
    expiresAt = new Date(Date.now() - 1000 * 60 * 60 * (Math.random() * 48));
  } else if (isRevoked) {
    status = 'revoked';
    revokedAt = new Date(Date.now() - 1000 * 60 * 60 * (Math.random() * 5)).toISOString();
  }

  mockWhitelistData.push({
    id: generateId(),
    clientIP: `190.119.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    ticketId: `TK-2026-${Math.floor(8000 + Math.random() * 900)}`,
    agentId: Math.random() > 0.3 ? 'u-1' : 'u-2',
    agentName: Math.random() > 0.3 ? 'Agente Soporte' : 'Supervisor',
    registeredAt: registeredAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    status,
    revokedAt,
    revokedBy: isRevoked ? 'Agente Soporte' : undefined,
  });
}

// Sort by newest first
mockWhitelistData.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
