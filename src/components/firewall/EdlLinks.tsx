import { Copy } from 'lucide-react';

const edlLinks = [
  {
    url: '/edl/whitelist.txt',
    label: 'Whitelist EDL',
    description: 'IPs with active approved access',
  },
  {
    url: '/edl/blacklist.txt',
    label: 'Blacklist EDL',
    description: 'Blocked IPs',
  },
];

export default function EdlLinks() {
  const handleCopy = async (url: string) => {
    try {
      const fullUrl = `${window.location.origin}${url}`;
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
          </div>
          <button
            onClick={() => handleCopy(link.url)}
            className="btn-ghost !text-xs flex items-center gap-1.5"
            title="Copy URL"
          >
            <Copy size={14} />
            Copy URL
          </button>
        </div>
      ))}
    </div>
  );
}
