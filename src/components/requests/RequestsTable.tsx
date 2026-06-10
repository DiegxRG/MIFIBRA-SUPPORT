import DataTable from '@/components/common/DataTable';
import type { TableColumn } from '@/components/common/DataTable';
import type { AccessRequestRead } from '@/types/api';
import RequestStatusBadge from './RequestStatusBadge';

const requestColumns: TableColumn<AccessRequestRead>[] = [
  { key: 'id', header: 'ID' },
  {
    key: 'client_ip',
    header: 'IP',
    render: (row) => <span className="font-mono text-sm">{row.client_ip}</span>,
  },
  {
    key: 'port',
    header: 'Port',
    render: (row) => `${row.port}/${row.protocol}`,
  },
  {
    key: 'status',
    header: 'Estado',
    render: (row) => <RequestStatusBadge status={row.status} />,
  },
  {
    key: 'requested_by',
    header: 'Solicitado por',
    render: (row) => row.requested_by.full_name,
  },
  {
    key: 'access_type',
    header: 'Tipo',
    render: (row) => (
      <span className="text-xs font-medium uppercase tracking-wide">
        {row.access_type === 'TEMPORARY' ? 'Temporal' : 'Permanente'}
      </span>
    ),
  },
  {
    key: 'created_at',
    header: 'Creado',
    render: (row) => formatDate(row.created_at),
  },
  {
    key: 'expires_at',
    header: 'Expira',
    render: (row) => (row.expires_at ? formatDate(row.expires_at) : '—'),
  },
];

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso));
}

interface Props {
  requests: AccessRequestRead[];
  onRowClick?: (row: AccessRequestRead) => void;
}

export default function RequestsTable({ requests, onRowClick }: Props) {
  return (
    <DataTable
      columns={requestColumns}
      data={requests}
      keyExtractor={(r) => r.id}
      onRowClick={onRowClick}
    />
  );
}
