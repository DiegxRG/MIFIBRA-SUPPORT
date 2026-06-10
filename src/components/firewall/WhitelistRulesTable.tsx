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
      toast.success(`Regla de lista blanca ${rule.ip} actualizada`);
    } catch (err: unknown) {
      const detail =
        err && typeof err === 'object' && 'response' in err
          ? String((err as { response: { data: { detail: string } } }).response?.data?.detail ?? '')
          : 'No se pudo actualizar la regla de lista blanca';
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
        <h2 className="text-lg font-semibold text-text-primary mb-4">Editar regla de lista blanca</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-text-muted mb-1">IP</label>
            <div className="font-mono text-sm text-text-primary">{rule.ip}</div>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Motivo</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="input-base resize-none" />
          </div>
          {rule.access_type === 'TEMPORARY' && (
            <div>
              <label className="block text-xs text-text-muted mb-1">Expira el</label>
              <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="input-base" />
            </div>
          )}
          {rule.access_type === 'PERMANENT' && <p className="text-xs text-text-muted">Las reglas permanentes de lista blanca solo permiten actualizar el motivo.</p>}
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="btn-ghost">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Loader2 size={16} className="animate-spin" /> : null}
              Guardar
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
    if (!window.confirm(`Deseas deshabilitar la regla de lista blanca para ${rule.ip}?`)) return;
    setDisablingId(rule.id);
    try {
      await disableFirewallRule(rule.id);
      toast.success(`Regla de lista blanca ${rule.ip} deshabilitada`);
      onChanged();
    } catch (err: unknown) {
      const detail =
        err && typeof err === 'object' && 'response' in err
          ? String((err as { response: { data: { detail: string } } }).response?.data?.detail ?? '')
          : 'No se pudo deshabilitar la regla de lista blanca';
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
      header: 'Tipo de acceso',
      render: (row) => (row.access_type === 'TEMPORARY' ? 'Temporal' : 'Permanente'),
    },
    {
      key: 'reason',
      header: 'Motivo',
      className: 'min-w-[320px] max-w-[420px] align-top',
      render: (row) => <FirewallReasonCell reason={row.reason} />,
    },
    {
      key: 'is_active',
      header: 'Estado',
      render: (row) => <span className={row.is_active ? 'badge-active' : 'badge-expired'}>{row.is_active ? 'Activa' : 'Deshabilitada'}</span>,
    },
    {
      key: 'created_at',
      header: 'Creada el',
      render: (row) => new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(row.created_at)),
    },
    {
      key: 'expires_at',
      header: 'Expira el',
      render: (row) => (row.expires_at ? new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(row.expires_at)) : '—'),
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setEditingRule(row)} className="btn-ghost !px-2 !py-1 text-xs flex items-center gap-1">
            <Pencil size={14} />
            Editar
          </button>
          <button onClick={() => handleDisable(row)} disabled={disablingId === row.id} className="btn-ghost !px-2 !py-1 text-xs text-status-expired flex items-center gap-1">
            {disablingId === row.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Deshabilitar
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
