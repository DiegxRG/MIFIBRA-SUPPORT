import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon, suffix, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {suffix}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'input-base',
              icon && 'pl-10',
              suffix && 'pr-12',
              error && 'border-status-expired focus:border-status-expired focus:ring-status-expired/20',
              className
            )}
            {...props}
          />
        </div>
        {(error || helperText) && (
          <p className={cn('text-xs mt-0.5', error ? 'text-status-expired' : 'text-text-muted')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
