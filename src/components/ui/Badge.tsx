import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'active' | 'expired' | 'revoked' | 'pending' | 'approved' | 'rejected' | 'cancelled';
}

const variantMap: Record<string, string> = {
  active: 'badge-active',
  expired: 'badge-expired',
  revoked: 'badge-revoked',
  pending: 'badge-pending',
  approved: 'badge-active',
  rejected: 'badge-expired',
  cancelled: 'badge-revoked',
};

export function Badge({ children, variant = 'pending', className, ...props }: BadgeProps) {
  return (
    <span className={cn(variantMap[variant] ?? 'badge-pending', className)} {...props}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
}
