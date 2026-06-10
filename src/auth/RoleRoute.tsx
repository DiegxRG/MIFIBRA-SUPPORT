import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';
import type { UserRole } from '@/types/api';

interface Props {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export default function RoleRoute({ allowedRoles, children }: Props) {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin/pending" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
