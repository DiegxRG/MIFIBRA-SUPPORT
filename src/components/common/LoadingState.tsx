import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  text?: string;
}

export default function LoadingState({ text = 'Cargando...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="animate-spin text-gs-orange" size={36} />
      <p className="mt-4 text-sm text-text-muted">{text}</p>
    </div>
  );
}
