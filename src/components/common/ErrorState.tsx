import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Algo salio mal',
  message = 'Ocurrio un error al cargar los datos.',
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
          Reintentar
        </button>
      )}
    </div>
  );
}
