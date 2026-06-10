import { FileX2 } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'No se encontraron datos',
  description = 'No hay registros para mostrar.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-text-muted">{icon ?? <FileX2 size={48} strokeWidth={1} />}</div>
      <p className="text-lg font-semibold text-text-primary">{title}</p>
      <p className="mt-1 text-sm text-text-muted max-w-xs">{description}</p>
    </div>
  );
}
