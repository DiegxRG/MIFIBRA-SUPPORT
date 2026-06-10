import DataTable from '@/components/common/DataTable';
import type { TableColumn } from '@/components/common/DataTable';
import type { FirewallRuleListItem } from '@/types/api';
import FirewallReasonCell from './FirewallReasonCell';

const columns: TableColumn<FirewallRuleListItem>[] = [
  {
    key: 'ip',
    header: 'IP',
    render: (row) => <span className="font-mono text-sm">{row.ip}</span>,
  },
  {
    key: 'source_type',
    header: 'Source Type',
    render: (row) => <span className="text-xs text-text-muted">{row.source_type}</span>,
  },
  {
    key: 'source_name',
    header: 'Source Name',
    render: (row) => <span className="text-xs text-text-secondary">{row.source_name ?? '—'}</span>,
  },
  {
    key: 'reason',
    header: 'Reason',
    className: 'min-w-[320px] max-w-[420px] align-top',
    render: (row) => <FirewallReasonCell reason={row.reason} />,
  },
  {
    key: 'is_active',
    header: 'Status',
    render: (row) => <span className={row.is_active ? 'badge-active' : 'badge-expired'}>{row.is_active ? 'Active' : 'Disabled'}</span>,
  },
  {
    key: 'created_at',
    header: 'Created At',
    render: (row) => new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(row.created_at)),
  },
];

interface Props {
  rules: FirewallRuleListItem[];
}

export default function BlacklistRulesTable({ rules }: Props) {
  return <DataTable columns={columns} data={rules} keyExtractor={(r) => r.id} />;
}
