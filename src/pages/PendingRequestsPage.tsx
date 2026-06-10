import { useState, useEffect, useCallback } from 'react';
import { Clock } from 'lucide-react';
import { listRequests } from '@/api/requests';
import type { AccessRequestRead } from '@/types/api';
import RequestsTable from '@/components/requests/RequestsTable';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

export default function PendingRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<AccessRequestRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listRequests({ status: 'PENDING' });
      setRequests(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPending();
    const interval = setInterval(fetchPending, 30_000);
    return () => clearInterval(interval);
  }, [fetchPending]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Pending Requests</h1>
        <p className="text-sm text-text-muted mt-1">Requests awaiting review ({requests.length})</p>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPending} />
      ) : requests.length === 0 ? (
        <EmptyState
          title="No pending requests"
          description="All requests have been reviewed."
          icon={<Clock size={48} strokeWidth={1} />}
        />
      ) : (
        <RequestsTable
          requests={requests}
          onRowClick={(r) => navigate(`/requests/${r.id}`)}
        />
      )}
    </div>
  );
}
