import { Copy, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '@/lib/axios';

const edlLinks = [
  {
    url: '/edl/whitelist.txt',
    label: 'EDL de lista blanca',
    description: 'IPs con acceso aprobado y activo',
  },
  {
    url: '/edl/blacklist.txt',
    label: 'EDL de lista negra',
    description: 'IPs bloqueadas',
  },
];

export default function EdlLinks() {
  const handleCopy = async (url: string) => {
    try {
      const fullUrl = `${API_BASE_URL}${url}`;
      await navigator.clipboard.writeText(fullUrl);
    } catch {
      /* silent */
    }
  };

  return (
    <div className="space-y-3">
      {edlLinks.map((link) => (
        <div
          key={link.url}
          className="flex items-center justify-between p-3 rounded-xl bg-surface-light border border-border-subtle"
        >
          <div>
            <p className="text-sm font-medium text-text-primary">{link.label}</p>
            <p className="text-xs text-text-muted">{link.description}</p>
            <p className="text-xs text-text-secondary mt-1 font-mono break-all">{`${API_BASE_URL}${link.url}`}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`${API_BASE_URL}${link.url}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost !text-xs flex items-center gap-1.5"
              title="Abrir TXT"
            >
              <ExternalLink size={14} />
              Abrir
            </a>
            <button
              onClick={() => handleCopy(link.url)}
              className="btn-ghost !text-xs flex items-center gap-1.5"
              title="Copiar URL"
            >
              <Copy size={14} />
              Copiar URL
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
