import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';

export default function RootRedirect() {
  const role = useAuthStore((s) => s.user?.role);
  if (role === 'ADMIN') {
    return <Navigate to="/admin/pending" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}
