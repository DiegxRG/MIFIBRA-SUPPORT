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
    header: 'List Type',
    render: (row) => (
      <span
        className={`text-xs font-semibold uppercase ${row.list_type === 'WHITELIST' ? 'text-status-active' : 'text-status-expired'}`}
      >
        {row.list_type}
      </span>
    ),
  },
  {
    key: 'source_type',
    header: 'Source Type',
    render: (row) => {
      const labels: Record<string, string> = {
        MANUAL: 'Manual',
        REQUEST_APPROVAL: 'Request Approval',
        IP_INTELLIGENCE: 'IP Intelligence',
        REJECTION: 'Rejection',
        EXTERNAL_BLACKLIST: 'External Blacklist',
      };
      return <span className="text-xs text-text-muted">{labels[row.source_type] ?? row.source_type}</span>;
    },
  },
  {
    key: 'source_name',
    header: 'Source Name',
    render: (row) => <span className="text-xs text-text-secondary">{row.source_name ?? '—'}</span>,
  },
  {
    key: 'reason',
    header: 'Reason',
    render: (row) => <span className="text-xs text-text-secondary">{row.reason ?? '—'}</span>,
  },
  {
    key: 'is_active',
    header: 'Status',
    render: (row) => (
      <span className={row.is_active ? 'badge-active' : 'badge-expired'}>
        {row.is_active ? 'Active' : 'Disabled'}
      </span>
    ),
  },
  {
    key: 'created_at',
    header: 'Created',
    render: (row) =>
      new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(row.created_at)),
  },
  {
    key: 'expires_at',
    header: 'Expires',
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
