import { Edit3, KeyRound, Trash2 } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import type { TableColumn } from '@/components/common/DataTable';
import type { UserRead } from '@/types/api';

const columns: TableColumn<UserRead>[] = [
  { key: 'id', header: 'ID' },
  { key: 'full_name', header: 'Nombre completo' },
  { key: 'email', header: 'Email' },
  {
    key: 'role',
    header: 'Rol',
    render: (row) => (
      <span className={`text-xs font-semibold uppercase tracking-wider ${row.role === 'ADMIN' ? 'text-gs-orange' : 'text-text-secondary'}`}>
        {row.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
      </span>
    ),
  },
  {
    key: 'is_active',
    header: 'Estado',
    render: (row) => (
      <span className={row.is_active ? 'badge-active' : 'badge-expired'}>
        {row.is_active ? 'Activo' : 'Inactivo'}
      </span>
    ),
  },
  {
    key: 'must_change_password',
    header: 'Cambio de clave',
    render: (row) =>
      row.must_change_password ? (
        <span className="badge-pending">Pendiente</span>
      ) : (
        <span className="text-text-muted text-xs">Completado</span>
      ),
  },
  {
    key: 'last_login_at',
    header: 'Ultimo ingreso',
    render: (row) =>
      row.last_login_at
        ? new Intl.DateTimeFormat('es-PE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(row.last_login_at))
        : '—',
  },
  {
    key: 'actions',
    header: 'Acciones',
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
                Editar
              </button>
              <button onClick={() => onResetPassword(row)} className="btn-ghost !px-2 !py-1 text-xs flex items-center gap-1">
                <KeyRound size={14} />
                Restablecer
              </button>
              <button onClick={() => onDelete(row)} className="btn-ghost !px-2 !py-1 text-xs text-status-expired flex items-center gap-1">
                <Trash2 size={14} />
                Eliminar
              </button>
            </div>
          ),
        }
  );

  return <DataTable columns={tableColumns} data={users} keyExtractor={(u) => u.id} />;
}
