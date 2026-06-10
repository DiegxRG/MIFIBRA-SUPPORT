import { useState, useEffect, useCallback } from 'react';
import { Search, Filter } from 'lucide-react';
import { listRequests } from '@/api/requests';
import type { AccessRequestRead, AccessRequestStatus } from '@/types/api';
import RequestsTable from '@/components/requests/RequestsTable';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

const statuses: AccessRequestStatus[] = ['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'CANCELLED'];

export default function AllRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<AccessRequestRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<AccessRequestStatus | ''>('');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = statusFilter ? { status: statusFilter } : undefined;
      const data = await listRequests(params);
      setRequests(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">All Requests</h1>
        <p className="text-sm text-text-muted mt-1">View and filter all access requests</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            placeholder="Search by IP..."
            className="input-base !pl-9"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AccessRequestStatus | '')}
            className="input-base !pl-9 !pr-8 !w-auto"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchRequests} />
      ) : requests.length === 0 ? (
        <EmptyState title="No requests found" description="Try changing the filter." />
      ) : (
        <RequestsTable
          requests={requests}
          onRowClick={(r) => navigate(`/requests/${r.id}`)}
        />
      )}
    </div>
  );
}
