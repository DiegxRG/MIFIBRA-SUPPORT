import DataTable from '@/components/common/DataTable';
import type { TableColumn } from '@/components/common/DataTable';
import type { FirewallRuleListItem } from '@/types/api';

const columns: TableColumn<FirewallRuleListItem>[] = [
  {
    key: 'ip',
    header: 'IP',
    render: (row) => <span className="font-mono text-sm">{row.ip}</span>,
  },
  {
    key: 'list_type',
    header: 'Tipo de lista',
    render: (row) => (
      <span
        className={`text-xs font-semibold uppercase ${row.list_type === 'WHITELIST' ? 'text-status-active' : 'text-status-expired'}`}
      >
        {row.list_type === 'WHITELIST' ? 'Lista blanca' : 'Lista negra'}
      </span>
    ),
  },
  {
    key: 'source_type',
    header: 'Tipo de origen',
    render: (row) => {
      const labels: Record<string, string> = {
        MANUAL: 'Manual',
        REQUEST_APPROVAL: 'Aprobacion de solicitud',
        IP_INTELLIGENCE: 'Inteligencia de IP',
        REJECTION: 'Rechazo',
        EXTERNAL_BLACKLIST: 'Lista negra externa',
      };
      return <span className="text-xs text-text-muted">{labels[row.source_type] ?? row.source_type}</span>;
    },
  },
  {
    key: 'source_name',
    header: 'Nombre de origen',
    render: (row) => <span className="text-xs text-text-secondary">{row.source_name ?? '—'}</span>,
  },
  {
    key: 'reason',
    header: 'Motivo',
    render: (row) => <span className="text-xs text-text-secondary">{row.reason ?? '—'}</span>,
  },
  {
    key: 'is_active',
    header: 'Estado',
    render: (row) => (
      <span className={row.is_active ? 'badge-active' : 'badge-expired'}>
        {row.is_active ? 'Activa' : 'Deshabilitada'}
      </span>
    ),
  },
  {
    key: 'created_at',
    header: 'Creada',
    render: (row) =>
      new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(row.created_at)),
  },
  {
    key: 'expires_at',
    header: 'Expira',
    render: (row) =>
      row.expires_at
        ? new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(row.expires_at))
        : '—',
  },
];

interface Props {
  rules: FirewallRuleListItem[];
}

export default function FirewallRulesTable({ rules }: Props) {
  return <DataTable columns={columns} data={rules} keyExtractor={(r) => r.id} />;
}
