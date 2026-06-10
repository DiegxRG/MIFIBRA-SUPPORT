import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Monitor } from 'lucide-react';
import { toast } from 'sonner';
import { getRequest, approveRequest, rejectRequest } from '@/api/requests';
import type { AccessRequestRead, RequestRejectionAction } from '@/types/api';
import RequestStatusBadge from '@/components/requests/RequestStatusBadge';
import ReviewActions from '@/components/requests/ReviewActions';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-border-subtle/30 last:border-0">
      <span className="w-36 text-xs text-text-muted shrink-0">{label}</span>
      <span className="text-sm text-text-primary">{value}</span>
    </div>
  );
}

export default function RequestDetailPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<AccessRequestRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequest = useCallback(async () => {
    if (!requestId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getRequest(Number(requestId));
      setRequest(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Request not found');
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequest();
  }, [fetchRequest]);

  const handleApprove = async (comment: string) => {
    if (!request) return;
    setActionLoading(true);
    try {
      const updated = await approveRequest(request.id, { review_comment: comment || null });
      setRequest(updated);
      toast.success(`Request #${request.id} approved`);
    } catch (err: unknown) {
      const detail =
        err && typeof err === 'object' && 'response' in err
          ? String((err as { response: { data: { detail: string } } }).response?.data?.detail ?? '')
          : 'Failed to approve';
      toast.error(detail);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (comment: string, action: RequestRejectionAction) => {
    if (!request) return;
    setActionLoading(true);
    try {
      const updated = await rejectRequest(request.id, {
        review_comment: comment || null,
        action,
      });
      setRequest(updated);
      toast.success(`Request #${request.id} rejected`);
    } catch (err: unknown) {
      const detail =
        err && typeof err === 'object' && 'response' in err
          ? String((err as { response: { data: { detail: string } } }).response?.data?.detail ?? '')
          : 'Failed to reject';
      toast.error(detail);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchRequest} />;
  if (!request) return <ErrorState message="Request not found" />;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="btn-ghost !px-2">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">Request #{request.id}</h1>
            <RequestStatusBadge status={request.status} />
          </div>
          <p className="text-sm text-text-muted mt-1">
            Created {new Intl.DateTimeFormat('es-PE', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(request.created_at))}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Monitor size={16} className="text-gs-orange" />
              Connection Details
            </h2>
            <DetailRow label="Client IP" value={<span className="font-mono">{request.client_ip}</span>} />
            <DetailRow label="Port" value={`${request.port}/${request.protocol}`} />
            <DetailRow label="Access Type" value={request.access_type} />
            <DetailRow
              label="Duration"
              value={
                request.access_type === 'TEMPORARY'
                  ? `${request.requested_duration_minutes} minutes`
                  : 'Permanent'
              }
            />
            {request.starts_at && (
              <DetailRow
                label="Starts At"
                value={new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(request.starts_at))}
              />
            )}
            {request.expires_at && (
              <DetailRow
                label="Expires At"
                value={
                  <span className={new Date(request.expires_at) < new Date() ? 'text-status-expired' : ''}>
                    {new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(request.expires_at))}
                  </span>
                }
              />
            )}
          </div>

          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <User size={16} className="text-gs-orange" />
              Requester & Reason
            </h2>
            <DetailRow label="Requested By" value={request.requested_by.full_name} />
            <DetailRow label="Email" value={request.requested_by.email} />
            {request.client_name && <DetailRow label="Client Name" value={request.client_name} />}
            {request.client_document && <DetailRow label="Client Document" value={request.client_document} />}
            <DetailRow
              label="Reason"
              value={<span className="text-text-secondary">{request.reason}</span>}
            />
          </div>

          {request.status === 'PENDING' && (
            <ReviewActions
              request={request}
              onApprove={handleApprove}
              onReject={handleReject}
              loading={actionLoading}
            />
          )}

          {request.reviewed_by && (
            <div className="glass-card p-5">
              <h2 className="text-sm font-semibold text-text-primary mb-3">Review Info</h2>
              <DetailRow label="Reviewed By" value={request.reviewed_by.full_name} />
              {request.review_comment && <DetailRow label="Comment" value={request.review_comment} />}
              {request.reviewed_at && (
                <DetailRow
                  label="Reviewed At"
                  value={new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(request.reviewed_at))}
                />
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
