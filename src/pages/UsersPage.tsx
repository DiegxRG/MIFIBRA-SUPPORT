import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { deleteUser, listUsers, resetUserPassword } from '@/api/users';
import type { UserRead } from '@/types/api';
import type { UserCreateResponse } from '@/types/api';
import UsersTable from '@/components/users/UsersTable';
import UserFormModal from '@/components/users/UserFormModal';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';

export default function UsersPage() {
  const [users, setUsers] = useState<UserRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRead | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const handleUserCreated = (result: UserCreateResponse) => {
    toast.success(`User created: ${result.email}`);
    setShowCreateModal(false);
    fetchUsers();
  };

  const handleResetPassword = async (userId: number) => {
    try {
      const result = await resetUserPassword(userId);
      toast.success(`Password reset. Temp password: ${result.temporary_password}`, { duration: 10_000 });
    } catch {
      toast.error('Failed to reset password');
    }
  };

  const handleDeleteUser = async (user: UserRead) => {
    if (!window.confirm(`Delete user ${user.email}?`)) return;
    try {
      await deleteUser(user.id);
      toast.success(`${user.full_name} deleted`);
      fetchUsers();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? String((err as { response: { data: { detail: string } } }).response?.data?.detail ?? '')
          : 'Failed to delete user';
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Users</h1>
          <p className="text-sm text-text-muted mt-1">Manage system users</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Create User
        </button>
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchUsers} />
      ) : users.length === 0 ? (
        <EmptyState title="No users" description="Create the first user to get started." />
      ) : (
        <UsersTable
          users={users}
          onEdit={(user) => setEditingUser(user)}
          onResetPassword={(user) => handleResetPassword(user.id)}
          onDelete={handleDeleteUser}
        />
      )}

      {showCreateModal && (
        <UserFormModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleUserCreated}
        />
      )}

      {editingUser && (
        <UserFormModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdated={() => {
            setEditingUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
