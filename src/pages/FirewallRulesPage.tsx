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
      setError(err instanceof Error ? err.message : 'Failed to load rules');
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
      toast.success(`EDL refreshed: ${JSON.stringify(result)}`);
      fetchRules();
    } catch {
      toast.error('Failed to refresh EDL');
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
          <h1 className="text-2xl font-bold text-text-primary">Firewall Rules</h1>
          <p className="text-sm text-text-muted mt-1">EDL entries active on Palo Alto firewall</p>
        </div>
        <button
          onClick={handleRefreshEDL}
          disabled={syncing}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          {syncing ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
          {syncing ? 'Refreshing...' : 'Refresh EDL Status'}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-text-primary">{rules.length}</p>
          <p className="text-xs text-text-muted">Total Rules</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-status-active">{whitelistCount}</p>
          <p className="text-xs text-text-muted">Active Whitelist</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-status-expired">{blacklistCount}</p>
          <p className="text-xs text-text-muted">Active Blacklist</p>
        </div>
      </div>

      {/* EDL links */}
      <div className="glass-card p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Link2 size={16} className="text-gs-orange" />
          External Dynamic Lists
        </h2>
        <EdlLinks />
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchRules} />
      ) : rules.length === 0 ? (
        <EmptyState
          title="No firewall rules"
          description="Rules are created automatically when requests are approved."
        />
      ) : (
        <div className="space-y-6">
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Active Blacklist</h2>
            {blacklistRules.length === 0 ? (
              <p className="text-sm text-text-muted">No blacklist rules.</p>
            ) : (
              <BlacklistRulesTable rules={blacklistRules} />
            )}
          </div>

          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Whitelist</h2>
            {whitelistRules.length === 0 ? (
              <p className="text-sm text-text-muted">No whitelist rules.</p>
            ) : (
              <WhitelistRulesTable rules={whitelistRules} onChanged={fetchRules} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
