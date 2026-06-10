import { Badge } from '../../../components/ui/Badge';
import type { BlacklistStatus } from '../types';

interface BlacklistStatusBadgeProps {
  status: BlacklistStatus;
}

export function BlacklistStatusBadge({ status }: BlacklistStatusBadgeProps) {
  const statusConfig = {
    active: { label: 'Bloqueada', variant: 'expired' as const },
    expired: { label: 'Expirada', variant: 'pending' as const },
    removed: { label: 'Retirada', variant: 'active' as const },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
