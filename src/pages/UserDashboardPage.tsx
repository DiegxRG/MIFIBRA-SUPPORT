import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { listRequests, createRequest } from '@/api/requests';
import type { AccessRequestRead, AccessRequestCreate } from '@/types/api';
import RequestsTable from '@/components/requests/RequestsTable';
import CreateRequestForm, { type CreateRequestFormData } from '@/components/requests/CreateRequestForm';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { useNavigate } from 'react-router-dom';

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<AccessRequestRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listRequests();
      setRequests(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleCreate = async (data: CreateRequestFormData) => {
    setSubmitting(true);
    try {
      const payload: AccessRequestCreate = {
        client_ip: data.client_ip,
        client_name: data.client_name || null,
        ticket_support: data.ticket_support || null,
        reason: data.reason,
        access_type: data.access_type,
        requested_duration_minutes:
          data.access_type === 'PERMANENT'
            ? null
            : data.requested_duration_minutes
              ? Number(data.requested_duration_minutes)
              : null,
      };
      await createRequest(payload);
      toast.success('Solicitud enviada correctamente. Estado inicial: PENDIENTE DE REVISIÓN NOC.');
      setShowCreate(false);
      fetchRequests();
    } catch (err: unknown) {
      const detail =
        err && typeof err === 'object' && 'response' in err
          ? String((err as { response: { data: { detail: string } } }).response?.data?.detail ?? '')
          : '';
      toast.error(detail || 'No se pudo crear la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'PENDING').length,
    approved: requests.filter((r) => r.status === 'APPROVED').length,
    rejected: requests.filter((r) => r.status === 'REJECTED').length,
    expired: requests.filter((r) => r.status === 'EXPIRED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Mis solicitudes</h1>
          <p className="text-sm text-text-muted mt-1">Gestiona tus solicitudes de acceso</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Nueva solicitud
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-bold text-text-primary">{counts.total}</p>
          <p className="text-xs text-text-muted">Total</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-status-pending">{counts.pending}</p>
          <p className="text-xs text-text-muted">Pendientes</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-status-active">{counts.approved}</p>
          <p className="text-xs text-text-muted">Aprobadas</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-status-expired">{counts.rejected}</p>
          <p className="text-xs text-text-muted">Rechazadas</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-bold text-status-revoked">{counts.expired}</p>
          <p className="text-xs text-text-muted">Expiradas</p>
        </div>
      </div>

      {/* Create form (toggled) */}
      {showCreate && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Nueva solicitud de acceso</h2>
          <CreateRequestForm onSubmit={handleCreate} loading={submitting} />
        </div>
      )}

      {/* Requests table */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchRequests} />
      ) : requests.length === 0 ? (
        <EmptyState
          title="Todavia no hay solicitudes"
          description="Crea tu primera solicitud de acceso para comenzar."
        />
      ) : (
        <RequestsTable requests={requests} onRowClick={(r) => navigate(`/requests/${r.id}`)} />
      )}
    </div>
  );
}
