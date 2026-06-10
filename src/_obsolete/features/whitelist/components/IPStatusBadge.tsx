import { Badge } from '../../../components/ui/Badge';
import type { WhitelistStatus } from '../types';

interface IPStatusBadgeProps {
  status: WhitelistStatus;
}

export function IPStatusBadge({ status }: IPStatusBadgeProps) {
  const statusConfig = {
    active: { label: 'Activa', variant: 'active' as const },
    expired: { label: 'Expirada', variant: 'expired' as const },
    revoked: { label: 'Revocada', variant: 'revoked' as const },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
