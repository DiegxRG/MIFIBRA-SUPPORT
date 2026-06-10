import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading data.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-status-expired">
        <AlertTriangle size={48} strokeWidth={1} />
      </div>
      <p className="text-lg font-semibold text-text-primary">{title}</p>
      <p className="mt-1 text-sm text-text-muted max-w-xs">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-6">
          Retry
        </button>
      )}
    </div>
  );
}
