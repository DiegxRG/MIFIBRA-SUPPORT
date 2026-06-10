import { useState } from 'react';
import { Loader2, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import DataTable from '@/components/common/DataTable';
import type { TableColumn } from '@/components/common/DataTable';
import { disableFirewallRule, updateWhitelistRule } from '@/api/firewall';
import type { FirewallRuleListItem } from '@/types/api';
import FirewallReasonCell from './FirewallReasonCell';

function formatDateTimeLocal(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function EditWhitelistModal({
  rule,
  onClose,
  onSaved,
}: {
  rule: FirewallRuleListItem;
  onClose: () => void;
  onSaved: (updated: FirewallRuleListItem) => void;
}) {
  const [reason, setReason] = useState(rule.reason ?? '');
  const [expiresAt, setExpiresAt] = useState(formatDateTimeLocal(rule.expires_at));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: { reason?: string | null; expires_at?: string | null } = {
        reason: reason.trim() || null,
      };
      if (rule.access_type === 'TEMPORARY') {
        payload.expires_at = expiresAt ? new Date(expiresAt).toISOString() : null;
      }
      const updated = await updateWhitelistRule(rule.id, payload);
      onSaved(updated);
      toast.success(`Whitelist rule ${rule.ip} updated`);
    } catch (err: unknown) {
      const detail =
        err && typeof err === 'object' && 'response' in err
          ? String((err as { response: { data: { detail: string } } }).response?.data?.detail ?? '')
          : 'Failed to update whitelist rule';
      toast.error(detail);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card p-6 w-full max-w-lg mx-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-primary">
          <X size={18} />
        </button>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Edit Whitelist Rule</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-text-muted mb-1">IP</label>
            <div className="font-mono text-sm text-text-primary">{rule.ip}</div>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Reason</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="input-base resize-none" />
          </div>
          {rule.access_type === 'TEMPORARY' && (
            <div>
              <label className="block text-xs text-text-muted mb-1">Expires At</label>
              <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="input-base" />
            </div>
          )}
          {rule.access_type === 'PERMANENT' && <p className="text-xs text-text-muted">Permanent whitelist rules only allow reason updates.</p>}
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="btn-ghost">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Loader2 size={16} className="animate-spin" /> : null}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Props {
  rules: FirewallRuleListItem[];
  onChanged: () => void;
}

export default function WhitelistRulesTable({ rules, onChanged }: Props) {
  const [editingRule, setEditingRule] = useState<FirewallRuleListItem | null>(null);
  const [disablingId, setDisablingId] = useState<number | null>(null);

  const handleDisable = async (rule: FirewallRuleListItem) => {
    if (!window.confirm(`Disable whitelist rule for ${rule.ip}?`)) return;
    setDisablingId(rule.id);
    try {
      await disableFirewallRule(rule.id);
      toast.success(`Whitelist rule ${rule.ip} disabled`);
      onChanged();
    } catch (err: unknown) {
      const detail =
        err && typeof err === 'object' && 'response' in err
          ? String((err as { response: { data: { detail: string } } }).response?.data?.detail ?? '')
          : 'Failed to disable whitelist rule';
      toast.error(detail);
    } finally {
      setDisablingId(null);
    }
  };

  const columns: TableColumn<FirewallRuleListItem>[] = [
    {
      key: 'ip',
      header: 'IP',
      render: (row) => <span className="font-mono text-sm">{row.ip}</span>,
    },
    {
      key: 'access_type',
      header: 'Access Type',
    },
    {
      key: 'reason',
      header: 'Reason',
      className: 'min-w-[320px] max-w-[420px] align-top',
      render: (row) => <FirewallReasonCell reason={row.reason} />,
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (row) => <span className={row.is_active ? 'badge-active' : 'badge-expired'}>{row.is_active ? 'Active' : 'Disabled'}</span>,
    },
    {
      key: 'created_at',
      header: 'Created At',
      render: (row) => new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(row.created_at)),
    },
    {
      key: 'expires_at',
      header: 'Expires At',
      render: (row) => (row.expires_at ? new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(row.expires_at)) : '—'),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setEditingRule(row)} className="btn-ghost !px-2 !py-1 text-xs flex items-center gap-1">
            <Pencil size={14} />
            Edit
          </button>
          <button onClick={() => handleDisable(row)} disabled={disablingId === row.id} className="btn-ghost !px-2 !py-1 text-xs text-status-expired flex items-center gap-1">
            {disablingId === row.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Disable
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={rules} keyExtractor={(r) => r.id} />
      {editingRule && (
        <EditWhitelistModal
          rule={editingRule}
          onClose={() => setEditingRule(null)}
          onSaved={() => {
            setEditingRule(null);
            onChanged();
          }}
        />
      )}
    </>
  );
}
