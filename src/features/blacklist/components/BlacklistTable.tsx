import { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Spinner } from '../../../components/ui/Spinner';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { toast } from 'sonner';
import { formatDate, formatRelativeTime } from '../../../lib/utils';
import { useBlacklistStore } from '../store/blacklistStore';
import { BlacklistStatusBadge } from './BlacklistStatusBadge';
import type { BlacklistEntry, BlacklistStatus } from '../types';
import { exportBlacklistToExcel, exportBlacklistToPdf } from '../utils/exportBlacklist';

const PAGE_SIZE = 8;
type StatusFilter = 'all' | BlacklistStatus;

function getStatusLabel(status: BlacklistStatus): string {
  switch (status) {
    case 'active':
      return 'Bloqueada';
    case 'expired':
      return 'Expirada';
    case 'removed':
      return 'Retirada';
    default:
      return status;
  }
}

function entryMatchesSearch(entry: BlacklistEntry, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return [entry.clientIP, entry.ticketId, entry.agentName, entry.reason, getStatusLabel(entry.status)]
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery);
}

export function BlacklistTable() {
  const { entries: storeEntries, isLoading, error, fetchEntries, removeBlock } = useBlacklistStore();
  const entries = Array.isArray(storeEntries) ? storeEntries : [];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
      const matchesSearch = entryMatchesSearch(entry, searchQuery);
      return matchesStatus && matchesSearch;
    });
  }, [entries, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedEntries = filteredEntries.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);

  const activeCount = filteredEntries.filter((entry) => entry.status === 'active').length;
  const removedCount = filteredEntries.filter((entry) => entry.status === 'removed').length;
  const expiredCount = filteredEntries.filter((entry) => entry.status === 'expired').length;

  const handleRemove = async () => {
    if (!selectedId) return;

    try {
      await removeBlock(selectedId);
      toast.success('Bloqueo retirado', { description: 'La IP ya no figura como bloqueada.' });
    } catch {
      toast.error('No pudimos retirarlo', { description: 'Intenta nuevamente en unos segundos.' });
    } finally {
      setSelectedId(null);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsExportingExcel(true);
      await exportBlacklistToExcel({ entries: filteredEntries, search: searchQuery, status: statusFilter });
      toast.success('Excel listo', { description: 'El reporte se descargó correctamente.' });
    } catch {
      toast.error('No pudimos exportar', { description: 'El archivo Excel no pudo generarse.' });
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      await exportBlacklistToPdf({ entries: filteredEntries, search: searchQuery, status: statusFilter });
      toast.success('PDF listo', { description: 'El reporte se descargó correctamente.' });
    } catch {
      toast.error('No pudimos exportar', { description: 'El PDF no pudo generarse.' });
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (isLoading && entries.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center p-12">
        <Spinner size="lg" className="text-status-expired mb-4" />
        <p className="text-text-secondary">Cargando blacklist...</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card overflow-hidden">
        <div className="border-b border-border-subtle/60 p-5 sm:p-6">
          <div className="flex flex-col gap-6">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(620px,0.95fr)] xl:items-start">
            <div>
              <p className="section-label mb-2">Bloqueos y reportes</p>
              <h3 className="text-2xl font-bold text-text-primary">IPs bloqueadas recientemente</h3>
              <p className="mt-1 text-sm text-text-secondary">Busca, filtra y descarga los bloqueos activos o cerrados.</p>
            </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-border-subtle/60 bg-surface/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Resultados</p>
                <p className="mt-2 text-2xl font-bold text-text-primary">{filteredEntries.length}</p>
              </div>
              <div className="rounded-2xl border border-border-subtle/60 bg-surface/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Activas</p>
                <p className="mt-2 text-2xl font-bold text-status-expired">{activeCount}</p>
              </div>
              <div className="rounded-2xl border border-border-subtle/60 bg-surface/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Retiradas</p>
                <p className="mt-2 text-2xl font-bold text-status-active">{removedCount}</p>
              </div>
              <div className="rounded-2xl border border-border-subtle/60 bg-surface/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Expiradas</p>
                <p className="mt-2 text-2xl font-bold text-status-pending">{expiredCount}</p>
              </div>
            </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px_420px] xl:items-stretch">
            <div className="rounded-2xl border border-border-subtle/60 bg-surface/45 p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">Búsqueda</p>
              <div className="flex min-h-[58px] items-center gap-3 rounded-xl border border-border-subtle/60 bg-mf-darker/55 px-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-text-muted"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Busca por IP, ticket o motivo"
                  className="w-full bg-transparent text-base text-text-primary outline-none placeholder:text-text-muted"
                />
              </div>
            </div>

              <div className="rounded-2xl border border-border-subtle/60 bg-surface/45 p-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">Estado</p>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                  className="input-base min-h-[58px]"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Solo activas</option>
                  <option value="removed">Solo retiradas</option>
                  <option value="expired">Solo expiradas</option>
                </select>
              </div>

              <div className="rounded-2xl border border-border-subtle/60 bg-gradient-to-br from-surface/70 to-mf-darker/60 p-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">Exportar</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Button variant="secondary" size="sm" onClick={handleExportExcel} isLoading={isExportingExcel} className="h-auto min-h-[82px] justify-start rounded-2xl border-emerald-500/20 bg-emerald-500/8 px-4 py-3 text-left hover:border-emerald-400/40 hover:bg-emerald-500/12">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/20">
                      <img src="/icons/file-excel.svg" alt="Excel" className="h-6 w-6 object-contain" />
                    </span>
                    <span className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-text-primary">Exportar Excel</span>
                      <span className="text-xs text-emerald-200/75">Editable y listo para analizar</span>
                    </span>
                  </Button>

                  <Button variant="secondary" size="sm" onClick={handleExportPdf} isLoading={isExportingPdf} className="h-auto min-h-[82px] justify-start rounded-2xl border-rose-500/20 bg-rose-500/8 px-4 py-3 text-left hover:border-rose-400/40 hover:bg-rose-500/12">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 ring-1 ring-rose-400/20">
                      <img src="/icons/file-pdf.svg" alt="PDF" className="h-6 w-6 object-contain" />
                    </span>
                    <span className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-text-primary">Exportar PDF</span>
                      <span className="text-xs text-rose-200/75">Presentable para compartir</span>
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-status-expired/30 bg-status-expired/10 p-4 text-sm text-status-expired">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p>{error}</p>
                <Button variant="ghost" size="sm" onClick={() => fetchEntries()}>
                  Reintentar
                </Button>
              </div>
            </div>
          )}
        </div>

        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-lg font-semibold text-text-primary">No encontramos resultados</p>
            <p className="mt-2 text-sm text-text-secondary">Prueba cambiando los filtros o limpiando la búsqueda.</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Expira / cierre</TableHead>
                  <TableHead>Agente</TableHead>
                  <TableHead className="text-right">Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono font-semibold text-text-primary">{entry.clientIP}</TableCell>
                    <TableCell><BlacklistStatusBadge status={entry.status} /></TableCell>
                    <TableCell className="text-text-secondary">{entry.reason}</TableCell>
                    <TableCell className="text-text-secondary">{entry.ticketId}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        {entry.status === 'active' ? (
                          <>
                            <span className="text-sm font-semibold text-text-primary">{formatRelativeTime(entry.expiresAt)}</span>
                            <span className="text-xs text-text-muted">{formatDate(entry.expiresAt)}</span>
                          </>
                        ) : (
                          <span className="text-sm text-text-muted">
                            {entry.status === 'removed' && entry.removedAt ? `Retirada ${formatDate(entry.removedAt)}` : `Expirada ${formatDate(entry.expiresAt)}`}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-text-secondary">{entry.agentName}</TableCell>
                    <TableCell className="text-right">
                      {entry.status === 'active' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-status-active hover:text-status-active hover:bg-status-active/10"
                          onClick={() => setSelectedId(entry.id)}
                        >
                          Retirar
                        </Button>
                      ) : (
                        <span className="text-xs text-text-muted">Sin accion</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-4 border-t border-border-subtle/60 bg-surface/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-text-secondary">
                Pagina <span className="font-semibold text-text-primary">{safeCurrentPage}</span> de{' '}
                <span className="font-semibold text-text-primary">{totalPages}</span>
              </p>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Button variant="secondary" size="sm" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={safeCurrentPage === 1}>
                  Anterior
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={safeCurrentPage === totalPages}>
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={!!selectedId}
        onClose={() => setSelectedId(null)}
        title="Retirar bloqueo"
        description="La IP dejara de aparecer como bloqueada antes del tiempo previsto."
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelectedId(null)}>Cancelar</Button>
            <Button variant="primary" onClick={handleRemove}>Sí, retirar</Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">
          Si continúas, la IP saldrá de blacklist y el cambio puede reflejarse en pocos minutos.
        </p>
      </Modal>
    </>
  );
}
