import DataTable from '@/components/common/DataTable';
import type { TableColumn } from '@/components/common/DataTable';
import type { UserRead } from '@/types/api';

const columns: TableColumn<UserRead>[] = [
  { key: 'id', header: 'ID' },
  { key: 'full_name', header: 'Full Name' },
  { key: 'email', header: 'Email' },
  {
    key: 'role',
    header: 'Role',
    render: (row) => (
      <span className={`text-xs font-semibold uppercase tracking-wider ${row.role === 'ADMIN' ? 'text-gs-orange' : 'text-text-secondary'}`}>
        {row.role}
      </span>
    ),
  },
  {
    key: 'is_active',
    header: 'Active',
    render: (row) => (
      <span className={row.is_active ? 'badge-active' : 'badge-expired'}>
        {row.is_active ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  {
    key: 'must_change_password',
    header: 'Password Setup',
    render: (row) =>
      row.must_change_password ? (
        <span className="badge-pending">Pending</span>
      ) : (
        <span className="text-text-muted text-xs">Done</span>
      ),
  },
  {
    key: 'last_login_at',
    header: 'Last Login',
    render: (row) =>
      row.last_login_at
        ? new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(row.last_login_at))
        : '—',
  },
  {
    key: 'created_at',
    header: 'Created',
    render: (row) =>
      new Intl.DateTimeFormat('es-PE', { dateStyle: 'short' }).format(new Date(row.created_at)),
  },
];

interface Props {
  users: UserRead[];
  onRowClick?: (row: UserRead) => void;
}

export default function UsersTable({ users, onRowClick }: Props) {
  return (
    <DataTable
      columns={columns}
      data={users}
      keyExtractor={(u) => u.id}
      onRowClick={onRowClick}
    />
  );
}
