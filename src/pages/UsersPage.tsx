import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { listUsers, updateUser, resetUserPassword } from '@/api/users';
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
    toast.success(`User created. Temp password: ${result.temporary_password}`, { duration: 10_000 });
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

  const handleToggleActive = async (user: UserRead) => {
    try {
      await updateUser(user.id, { is_active: !user.is_active });
      toast.success(`${user.full_name} ${user.is_active ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch {
      toast.error('Failed to update user');
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
          onRowClick={(user) => {
            const action = confirm(
              `${user.full_name}\n\nOK: Toggle active status\nCancel: Reset password`
            );
            if (action) {
              handleToggleActive(user);
            } else {
              handleResetPassword(user.id);
            }
          }}
        />
      )}

      {showCreateModal && (
        <UserFormModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleUserCreated}
        />
      )}
    </div>
  );
}
