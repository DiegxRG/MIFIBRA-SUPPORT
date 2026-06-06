import { clsx, type ClassValue } from 'clsx';

/**
 * Merge class names conditionally (thin wrapper around clsx).
 * Usage: cn('base', condition && 'conditional', 'always')
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format a date string to a relative time (e.g., "hace 2 horas").
 */
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    const absDays = Math.abs(diffDays);
    const absHours = Math.abs(diffHours);
    if (absHours < 1) return 'hace menos de 1 hora';
    if (absHours < 24) return `hace ${absHours}h`;
    return `hace ${absDays}d`;
  }

  if (diffHours < 1) return 'menos de 1 hora';
  if (diffHours < 24) return `en ${diffHours}h`;
  return `en ${diffDays}d`;
}

/**
 * Generate a random ID (for mock purposes).
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Calculate the expiration date from now.
 */
export function calculateExpiresAt(hours: number): string {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

/**
 * Check if a whitelist entry is still active.
 */
export function isEntryActive(expiresAt: string, status: string): boolean {
  if (status === 'revoked') return false;
  return new Date(expiresAt) > new Date();
}

/**
 * Mask an IP for display (e.g., 190.119.45.172 → 190.119.**.172)
 */
export function maskIP(ip: string): string {
  const parts = ip.split('.');
  if (parts.length !== 4) return ip;
  return `${parts[0]}.${parts[1]}.***.${parts[3]}`;
}
