import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'active' | 'expired' | 'revoked' | 'pending';
}

export function Badge({ children, variant = 'pending', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        `badge-${variant}`,
        className
      )}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
}
