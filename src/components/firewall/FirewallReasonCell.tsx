import { useState } from 'react';
import { X } from 'lucide-react';

export default function FirewallReasonCell({ reason }: { reason: string | null }) {
  const [open, setOpen] = useState(false);

  if (!reason) return <span className="text-xs text-text-secondary">—</span>;

  const short = reason.length > 80 ? `${reason.slice(0, 80)}...` : reason;

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-secondary whitespace-normal break-words min-w-0">{short}</span>
        {reason.length > 80 && (
          <button onClick={() => setOpen(true)} className="btn-ghost !px-2 !py-0.5 text-[11px] shrink-0">
            Ver
          </button>
        )}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="glass-card p-6 w-full max-w-2xl mx-4 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-text-muted hover:text-text-primary">
              <X size={18} />
            </button>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Motivo de la regla</h2>
            <div className="rounded-xl bg-surface-light border border-border-subtle p-4 text-sm text-text-secondary whitespace-pre-wrap break-words max-h-[60vh] overflow-auto">
              {reason}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
