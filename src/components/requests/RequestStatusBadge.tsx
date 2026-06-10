import type { AccessRequestStatus } from '@/types/api';

const styles: Record<AccessRequestStatus, string> = {
  PENDING: 'badge-pending',
  APPROVED: 'badge-active',
  REJECTED: 'badge-expired',
  EXPIRED: 'badge-expired',
  CANCELLED: 'badge-revoked',
};

const labels: Record<AccessRequestStatus, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobada',
  REJECTED: 'Rechazada',
  EXPIRED: 'Expirada',
  CANCELLED: 'Cancelada',
};

export default function RequestStatusBadge({ status }: { status: AccessRequestStatus }) {
  return <span className={styles[status] ?? 'badge-pending'}>{labels[status] ?? status}</span>;
}
