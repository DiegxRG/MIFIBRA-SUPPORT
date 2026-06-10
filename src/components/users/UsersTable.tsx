import { Edit3, KeyRound, Trash2 } from 'lucide-react';
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
    key: 'actions',
    header: 'Actions',
  },
];

interface Props {
  users: UserRead[];
  onEdit: (row: UserRead) => void;
  onResetPassword: (row: UserRead) => void;
  onDelete: (row: UserRead) => void;
}

export default function UsersTable({ users, onEdit, onResetPassword, onDelete }: Props) {
  const tableColumns = columns.map((col) =>
    col.key !== 'actions'
      ? col
      : {
          ...col,
          render: (row: UserRead) => (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => onEdit(row)} className="btn-ghost !px-2 !py-1 text-xs flex items-center gap-1">
                <Edit3 size={14} />
                Edit
              </button>
              <button onClick={() => onResetPassword(row)} className="btn-ghost !px-2 !py-1 text-xs flex items-center gap-1">
                <KeyRound size={14} />
                Reset
              </button>
              <button onClick={() => onDelete(row)} className="btn-ghost !px-2 !py-1 text-xs text-status-expired flex items-center gap-1">
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          ),
        }
  );

  return <DataTable columns={tableColumns} data={users} keyExtractor={(u) => u.id} />;
}
