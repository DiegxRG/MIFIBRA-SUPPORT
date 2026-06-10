import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Link2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { listFirewallRules, syncFirewallRules } from '@/api/firewall';
import type { FirewallRuleListItem } from '@/types/api';
import BlacklistRulesTable from '@/components/firewall/BlacklistRulesTable';
import WhitelistRulesTable from '@/components/firewall/WhitelistRulesTable';
import EdlLinks from '@/components/firewall/EdlLinks';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';

export default function FirewallRulesPage() {
  const [rules, setRules] = useState<FirewallRuleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listFirewallRules();
      setRules(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las reglas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRules();
  }, [fetchRules]);

  const handleRefreshEDL = async () => {
    setSyncing(true);
    try {
      const result = await syncFirewallRules();
      toast.success(`EDL actualizada: ${JSON.stringify(result)}`);
      fetchRules();
    } catch {
      toast.error('No se pudo actualizar la EDL');
    } finally {
      setSyncing(false);
    }
  };

  const whitelistCount = rules.filter((r) => r.list_type === 'WHITELIST' && r.is_active).length;
  const blacklistCount = rules.filter((r) => r.list_type === 'BLACKLIST' && r.is_active).length;
  const whitelistRules = rules.filter((r) => r.list_type === 'WHITELIST');
  const blacklistRules = rules.filter((r) => r.list_type === 'BLACKLIST');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Reglas de firewall</h1>
          <p className="text-sm text-text-muted mt-1">Entradas EDL activas en el firewall Palo Alto</p>
        </div>
        <button
          onClick={handleRefreshEDL}
          disabled={syncing}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          {syncing ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
          {syncing ? 'Actualizando...' : 'Actualizar estado EDL'}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-text-primary">{rules.length}</p>
          <p className="text-xs text-text-muted">Total de reglas</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-status-active">{whitelistCount}</p>
          <p className="text-xs text-text-muted">Lista blanca activa</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-status-expired">{blacklistCount}</p>
          <p className="text-xs text-text-muted">Lista negra activa</p>
        </div>
      </div>

      {/* EDL links */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Link2 size={16} className="text-gs-orange" />
          Listas dinamicas externas
        </h2>
        <EdlLinks />
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchRules} />
      ) : rules.length === 0 ? (
        <EmptyState
          title="No hay reglas de firewall"
          description="Las reglas se crean automaticamente cuando se aprueban solicitudes."
        />
      ) : (
        <div className="space-y-6">
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Lista negra activa</h2>
            {blacklistRules.length === 0 ? (
              <p className="text-sm text-text-muted">No hay reglas en la lista negra.</p>
            ) : (
              <BlacklistRulesTable rules={blacklistRules} />
            )}
          </div>

          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Lista blanca</h2>
            {whitelistRules.length === 0 ? (
              <p className="text-sm text-text-muted">No hay reglas en la lista blanca.</p>
            ) : (
              <WhitelistRulesTable rules={whitelistRules} onChanged={fetchRules} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
